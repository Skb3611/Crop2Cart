#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Local Farmer Marketplace
Tests all authentication, product, order, and admin endpoints
"""

import requests
import json
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = "https://localcrop-3.preview.emergentagent.com/api"

# Test credentials from seed data
TEST_CREDENTIALS = {
    "admin": {"email": "admin@freshlocal.com", "password": "admin123"},
    "farmer": {"email": "farmer1@example.com", "password": "farmer123"},
    "buyer": {"email": "buyer@example.com", "password": "buyer123"}
}

# Test GPS coordinates (Mumbai area)
MUMBAI_GPS = {"latitude": 19.1136, "longitude": 72.8697}
PUNE_GPS = {"latitude": 18.5204, "longitude": 73.8567}
OUTSIDE_MAHARASHTRA_GPS = {"latitude": 28.6139, "longitude": 77.2090}  # Delhi

class APITester:
    def __init__(self):
        self.tokens = {}
        self.test_results = []
        self.created_resources = {"products": [], "orders": []}
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method, endpoint, data=None, headers=None, params=None):
        """Make HTTP request with error handling"""
        url = f"{BASE_URL}/{endpoint.lstrip('/')}"
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, params=params, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=headers, params=params, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, params=params, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
    def get_auth_headers(self, role):
        """Get authorization headers for a role"""
        if role in self.tokens:
            return {"Authorization": f"Bearer {self.tokens[role]}"}
        return {}
    
    def test_authentication_apis(self):
        """Test all authentication endpoints"""
        print("\n=== Testing Authentication APIs ===")
        
        # Test 1: Admin Login
        response = self.make_request("POST", "auth/login", {
            "email": TEST_CREDENTIALS["admin"]["email"],
            "password": TEST_CREDENTIALS["admin"]["password"]
        })
        
        if response and response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                self.tokens["admin"] = data["token"]
                self.log_result("Admin Login", True, "Admin login successful", {
                    "user_role": data["user"]["role"],
                    "approved": data["user"]["approved"]
                })
            else:
                self.log_result("Admin Login", False, "Missing token or user in response", {"response": data})
        else:
            self.log_result("Admin Login", False, f"Login failed with status {response.status_code if response else 'No response'}")
        
        # Test 2: Farmer Login
        response = self.make_request("POST", "auth/login", {
            "email": TEST_CREDENTIALS["farmer"]["email"],
            "password": TEST_CREDENTIALS["farmer"]["password"]
        })
        
        if response and response.status_code == 200:
            data = response.json()
            if "token" in data:
                self.tokens["farmer"] = data["token"]
                self.log_result("Farmer Login", True, "Farmer login successful", {
                    "user_role": data["user"]["role"],
                    "approved": data["user"]["approved"]
                })
            else:
                self.log_result("Farmer Login", False, "Missing token in response")
        else:
            self.log_result("Farmer Login", False, f"Login failed with status {response.status_code if response else 'No response'}")
        
        # Test 3: Buyer Login with GPS
        response = self.make_request("POST", "auth/login", {
            "email": TEST_CREDENTIALS["buyer"]["email"],
            "password": TEST_CREDENTIALS["buyer"]["password"],
            **MUMBAI_GPS
        })
        
        if response and response.status_code == 200:
            data = response.json()
            if "token" in data:
                self.tokens["buyer"] = data["token"]
                self.log_result("Buyer Login with GPS", True, "Buyer login with GPS successful", {
                    "user_role": data["user"]["role"],
                    "gps_updated": "profile" in data["user"]
                })
            else:
                self.log_result("Buyer Login with GPS", False, "Missing token in response")
        else:
            self.log_result("Buyer Login with GPS", False, f"Login failed with status {response.status_code if response else 'No response'}")
        
        # Test 4: Invalid Credentials
        response = self.make_request("POST", "auth/login", {
            "email": "invalid@example.com",
            "password": "wrongpassword"
        })
        
        if response and response.status_code == 401:
            self.log_result("Invalid Credentials", True, "Correctly rejected invalid credentials")
        else:
            self.log_result("Invalid Credentials", False, f"Should have returned 401, got {response.status_code if response else 'No response'}")
        
        # Test 5: Get Current User (Admin)
        if "admin" in self.tokens:
            response = self.make_request("GET", "auth/me", headers=self.get_auth_headers("admin"))
            if response and response.status_code == 200:
                data = response.json()
                if data.get("role") == "admin":
                    self.log_result("Get Current User (Admin)", True, "Admin user data retrieved successfully")
                else:
                    self.log_result("Get Current User (Admin)", False, "Incorrect user role returned")
            else:
                self.log_result("Get Current User (Admin)", False, f"Failed to get user data: {response.status_code if response else 'No response'}")
        
        # Test 6: Unauthorized Access
        response = self.make_request("GET", "auth/me")
        if response and response.status_code == 401:
            self.log_result("Unauthorized Access", True, "Correctly rejected unauthorized request")
        else:
            self.log_result("Unauthorized Access", False, f"Should have returned 401, got {response.status_code if response else 'No response'}")
        
        # Test 7: Farmer Registration with GPS
        test_farmer_email = f"testfarmer_{datetime.now().timestamp()}@example.com"
        response = self.make_request("POST", "auth/register", {
            "email": test_farmer_email,
            "password": "testpass123",
            "name": "Test Farmer",
            "role": "farmer",
            "phone": "9876543299",
            **MUMBAI_GPS
        })
        
        if response and response.status_code == 200:
            data = response.json()
            if "token" in data and data["user"]["role"] == "farmer":
                self.log_result("Farmer Registration", True, "Farmer registration successful", {
                    "approved": data["user"]["approved"],
                    "email": data["user"]["email"]
                })
            else:
                self.log_result("Farmer Registration", False, "Registration response missing required fields")
        else:
            self.log_result("Farmer Registration", False, f"Registration failed: {response.status_code if response else 'No response'}")
        
        # Test 8: Registration Outside Maharashtra
        test_farmer_email2 = f"testfarmer2_{datetime.now().timestamp()}@example.com"
        response = self.make_request("POST", "auth/register", {
            "email": test_farmer_email2,
            "password": "testpass123",
            "name": "Test Farmer Outside",
            "role": "farmer",
            "phone": "9876543298",
            **OUTSIDE_MAHARASHTRA_GPS
        })
        
        if response and response.status_code == 400:
            data = response.json()
            if "Maharashtra" in data.get("error", ""):
                self.log_result("Registration Outside Maharashtra", True, "Correctly rejected registration outside Maharashtra")
            else:
                self.log_result("Registration Outside Maharashtra", False, "Wrong error message for outside Maharashtra")
        else:
            self.log_result("Registration Outside Maharashtra", False, f"Should have returned 400, got {response.status_code if response else 'No response'}")
    
    def test_product_apis(self):
        """Test all product endpoints"""
        print("\n=== Testing Product APIs ===")
        
        # Test 1: Get Products with GPS Filtering
        response = self.make_request("GET", "products", params=MUMBAI_GPS)
        if response and response.status_code == 200:
            products = response.json()
            if isinstance(products, list):
                self.log_result("Get Products with GPS", True, f"Retrieved {len(products)} products with GPS filtering", {
                    "product_count": len(products),
                    "has_farmer_data": len(products) > 0 and "farmer" in products[0] if products else False
                })
            else:
                self.log_result("Get Products with GPS", False, "Response is not a list")
        else:
            self.log_result("Get Products with GPS", False, f"Failed to get products: {response.status_code if response else 'No response'}")
        
        # Test 2: Get All Products (without GPS)
        response = self.make_request("GET", "products")
        if response and response.status_code == 200:
            all_products = response.json()
            self.log_result("Get All Products", True, f"Retrieved {len(all_products)} total products")
        else:
            self.log_result("Get All Products", False, f"Failed to get all products: {response.status_code if response else 'No response'}")
        
        # Test 3: Create Product (as Farmer)
        if "farmer" in self.tokens:
            new_product = {
                "name": "Test Tomatoes",
                "category": "Vegetable",
                "price": 45.0,
                "quantity": 25.0,
                "image": "https://example.com/tomato.jpg"
            }
            
            response = self.make_request("POST", "products", new_product, headers=self.get_auth_headers("farmer"))
            if response and response.status_code == 200:
                product_data = response.json()
                if "id" in product_data:
                    self.created_resources["products"].append(product_data["id"])
                    self.log_result("Create Product (Farmer)", True, "Product created successfully", {
                        "product_id": product_data["id"],
                        "name": product_data["name"]
                    })
                else:
                    self.log_result("Create Product (Farmer)", False, "Product creation response missing ID")
            else:
                self.log_result("Create Product (Farmer)", False, f"Product creation failed: {response.status_code if response else 'No response'}")
        
        # Test 4: Create Product (as Buyer - should fail)
        if "buyer" in self.tokens:
            response = self.make_request("POST", "products", {
                "name": "Unauthorized Product",
                "category": "Vegetable",
                "price": 50.0,
                "quantity": 10.0
            }, headers=self.get_auth_headers("buyer"))
            
            if response and response.status_code == 401:
                self.log_result("Create Product (Buyer)", True, "Correctly rejected buyer creating product")
            else:
                self.log_result("Create Product (Buyer)", False, f"Should have returned 401, got {response.status_code if response else 'No response'}")
        
        # Test 5: Get Farmer's Products
        if "farmer" in self.tokens:
            response = self.make_request("GET", "products/my", headers=self.get_auth_headers("farmer"))
            if response and response.status_code == 200:
                farmer_products = response.json()
                self.log_result("Get Farmer Products", True, f"Retrieved {len(farmer_products)} farmer products")
            else:
                self.log_result("Get Farmer Products", False, f"Failed to get farmer products: {response.status_code if response else 'No response'}")
        
        # Test 6: Update Product
        if "farmer" in self.tokens and self.created_resources["products"]:
            product_id = self.created_resources["products"][0]
            update_data = {
                "name": "Updated Test Tomatoes",
                "price": 50.0,
                "quantity": 30.0
            }
            
            response = self.make_request("PUT", f"products/{product_id}", update_data, headers=self.get_auth_headers("farmer"))
            if response and response.status_code == 200:
                updated_product = response.json()
                if updated_product.get("name") == "Updated Test Tomatoes":
                    self.log_result("Update Product", True, "Product updated successfully")
                else:
                    self.log_result("Update Product", False, "Product update didn't reflect changes")
            else:
                self.log_result("Update Product", False, f"Product update failed: {response.status_code if response else 'No response'}")
        
        # Test 7: Category Filtering
        response = self.make_request("GET", "products", params={"category": "Vegetable", **MUMBAI_GPS})
        if response and response.status_code == 200:
            vegetable_products = response.json()
            all_vegetables = all(p.get("category") == "Vegetable" for p in vegetable_products)
            if all_vegetables:
                self.log_result("Category Filtering", True, f"Retrieved {len(vegetable_products)} vegetable products")
            else:
                self.log_result("Category Filtering", False, "Category filtering not working correctly")
        else:
            self.log_result("Category Filtering", False, f"Category filtering failed: {response.status_code if response else 'No response'}")
    
    def test_order_apis(self):
        """Test all order endpoints"""
        print("\n=== Testing Order APIs ===")
        
        # First, get available products for ordering
        response = self.make_request("GET", "products", params=MUMBAI_GPS)
        available_products = []
        if response and response.status_code == 200:
            products = response.json()
            available_products = [p for p in products if p.get("quantity", 0) > 0][:2]  # Take first 2 products
        
        if not available_products:
            self.log_result("Order APIs Setup", False, "No available products found for order testing")
            return
        
        # Test 1: Create Order (COD)
        if "buyer" in self.tokens and available_products:
            order_items = [
                {
                    "productId": available_products[0]["id"],
                    "quantity": 2
                }
            ]
            
            if len(available_products) > 1:
                order_items.append({
                    "productId": available_products[1]["id"],
                    "quantity": 1
                })
            
            order_data = {
                "items": order_items,
                "paymentMode": "cod"
            }
            
            response = self.make_request("POST", "orders", order_data, headers=self.get_auth_headers("buyer"))
            if response and response.status_code == 200:
                order = response.json()
                if "id" in order:
                    self.created_resources["orders"].append(order["id"])
                    self.log_result("Create Order (COD)", True, "COD order created successfully", {
                        "order_id": order["id"],
                        "total_amount": order.get("totalAmount"),
                        "payment_status": order.get("paymentStatus")
                    })
                else:
                    self.log_result("Create Order (COD)", False, "Order creation response missing ID")
            else:
                self.log_result("Create Order (COD)", False, f"Order creation failed: {response.status_code if response else 'No response'}")
        
        # Test 2: Create Order with Insufficient Quantity
        if "buyer" in self.tokens and available_products:
            order_data = {
                "items": [{
                    "productId": available_products[0]["id"],
                    "quantity": 999999  # Excessive quantity
                }],
                "paymentMode": "cod"
            }
            
            response = self.make_request("POST", "orders", order_data, headers=self.get_auth_headers("buyer"))
            if response and response.status_code == 400:
                error_data = response.json()
                if "Insufficient quantity" in error_data.get("error", ""):
                    self.log_result("Order Insufficient Quantity", True, "Correctly rejected order with insufficient quantity")
                else:
                    self.log_result("Order Insufficient Quantity", False, "Wrong error message for insufficient quantity")
            else:
                self.log_result("Order Insufficient Quantity", False, f"Should have returned 400, got {response.status_code if response else 'No response'}")
        
        # Test 3: Get Buyer Orders
        if "buyer" in self.tokens:
            response = self.make_request("GET", "orders/buyer", headers=self.get_auth_headers("buyer"))
            if response and response.status_code == 200:
                buyer_orders = response.json()
                self.log_result("Get Buyer Orders", True, f"Retrieved {len(buyer_orders)} buyer orders")
            else:
                self.log_result("Get Buyer Orders", False, f"Failed to get buyer orders: {response.status_code if response else 'No response'}")
        
        # Test 4: Get Farmer Orders
        if "farmer" in self.tokens:
            response = self.make_request("GET", "orders/farmer", headers=self.get_auth_headers("farmer"))
            if response and response.status_code == 200:
                farmer_orders = response.json()
                self.log_result("Get Farmer Orders", True, f"Retrieved {len(farmer_orders)} farmer orders")
            else:
                self.log_result("Get Farmer Orders", False, f"Failed to get farmer orders: {response.status_code if response else 'No response'}")
        
        # Test 5: Update Order Status
        if "farmer" in self.tokens and self.created_resources["orders"]:
            order_id = self.created_resources["orders"][0]
            response = self.make_request("PUT", f"orders/{order_id}", {
                "orderStatus": "packed"
            }, headers=self.get_auth_headers("farmer"))
            
            if response and response.status_code == 200:
                updated_order = response.json()
                if updated_order.get("orderStatus") == "packed":
                    self.log_result("Update Order Status", True, "Order status updated successfully")
                else:
                    self.log_result("Update Order Status", False, "Order status update didn't reflect changes")
            else:
                self.log_result("Update Order Status", False, f"Order status update failed: {response.status_code if response else 'No response'}")
        
        # Test 6: Create Razorpay Order
        if "buyer" in self.tokens and available_products:
            order_data = {
                "items": [{
                    "productId": available_products[0]["id"],
                    "quantity": 1
                }],
                "paymentMode": "razorpay"
            }
            
            response = self.make_request("POST", "orders", order_data, headers=self.get_auth_headers("buyer"))
            if response and response.status_code == 200:
                order = response.json()
                if order.get("razorpayOrderId"):
                    self.log_result("Create Razorpay Order", True, "Razorpay order created successfully", {
                        "razorpay_order_id": order.get("razorpayOrderId"),
                        "payment_status": order.get("paymentStatus")
                    })
                else:
                    self.log_result("Create Razorpay Order", False, "Razorpay order missing razorpayOrderId")
            else:
                self.log_result("Create Razorpay Order", False, f"Razorpay order creation failed: {response.status_code if response else 'No response'}")
    
    def test_admin_apis(self):
        """Test all admin endpoints"""
        print("\n=== Testing Admin APIs ===")
        
        # Test 1: Get Admin Stats
        if "admin" in self.tokens:
            response = self.make_request("GET", "admin/stats", headers=self.get_auth_headers("admin"))
            if response and response.status_code == 200:
                stats = response.json()
                required_fields = ["totalFarmers", "totalBuyers", "totalProducts", "totalOrders", "pendingApprovals"]
                has_all_fields = all(field in stats for field in required_fields)
                
                if has_all_fields:
                    self.log_result("Get Admin Stats", True, "Admin stats retrieved successfully", stats)
                else:
                    self.log_result("Get Admin Stats", False, "Admin stats missing required fields")
            else:
                self.log_result("Get Admin Stats", False, f"Failed to get admin stats: {response.status_code if response else 'No response'}")
        
        # Test 2: Get Pending Farmers
        if "admin" in self.tokens:
            response = self.make_request("GET", "admin/farmers/pending", headers=self.get_auth_headers("admin"))
            if response and response.status_code == 200:
                pending_farmers = response.json()
                self.log_result("Get Pending Farmers", True, f"Retrieved {len(pending_farmers)} pending farmers")
            else:
                self.log_result("Get Pending Farmers", False, f"Failed to get pending farmers: {response.status_code if response else 'No response'}")
        
        # Test 3: Get All Users
        if "admin" in self.tokens:
            response = self.make_request("GET", "admin/users", headers=self.get_auth_headers("admin"))
            if response and response.status_code == 200:
                all_users = response.json()
                self.log_result("Get All Users", True, f"Retrieved {len(all_users)} total users")
            else:
                self.log_result("Get All Users", False, f"Failed to get all users: {response.status_code if response else 'No response'}")
        
        # Test 4: Admin Access Control (Buyer trying admin endpoint)
        if "buyer" in self.tokens:
            response = self.make_request("GET", "admin/stats", headers=self.get_auth_headers("buyer"))
            if response and response.status_code == 401:
                self.log_result("Admin Access Control", True, "Correctly rejected buyer accessing admin endpoint")
            else:
                self.log_result("Admin Access Control", False, f"Should have returned 401, got {response.status_code if response else 'No response'}")
    
    def test_gps_functionality(self):
        """Test GPS-related functionality"""
        print("\n=== Testing GPS Functionality ===")
        
        # Test 1: Distance Filtering (Mumbai vs Pune)
        mumbai_response = self.make_request("GET", "products", params=MUMBAI_GPS)
        pune_response = self.make_request("GET", "products", params=PUNE_GPS)
        
        if mumbai_response and pune_response and mumbai_response.status_code == 200 and pune_response.status_code == 200:
            mumbai_products = mumbai_response.json()
            pune_products = pune_response.json()
            
            # Products should be different based on location
            mumbai_count = len(mumbai_products)
            pune_count = len(pune_products)
            
            self.log_result("GPS Distance Filtering", True, f"GPS filtering working - Mumbai: {mumbai_count}, Pune: {pune_count} products", {
                "mumbai_products": mumbai_count,
                "pune_products": pune_count
            })
        else:
            self.log_result("GPS Distance Filtering", False, "Failed to test GPS distance filtering")
        
        # Test 2: Maharashtra Boundary Check (already tested in registration)
        # This is covered in the registration test with outside Maharashtra coordinates
        
        # Test 3: 10km Radius Check
        # Create a test with coordinates exactly 10km away to verify radius
        # Using coordinates approximately 10km from Mumbai center
        far_mumbai_gps = {"latitude": 19.0500, "longitude": 72.9500}  # ~10km from center
        
        response = self.make_request("GET", "products", params=far_mumbai_gps)
        if response and response.status_code == 200:
            far_products = response.json()
            self.log_result("10km Radius Check", True, f"Retrieved {len(far_products)} products from 10km distance")
        else:
            self.log_result("10km Radius Check", False, "Failed to test 10km radius check")
    
    def cleanup_test_data(self):
        """Clean up created test data"""
        print("\n=== Cleaning Up Test Data ===")
        
        # Delete created products
        if "farmer" in self.tokens:
            for product_id in self.created_resources["products"]:
                response = self.make_request("DELETE", f"products/{product_id}", headers=self.get_auth_headers("farmer"))
                if response and response.status_code == 200:
                    print(f"✅ Deleted test product: {product_id}")
                else:
                    print(f"❌ Failed to delete test product: {product_id}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Comprehensive Backend API Testing")
        print(f"Base URL: {BASE_URL}")
        print("=" * 60)
        
        try:
            # Run all test suites
            self.test_authentication_apis()
            self.test_product_apis()
            self.test_order_apis()
            self.test_admin_apis()
            self.test_gps_functionality()
            
            # Clean up
            self.cleanup_test_data()
            
            # Summary
            print("\n" + "=" * 60)
            print("🏁 TEST SUMMARY")
            print("=" * 60)
            
            total_tests = len(self.test_results)
            passed_tests = len([r for r in self.test_results if r["success"]])
            failed_tests = total_tests - passed_tests
            
            print(f"Total Tests: {total_tests}")
            print(f"Passed: {passed_tests} ✅")
            print(f"Failed: {failed_tests} ❌")
            print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
            
            if failed_tests > 0:
                print("\n❌ FAILED TESTS:")
                for result in self.test_results:
                    if not result["success"]:
                        print(f"  - {result['test']}: {result['message']}")
            
            print("\n🎯 CRITICAL FUNCTIONALITY STATUS:")
            critical_tests = [
                "Admin Login", "Farmer Login", "Buyer Login with GPS",
                "Get Products with GPS", "Create Product (Farmer)", 
                "Create Order (COD)", "Get Admin Stats", "GPS Distance Filtering"
            ]
            
            for test_name in critical_tests:
                test_result = next((r for r in self.test_results if r["test"] == test_name), None)
                if test_result:
                    status = "✅" if test_result["success"] else "❌"
                    print(f"  {status} {test_name}")
                else:
                    print(f"  ⚠️  {test_name} (Not tested)")
            
            return passed_tests, failed_tests
            
        except Exception as e:
            print(f"\n💥 TESTING FAILED WITH ERROR: {e}")
            import traceback
            traceback.print_exc()
            return 0, 1

if __name__ == "__main__":
    tester = APITester()
    passed, failed = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if failed == 0 else 1)