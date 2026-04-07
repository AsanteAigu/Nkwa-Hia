import os
from typing import List, Optional
from google.cloud import firestore
# Ensure you have your models imported correctly
from models import Hospital, HospitalStatus, WardType, CapacityUpdate

class FirestoreService:
    def __init__(self):
        self.project_id = os.getenv("FIREBASE_PROJECT_ID")
        # Use the APP_ID from .env to satisfy Architecture §4.1
        self.app_id = os.getenv("APP_ID", "gehg-app") 
        
        self.db = firestore.AsyncClient(project=self.project_id)
        
        # Updated to use the dynamic app_id
        self.base_path = f"artifacts/{self.app_id}/public/data/hospitals"

    async def get_available_hospitals(self) -> List[dict]:
        """
        Fetches hospitals with GREEN or YELLOW status.
        Used by the AI triage engine to find hospitals that can actually receive patients.
        """
        allowed_statuses = [HospitalStatus.GREEN.value, HospitalStatus.YELLOW.value]
        query = self.db.collection(self.base_path).where(
            "status", "in", allowed_statuses
        )
        docs = await query.get()
        return [doc.to_dict() for doc in docs]

    async def get_all_hospitals(self) -> List[dict]:
        """
        Fetches ALL hospitals regardless of status.
        Uses stream() — iterates every document in the collection including RED.
        """
        result = []
        async for doc in self.db.collection(self.base_path).stream():
            data = doc.to_dict()
            if data:
                result.append(data)
        print(f"[DB] get_all_hospitals returned {len(result)} docs")
        return result

    async def update_hospital_summary(self, hospital_id: str, data: dict):
        """
        Updates top-level hospital info. 
        Enforces Security Rule #1: only status, last_updated, total_capacity.
        """
        allowed_keys = {'status', 'last_updated', 'total_capacity'}
        filtered_data = {k: v for k, v in data.items() if k in allowed_keys}
        filtered_data["last_updated"] = firestore.SERVER_TIMESTAMP

        doc_ref = self.db.collection(self.base_path).document(hospital_id)
        await doc_ref.update(filtered_data)

    async def update_ward_capacity(self, hospital_id: str, ward_type: WardType, new_beds: int):
        """
        Updates bed counts in the /wards sub-collection.
        Matches Security Rule #2 for ward access.
        """
        ward_ref = (
            self.db.collection(self.base_path)
            .document(hospital_id)
            .collection("wards")
            .document(ward_type.value)
        )
        
        await ward_ref.update({
            "beds_available": new_beds,
            "last_updated": firestore.SERVER_TIMESTAMP
        })

    async def process_capacity_update(self, hospital_id: str, update_data: CapacityUpdate):
        """
        Processes a full capacity update for a hospital, including bulk ward writes.
        """
        hospital_update = {"last_updated": firestore.SERVER_TIMESTAMP}
        if update_data.oxygen_functional is not None:
            hospital_update["oxygen_functional"] = update_data.oxygen_functional
        if update_data.staffing_level_alert is not None:
            hospital_update["staffing_level_alert"] = update_data.staffing_level_alert

        hospital_ref = self.db.collection(self.base_path).document(hospital_id)
        batch = self.db.batch()
        batch.update(hospital_ref, hospital_update)
        
        for ward_info in update_data.ward_updates:
            ward_type_str = ward_info.get("ward_type")
            beds = ward_info.get("beds")
            
            try:
                # Strong validation against WardType Enum
                ward_enum = WardType(ward_type_str)
                ward_ref = hospital_ref.collection("wards").document(ward_enum.value)
                batch.update(ward_ref, {
                    "beds_available": beds,
                    "last_updated": firestore.SERVER_TIMESTAMP
                })
            except ValueError:
                # Silently drop invalid ward types
                pass

        await batch.commit()

    async def sync_ward_beds(self, hospital_id: str, ward_type: str, beds_available: int):
        """
        Updates beds_available for one ward in the active_wards array, then
        recomputes the hospital's GREEN/YELLOW/RED status from total occupancy.
        Called by the hospital portal when staff changes a bed status.
        """
        doc_ref = self.db.collection(self.base_path).document(hospital_id)
        doc = await doc_ref.get()
        if not doc.exists:
            return

        hospital_data = doc.to_dict()
        active_wards = hospital_data.get("active_wards", [])

        ward_type_upper = ward_type.upper()
        for ward in active_wards:
            if ward.get("ward_type") == ward_type_upper:
                ward["beds_available"] = beds_available
                break

        total_available = sum(w.get("beds_available", 0) for w in active_wards)
        total_capacity  = sum(w.get("total_beds", 1)     for w in active_wards)
        occupancy = 1.0 - (total_available / total_capacity) if total_capacity > 0 else 1.0

        if occupancy >= 0.95:
            new_status = "RED"
        elif occupancy >= 0.75:
            new_status = "YELLOW"
        else:
            new_status = "GREEN"

        await doc_ref.update({
            "active_wards": active_wards,
            "status": new_status,
            "last_updated": firestore.SERVER_TIMESTAMP,
        })

# Global instance
db_service = FirestoreService()