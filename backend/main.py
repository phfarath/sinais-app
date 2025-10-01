from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import numpy as np
import cv2
import io
import base64
from PIL import Image
import json
import pickle
import os
import uuid
from typing import Optional, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SINAIS Face Recognition API", version="1.0.0")

# Enable CORS for mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
PREDICTOR = "face-recognition/shape_predictor_5_face_landmarks.dat"
RECOG = "face-recognition/dlib_face_recognition_resnet_model_v1.dat"
DB_FILE = "face_recognition_db.pkl"
PROF_FILE = "face_recognition_profiles.pkl"
THRESH = 0.6

# Initialize face recognition components
try:
    import dlib
    detector = dlib.get_frontal_face_detector()
    sp = dlib.shape_predictor(PREDICTOR)
    rec = dlib.face_recognition_model_v1(RECOG)
    logger.info("Face recognition models loaded successfully")
except ImportError as e:
    logger.error(f"Failed to import dlib: {e}")
    logger.error("Please install dlib: pip install dlib")
    detector = None
    sp = None
    rec = None

# Load existing databases
def load_database():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "rb") as f:
            return pickle.load(f)
    return {}

def load_profiles():
    if os.path.exists(PROF_FILE):
        with open(PROF_FILE, "rb") as f:
            return pickle.load(f)
    return {}

def save_database(db: Dict[str, Any]):
    with open(DB_FILE, "wb") as f:
        pickle.dump(db, f)

def save_profiles(profiles: Dict[str, Any]):
    with open(PROF_FILE, "wb") as f:
        pickle.dump(profiles, f)

# Global databases
face_db = load_database()
user_profiles = load_profiles()

def base64_to_image(base64_string: str) -> np.ndarray:
    """Convert base64 string to OpenCV image"""
    # Remove data URL prefix if present
    if "base64," in base64_string:
        base64_string = base64_string.split("base64,")[1]
    
    # Decode base64
    img_data = base64.b64decode(base64_string)
    
    # Convert to PIL Image
    pil_image = Image.open(io.BytesIO(img_data))
    
    # Convert to OpenCV format (RGB)
    cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    
    return cv_image

def extract_face_embedding(image: np.ndarray) -> Optional[np.ndarray]:
    """Extract face embedding from image"""
    if detector is None or sp is None or rec is None:
        raise HTTPException(status_code=500, detail="Face recognition models not loaded")
    
    try:
        # Convert to RGB for dlib
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Detect faces
        rects = detector(rgb, 1)
        
        if len(rects) == 0:
            return None
        
        if len(rects) > 1:
            raise HTTPException(status_code=400, detail="Multiple faces detected. Please ensure only one face is visible.")
        
        # Get face embedding
        shape = sp(rgb, rects[0])
        chip = dlib.get_face_chip(rgb, shape)
        embedding = np.array(rec.compute_face_descriptor(chip), dtype=np.float32)
        
        return embedding
    except Exception as e:
        logger.error(f"Error extracting face embedding: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing face: {str(e)}")

def recognize_face(embedding: np.ndarray) -> Dict[str, Any]:
    """Recognize face from embedding"""
    if not face_db:
        return {"recognized": False, "message": "No faces registered in database"}
    
    best_match = None
    best_distance = float('inf')
    
    for user_id, stored_embedding in face_db.items():
        distance = np.linalg.norm(embedding - stored_embedding)
        if distance < best_distance:
            best_distance = distance
            best_match = user_id
    
    if best_distance <= THRESH:
        profile = user_profiles.get(best_match, {})
        return {
            "recognized": True,
            "user_id": best_match,
            "confidence": 1 - best_distance,
            "profile": profile
        }
    else:
        return {
            "recognized": False,
            "message": "Face not recognized",
            "closest_match": best_match,
            "distance": best_distance
        }

@app.get("/")
async def root():
    return {"message": "SINAIS Face Recognition API", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": detector is not None,
        "registered_faces": len(face_db)
    }

@app.post("/api/face/register")
async def register_user_face(
    user_id: str = Form(...),
    profile_data: str = Form(None),
    file: UploadFile = File(...)
):
    """Register a user's face"""
    try:
        # Read and validate image
        contents = await file.read()
        
        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(contents))
        
        # Convert to OpenCV format
        cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        
        # Extract face embedding
        embedding = extract_face_embedding(cv_image)
        
        if embedding is None:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        # Store embedding
        face_db[user_id] = embedding
        save_database(face_db)
        
        # Parse and store profile data if provided
        if profile_data:
            try:
                profile = json.loads(profile_data)
                user_profiles[user_id] = profile
                save_profiles(user_profiles)
            except json.JSONDecodeError:
                logger.warning(f"Invalid profile data for user {user_id}")
        
        logger.info(f"Face registered successfully for user: {user_id}")
        
        return {
            "success": True,
            "message": "Face registered successfully",
            "user_id": user_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering face: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/face/authenticate")
async def authenticate_face(file: UploadFile = File(...)):
    """Authenticate user from face"""
    try:
        # Read and validate image
        contents = await file.read()
        
        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(contents))
        
        # Convert to OpenCV format
        cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        
        # Extract face embedding
        embedding = extract_face_embedding(cv_image)
        
        if embedding is None:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        # Recognize face
        result = recognize_face(embedding)
        
        logger.info(f"Face authentication attempt: {result}")
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error authenticating face: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/face/status/{user_id}")
async def get_face_registration_status(user_id: str):
    """Check if user has registered face"""
    is_registered = user_id in face_db
    profile = user_profiles.get(user_id, {})
    
    return {
        "user_id": user_id,
        "face_registered": is_registered,
        "profile": profile if is_registered else None
    }

@app.delete("/api/face/{user_id}")
async def delete_user_face(user_id: str):
    """Delete user's face registration"""
    try:
        if user_id in face_db:
            del face_db[user_id]
            save_database(face_db)
        
        if user_id in user_profiles:
            del user_profiles[user_id]
            save_profiles(user_profiles)
        
        logger.info(f"Face registration deleted for user: {user_id}")
        
        return {
            "success": True,
            "message": "Face registration deleted successfully"
        }
        
    except Exception as e:
        logger.error(f"Error deleting face registration: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/face/users")
async def get_registered_users():
    """Get list of all registered users (admin endpoint)"""
    return {
        "users": list(face_db.keys()),
        "count": len(face_db)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)