import os
import requests
import firebase_admin
from firebase_admin import credentials, auth

# ==============================================================================
#  Firebase Admin Token Generator
#  Use this to test your API without needing to build a React frontend!
# ==============================================================================

# 1. Plug in your Firebase Web API Key
# (Find this in Firebase Console -> Project Settings -> General -> Web API Key)
WEB_API_KEY = "AIzaSyB9bx_6PB0kMrEu_1McseoEt0mvXvwE86o" 

# 2. Define the hospital you want to "administer"
TEST_UID = "test-admin-user"
HOSPITAL_ID = "KBTH-001" # Or any existing hospital ID in your DB

def main():
    if WEB_API_KEY == "YOUR_WEB_API_KEY_HERE":
        print("❌ Error: You must paste your WEB_API_KEY on line 11.")
        return

    print("🔌 Initializing Firebase Admin...")
    if not firebase_admin._apps:
        cred = credentials.Certificate('serviceAccountKey.json')
        firebase_admin.initialize_app(cred)

    try:
        auth.get_user(TEST_UID)
    except Exception:
        print(f"👤 User '{TEST_UID}' not found. Creating test user in Firebase Auth...")
        auth.create_user(uid=TEST_UID)

    print(f"🛡️  Setting custom claim [hospital_id: {HOSPITAL_ID}] for user {TEST_UID}...")
    # This proves the server explicitly trusts this user to manage this hospital
    auth.set_custom_user_claims(TEST_UID, {"hospital_id": HOSPITAL_ID})

    print("🎟️  Minting backend custom token...")
    custom_token = auth.create_custom_token(TEST_UID).decode('utf-8')

    print("🔄 Exchanging custom token for a real Client ID Token...")
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={WEB_API_KEY}"
    
    response = requests.post(url, json={"token": custom_token, "returnSecureToken": True})
    
    if response.status_code != 200:
        print("\n❌ Exchange failed. Did you copy the correct Web API Key?")
        print(response.json())
        return

    id_token = response.json()["idToken"]
    
    print("\n✅ SUCCESS! Here is your real Firebase JWT:\n")
    print(id_token)
    print("\n---------------------------------------------------------")
    print("📋 Copy the huge token above.")
    print("Navigate to http://localhost:8000/docs")
    print("Paste it into the Authorization box as: Bearer <token>")

if __name__ == "__main__":
    main()
