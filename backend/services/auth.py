import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Header, HTTPException, status

# 1. Initialize Firebase Admin
if not firebase_admin._apps:
    try:
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "serviceAccountKey.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            firebase_admin.initialize_app()
    except Exception as e:
        print(f"⚠️ Warning: Could not initialize firebase-admin: {e}")

# 2. Define the Dependency
async def get_current_hospital_admin(
    authorization: str = Header(..., description="Firebase Auth Bearer JWT")
) -> str:
    """
    Verifies a Firebase JWT and extracts the `hospital_id` custom claim.
    Returns the hospital_id parameter if valid.
    Throws HTTP 401 or 403 on validation failure.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header. Format: 'Bearer <jwt>'."
        )
    
    token = authorization.split("Bearer ", 1)[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        
        hospital_id = decoded_token.get("hospital_id")
        if not hospital_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token verified, but missing 'hospital_id' custom claim."
            )
            
        return hospital_id
        
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {e}"
        )
