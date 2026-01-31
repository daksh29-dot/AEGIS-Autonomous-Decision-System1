from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import random
import math


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== SIMULATION ENGINE ====================

class TelemetryData:
    """Real-time spacecraft telemetry simulation"""
    def __init__(self):
        self.altitude = 15000.0  # meters
        self.velocity = -50.0  # m/s (negative = descending)
        self.fuel = 85.0  # percentage
        self.tilt = 2.5  # degrees
        self.disturbance = 0.3  # environmental factor 0-1
        self.system_health = 95.0  # percentage
        self.phase = "Descent"  # Descent, Alignment, Terminal
        
    def update(self, scenario_params: Optional[Dict] = None):
        """Update telemetry with physics simulation"""
        if scenario_params:
            # Apply scenario overrides
            self.disturbance = scenario_params.get('disturbance', self.disturbance)
            self.fuel = scenario_params.get('fuel', self.fuel)
            
        # Physics simulation
        time_step = 5.0  # seconds
        
        # Altitude decreases based on velocity
        self.altitude += self.velocity * time_step
        
        # Add turbulence based on disturbance
        turbulence = random.uniform(-5, 5) * self.disturbance
        self.tilt += turbulence
        self.tilt = max(-15, min(15, self.tilt))  # Clamp to ±15 degrees
        
        # Fuel consumption
        fuel_rate = 0.5 + (abs(self.tilt) / 10.0) * 0.3
        self.fuel -= fuel_rate
        self.fuel = max(0, self.fuel)
        
        # Velocity adjustments based on altitude
        if self.altitude > 5000:
            self.velocity = -50 + random.uniform(-5, 5)
        elif self.altitude > 1000:
            self.velocity = -20 + random.uniform(-3, 3)
            self.phase = "Alignment"
        else:
            self.velocity = -5 + random.uniform(-2, 2)
            self.phase = "Terminal"
            
        # System health degrades with extreme conditions
        if abs(self.tilt) > 8 or self.disturbance > 0.7:
            self.system_health -= 0.5
            
        self.system_health = max(50, min(100, self.system_health))
        
        # Environmental disturbance varies
        self.disturbance += random.uniform(-0.1, 0.1)
        self.disturbance = max(0, min(1, self.disturbance))

# Global telemetry state
current_telemetry = TelemetryData()


class RiskAssessor:
    """ML-based risk assessment with transparent scoring"""
    
    @staticmethod
    def calculate_risk(telemetry: TelemetryData) -> Dict[str, Any]:
        """Calculate multi-factor risk score"""
        
        # Component risk calculations (0-1 scale)
        fuel_risk = max(0, (30 - telemetry.fuel) / 30.0) if telemetry.fuel < 30 else 0
        
        stability_risk = abs(telemetry.tilt) / 15.0  # Max tilt is 15 degrees
        
        env_risk = telemetry.disturbance
        
        health_risk = max(0, (95 - telemetry.system_health) / 45.0)
        
        # Altitude-based urgency factor
        if telemetry.altitude < 500:
            urgency_multiplier = 1.5
        elif telemetry.altitude < 2000:
            urgency_multiplier = 1.2
        else:
            urgency_multiplier = 1.0
            
        # Weighted risk score
        weights = {
            'fuel': 0.25,
            'stability': 0.35,
            'environment': 0.20,
            'health': 0.20
        }
        
        overall_risk = (
            fuel_risk * weights['fuel'] +
            stability_risk * weights['stability'] +
            env_risk * weights['environment'] +
            health_risk * weights['health']
        ) * urgency_multiplier
        
        overall_risk = min(1.0, overall_risk)
        
        # Confidence based on sensor quality
        confidence = 0.85 + (telemetry.system_health - 80) / 100.0
        confidence = max(0.7, min(0.99, confidence))
        
        return {
            'overall_risk': round(overall_risk, 3),
            'components': {
                'fuel_risk': round(fuel_risk, 3),
                'stability_risk': round(stability_risk, 3),
                'environmental_risk': round(env_risk, 3),
                'system_health_risk': round(health_risk, 3)
            },
            'confidence': round(confidence, 3),
            'urgency_factor': round(urgency_multiplier, 2)
        }


class DecisionFabric:
    """Hybrid rule-based + ML decision system"""
    
    @staticmethod
    def make_decision(telemetry: TelemetryData, risk_assessment: Dict) -> Dict[str, Any]:
        """Make autonomous landing decision"""
        
        overall_risk = risk_assessment['overall_risk']
        components = risk_assessment['components']
        
        # Rule-based safety constraints (HARD RULES)
        violated_rules = []
        
        if telemetry.fuel < 10:
            violated_rules.append({
                'rule': 'FUEL_CRITICAL',
                'description': 'Fuel level below 10% threshold',
                'severity': 'CRITICAL'
            })
            
        if abs(telemetry.tilt) > 10:
            violated_rules.append({
                'rule': 'TILT_EXCEEDED',
                'description': f'Tilt angle {telemetry.tilt:.1f}° exceeds ±10° safety margin',
                'severity': 'CRITICAL'
            })
            
        if telemetry.disturbance > 0.75:
            violated_rules.append({
                'rule': 'ENVIRONMENT_UNSTABLE',
                'description': 'Environmental disturbance exceeds safe threshold',
                'severity': 'HIGH'
            })
            
        if telemetry.system_health < 70:
            violated_rules.append({
                'rule': 'SYSTEM_DEGRADED',
                'description': f'System health at {telemetry.system_health:.1f}%',
                'severity': 'HIGH'
            })
        
        # Decision logic
        decision = None
        reasoning = []
        alternatives_considered = []
        
        if overall_risk < 0.3:
            decision = "PROCEED_WITH_LANDING"
            reasoning.append("Overall risk within acceptable parameters")
            reasoning.append(f"All systems nominal (risk score: {overall_risk:.2f})")
            alternatives_considered.append({
                'action': 'HOLD_AND_STABILIZE',
                'rejected_reason': 'Unnecessary - conditions are optimal'
            })
            
        elif overall_risk < 0.6:
            if components['stability_risk'] > 0.5:
                decision = "HOLD_AND_STABILIZE"
                reasoning.append("Stability risk elevated - entering hold pattern")
                reasoning.append(f"Waiting for tilt to normalize (current: {telemetry.tilt:.1f}°)")
                alternatives_considered.append({
                    'action': 'PROCEED_WITH_LANDING',
                    'rejected_reason': 'Stability margin insufficient'
                })
            else:
                decision = "PROCEED_WITH_LANDING"
                reasoning.append("Risk manageable with current trajectory")
                reasoning.append("Monitoring environmental conditions")
                
        else:
            # Critical risk - check for abort conditions
            if len(violated_rules) >= 2 or any(r['severity'] == 'CRITICAL' for r in violated_rules):
                decision = "ABORT_MISSION"
                reasoning.append("Multiple critical safety violations detected")
                reasoning.append(f"Risk score {overall_risk:.2f} exceeds threshold 0.6")
                for rule in violated_rules:
                    reasoning.append(f"⚠ {rule['description']}")
                alternatives_considered.extend([
                    {
                        'action': 'HOLD_AND_STABILIZE',
                        'rejected_reason': 'Conditions too degraded for safe hold'
                    },
                    {
                        'action': 'EMERGENCY_DIVERT',
                        'rejected_reason': 'Insufficient fuel for alternate site'
                    }
                ])
            else:
                decision = "HOLD_AND_STABILIZE"
                reasoning.append("Risk elevated but recoverable")
                reasoning.append("Attempting stabilization before landing attempt")
                
        return {
            'decision': decision,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'phase': telemetry.phase,
            'confidence': risk_assessment['confidence'],
            'reasoning': reasoning,
            'violated_rules': violated_rules,
            'alternatives_considered': alternatives_considered,
            'risk_score': overall_risk
        }


# ==================== PYDANTIC MODELS ====================

class TelemetryResponse(BaseModel):
    mission_id: str
    altitude: float
    velocity: float
    fuel: float
    tilt: float
    disturbance: float
    system_health: float
    phase: str
    timestamp: str

class RiskResponse(BaseModel):
    overall_risk: float
    components: Dict[str, float]
    confidence: float
    urgency_factor: float
    status: str  # 'NOMINAL', 'CAUTION', 'CRITICAL'

class DecisionResponse(BaseModel):
    decision: str
    timestamp: str
    phase: str
    confidence: float
    reasoning: List[str]
    violated_rules: List[Dict]
    alternatives_considered: List[Dict]
    risk_score: float

class DecisionExplanation(BaseModel):
    decision_summary: DecisionResponse
    timeline: List[Dict[str, str]]
    ml_factors: Dict[str, Any]
    rule_analysis: List[Dict]

class ScenarioParams(BaseModel):
    disturbance: Optional[float] = None
    fuel: Optional[float] = None
    sensor_noise: Optional[float] = None
    reaction_delay: Optional[int] = None

class MissionLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mission_id: str
    outcome: str
    max_risk: float
    decision_count: int
    timestamp: str
    final_altitude: float
    final_fuel: float

class MissionLogCreate(BaseModel):
    mission_id: str
    outcome: str
    max_risk: float
    decision_count: int
    final_altitude: float
    final_fuel: float


# ==================== API ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Autonomous Mission Survival & Decision Fabric - API Active"}

@api_router.get("/telemetry", response_model=TelemetryResponse)
async def get_telemetry():
    """Get current spacecraft telemetry"""
    current_telemetry.update()
    
    return TelemetryResponse(
        mission_id="MSN-" + str(uuid.uuid4())[:8].upper(),
        altitude=round(current_telemetry.altitude, 1),
        velocity=round(current_telemetry.velocity, 1),
        fuel=round(current_telemetry.fuel, 1),
        tilt=round(current_telemetry.tilt, 2),
        disturbance=round(current_telemetry.disturbance, 2),
        system_health=round(current_telemetry.system_health, 1),
        phase=current_telemetry.phase,
        timestamp=datetime.now(timezone.utc).isoformat()
    )

@api_router.get("/risk-assessment", response_model=RiskResponse)
async def get_risk_assessment():
    """Get current risk assessment"""
    risk_data = RiskAssessor.calculate_risk(current_telemetry)
    
    # Determine status
    if risk_data['overall_risk'] < 0.3:
        status = "NOMINAL"
    elif risk_data['overall_risk'] < 0.6:
        status = "CAUTION"
    else:
        status = "CRITICAL"
    
    return RiskResponse(
        overall_risk=risk_data['overall_risk'],
        components=risk_data['components'],
        confidence=risk_data['confidence'],
        urgency_factor=risk_data['urgency_factor'],
        status=status
    )

@api_router.get("/decision", response_model=DecisionResponse)
async def get_decision():
    """Get current autonomous decision"""
    risk_data = RiskAssessor.calculate_risk(current_telemetry)
    decision_data = DecisionFabric.make_decision(current_telemetry, risk_data)
    
    return DecisionResponse(**decision_data)

@api_router.get("/decision-explanation", response_model=DecisionExplanation)
async def get_decision_explanation():
    """Get detailed decision explanation"""
    risk_data = RiskAssessor.calculate_risk(current_telemetry)
    decision_data = DecisionFabric.make_decision(current_telemetry, risk_data)
    
    # Build timeline
    timeline = [
        {
            'time': 'T-30s',
            'event': f'Mission phase: {current_telemetry.phase}',
            'impact': 'Monitoring descent profile'
        },
        {
            'time': 'T-25s',
            'event': f'Environmental disturbance: {current_telemetry.disturbance:.2f}',
            'impact': 'Stability monitoring active'
        },
        {
            'time': 'T-20s',
            'event': f'Tilt angle: {current_telemetry.tilt:.1f}°',
            'impact': 'Within normal parameters' if abs(current_telemetry.tilt) < 8 else 'Approaching safety limit'
        },
        {
            'time': 'T-15s',
            'event': f'Risk assessment: {risk_data["overall_risk"]:.2f}',
            'impact': 'Decision fabric activated'
        },
        {
            'time': 'T-10s',
            'event': f'Decision: {decision_data["decision"]}',
            'impact': 'Action triggered'
        }
    ]
    
    # ML factors
    ml_factors = {
        'risk_score': risk_data['overall_risk'],
        'confidence': risk_data['confidence'],
        'primary_contributors': [
            f"Stability risk: {risk_data['components']['stability_risk']:.2f}",
            f"Environmental risk: {risk_data['components']['environmental_risk']:.2f}",
            f"Fuel risk: {risk_data['components']['fuel_risk']:.2f}"
        ],
        'model_type': 'Weighted Multi-Factor Assessment',
        'sensor_reliability': f"{current_telemetry.system_health:.1f}%"
    }
    
    return DecisionExplanation(
        decision_summary=DecisionResponse(**decision_data),
        timeline=timeline,
        ml_factors=ml_factors,
        rule_analysis=decision_data['violated_rules']
    )

@api_router.post("/scenario-simulate")
async def simulate_scenario(params: ScenarioParams):
    """Simulate mission with custom parameters"""
    # Apply scenario parameters
    scenario_dict = params.model_dump(exclude_none=True)
    current_telemetry.update(scenario_dict)
    
    # Get updated assessments
    risk_data = RiskAssessor.calculate_risk(current_telemetry)
    decision_data = DecisionFabric.make_decision(current_telemetry, risk_data)
    
    return {
        'telemetry': {
            'altitude': round(current_telemetry.altitude, 1),
            'velocity': round(current_telemetry.velocity, 1),
            'fuel': round(current_telemetry.fuel, 1),
            'tilt': round(current_telemetry.tilt, 2),
            'disturbance': round(current_telemetry.disturbance, 2),
            'system_health': round(current_telemetry.system_health, 1)
        },
        'risk_assessment': risk_data,
        'decision': decision_data
    }

@api_router.post("/mission-reset")
async def reset_mission():
    """Reset mission to initial state"""
    global current_telemetry
    current_telemetry = TelemetryData()
    return {"status": "Mission reset successful"}

@api_router.post("/mission-logs", response_model=MissionLog)
async def create_mission_log(log_input: MissionLogCreate):
    """Store mission log"""
    log_obj = MissionLog(**log_input.model_dump())
    doc = log_obj.model_dump()
    _ = await db.mission_logs.insert_one(doc)
    return log_obj

@api_router.get("/mission-logs", response_model=List[MissionLog])
async def get_mission_logs():
    """Get all mission logs"""
    logs = await db.mission_logs.find({}, {"_id": 0}).sort("timestamp", -1).to_list(100)
    return logs


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
