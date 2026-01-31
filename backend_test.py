#!/usr/bin/env python3

import requests
import sys
import time
from datetime import datetime

class SpacecraftAPITester:
    def __init__(self, base_url="https://mission-survival.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=10):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Non-dict response'}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            self.failed_tests.append({'name': name, 'error': 'Timeout'})
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({'name': name, 'error': str(e)})
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_telemetry(self):
        """Test telemetry endpoint"""
        success, data = self.run_test("Telemetry Data", "GET", "telemetry", 200)
        if success and data:
            required_fields = ['mission_id', 'altitude', 'velocity', 'fuel', 'tilt', 'disturbance', 'system_health', 'phase', 'timestamp']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"⚠️  Missing telemetry fields: {missing_fields}")
                return False
            else:
                print(f"   ✓ All telemetry fields present")
                print(f"   Mission: {data.get('mission_id')}, Phase: {data.get('phase')}")
                print(f"   Altitude: {data.get('altitude')}m, Fuel: {data.get('fuel')}%")
        return success

    def test_risk_assessment(self):
        """Test risk assessment endpoint"""
        success, data = self.run_test("Risk Assessment", "GET", "risk-assessment", 200)
        if success and data:
            required_fields = ['overall_risk', 'components', 'confidence', 'urgency_factor', 'status']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"⚠️  Missing risk fields: {missing_fields}")
                return False
            else:
                print(f"   ✓ All risk fields present")
                print(f"   Overall Risk: {data.get('overall_risk'):.2f}, Status: {data.get('status')}")
                print(f"   Confidence: {data.get('confidence'):.2f}")
        return success

    def test_decision(self):
        """Test decision endpoint"""
        success, data = self.run_test("Decision Making", "GET", "decision", 200)
        if success and data:
            required_fields = ['decision', 'timestamp', 'phase', 'confidence', 'reasoning', 'violated_rules', 'alternatives_considered', 'risk_score']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"⚠️  Missing decision fields: {missing_fields}")
                return False
            else:
                print(f"   ✓ All decision fields present")
                print(f"   Decision: {data.get('decision')}")
                print(f"   Reasoning: {len(data.get('reasoning', []))} points")
        return success

    def test_decision_explanation(self):
        """Test decision explanation endpoint"""
        success, data = self.run_test("Decision Explanation", "GET", "decision-explanation", 200)
        if success and data:
            required_fields = ['decision_summary', 'timeline', 'ml_factors', 'rule_analysis']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"⚠️  Missing explanation fields: {missing_fields}")
                return False
            else:
                print(f"   ✓ All explanation fields present")
                print(f"   Timeline events: {len(data.get('timeline', []))}")
                print(f"   Rule violations: {len(data.get('rule_analysis', []))}")
        return success

    def test_scenario_simulation(self):
        """Test scenario simulation endpoint"""
        test_params = {
            "disturbance": 0.8,
            "fuel": 15.0,
            "sensor_noise": 0.3,
            "reaction_delay": 200
        }
        success, data = self.run_test("Scenario Simulation", "POST", "scenario-simulate", 200, test_params)
        if success and data:
            required_fields = ['telemetry', 'risk_assessment', 'decision']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"⚠️  Missing simulation fields: {missing_fields}")
                return False
            else:
                print(f"   ✓ All simulation fields present")
                print(f"   Simulated decision: {data.get('decision', {}).get('decision', 'N/A')}")
                print(f"   Risk after simulation: {data.get('risk_assessment', {}).get('overall_risk', 0):.2f}")
        return success

    def test_mission_reset(self):
        """Test mission reset endpoint"""
        success, data = self.run_test("Mission Reset", "POST", "mission-reset", 200)
        if success and data:
            if data.get('status') == 'Mission reset successful':
                print(f"   ✓ Mission reset confirmed")
            else:
                print(f"⚠️  Unexpected reset response: {data}")
        return success

    def test_mission_logs_get(self):
        """Test getting mission logs"""
        success, data = self.run_test("Get Mission Logs", "GET", "mission-logs", 200)
        if success:
            if isinstance(data, list):
                print(f"   ✓ Mission logs returned as list with {len(data)} entries")
            else:
                print(f"⚠️  Mission logs not returned as list: {type(data)}")
        return success

    def test_mission_logs_post(self):
        """Test creating mission log"""
        test_log = {
            "mission_id": "MSN-TEST-001",
            "outcome": "SUCCESSFUL_LANDING",
            "max_risk": 0.35,
            "decision_count": 12,
            "final_altitude": 0.0,
            "final_fuel": 42.5
        }
        success, data = self.run_test("Create Mission Log", "POST", "mission-logs", 200, test_log)
        if success and data:
            required_fields = ['id', 'mission_id', 'outcome', 'max_risk', 'decision_count', 'timestamp', 'final_altitude', 'final_fuel']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"⚠️  Missing log fields: {missing_fields}")
                return False
            else:
                print(f"   ✓ Mission log created with ID: {data.get('id')}")
        return success

    def test_data_consistency(self):
        """Test that multiple calls return consistent data structure"""
        print(f"\n🔍 Testing Data Consistency...")
        
        # Get telemetry twice with small delay
        success1, data1 = self.run_test("Telemetry Call 1", "GET", "telemetry", 200)
        time.sleep(2)
        success2, data2 = self.run_test("Telemetry Call 2", "GET", "telemetry", 200)
        
        if success1 and success2:
            # Check that data structure is consistent
            keys1 = set(data1.keys()) if data1 else set()
            keys2 = set(data2.keys()) if data2 else set()
            
            if keys1 == keys2:
                print(f"   ✓ Telemetry structure consistent across calls")
                
                # Check that values are updating (simulation running)
                if data1.get('timestamp') != data2.get('timestamp'):
                    print(f"   ✓ Telemetry data is updating (timestamps differ)")
                else:
                    print(f"   ⚠️  Telemetry timestamps identical - simulation may not be running")
                    
                return True
            else:
                print(f"   ❌ Inconsistent telemetry structure")
                print(f"      Call 1 keys: {keys1}")
                print(f"      Call 2 keys: {keys2}")
                return False
        return False

def main():
    print("🚀 Autonomous Spacecraft Decision System - API Testing")
    print("=" * 60)
    
    tester = SpacecraftAPITester()
    
    # Core API Tests
    print("\n📡 CORE API ENDPOINTS")
    tester.test_root_endpoint()
    tester.test_telemetry()
    tester.test_risk_assessment()
    tester.test_decision()
    tester.test_decision_explanation()
    
    # Simulation Tests
    print("\n🎮 SIMULATION ENDPOINTS")
    tester.test_scenario_simulation()
    tester.test_mission_reset()
    
    # Data Persistence Tests
    print("\n💾 DATA PERSISTENCE")
    tester.test_mission_logs_get()
    tester.test_mission_logs_post()
    
    # Consistency Tests
    print("\n🔄 DATA CONSISTENCY")
    tester.test_data_consistency()
    
    # Final Results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for i, test in enumerate(tester.failed_tests, 1):
            print(f"  {i}. {test['name']}")
            if 'expected' in test:
                print(f"     Expected: {test['expected']}, Got: {test['actual']}")
            if 'error' in test:
                print(f"     Error: {test['error']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())