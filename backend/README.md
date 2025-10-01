# SINAIS Face Recognition Backend

This backend server provides face recognition functionality for the SINAIS mobile app using FastAPI and dlib.

## Prerequisites

- Python 3.8 or higher
- pip package manager
- CMake and build tools (for dlib installation)

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Download the required face recognition models:
   - `shape_predictor_5_face_landmarks.dat`
   - `dlib_face_recognition_resnet_model_v1.dat`

   These files should be placed in the `face-recognition/` directory.

   You can download them from:
   - http://dlib.net/files/shape_predictor_5_face_landmarks.dat.bz2
   - http://dlib.net/files/dlib_face_recognition_resnet_model_v1.dat.bz2

3. Extract the downloaded files:
```bash
cd face-recognition
bunzip2 shape_predictor_5_face_landmarks.dat.bz2
bunzip2 dlib_face_recognition_resnet_model_v1.dat.bz2
cd ..
```

## Running the Server

Start the FastAPI server:

```bash
python main.py
```

The server will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if the service is running and models are loaded

### Face Registration
- `POST /api/face/register` - Register a user's face
  - Form data: `user_id` (string), `profile_data` (optional JSON string), `file` (image)
  - Returns: Success status and user ID

### Face Authentication
- `POST /api/face/authenticate` - Authenticate user from face
  - Form data: `file` (image)
  - Returns: Recognition result with user ID and confidence

### Face Status
- `GET /api/face/status/{user_id}` - Check if user has registered face
  - Returns: Registration status and profile data

### Delete Face Data
- `DELETE /api/face/{user_id}` - Delete user's face registration
  - Returns: Success status

### List Users (Admin)
- `GET /api/face/users` - Get list of all registered users
  - Returns: List of user IDs

## Configuration

The following constants can be adjusted in `main.py`:

- `THRESH`: Face recognition confidence threshold (default: 0.6)
- `DB_FILE`: Path to face embeddings database file
- `PROF_FILE`: Path to user profiles database file

## Security Notes

- All face data is stored locally in pickle files
- Face embeddings are mathematical representations, not actual images
- The server should be run behind HTTPS in production
- Consider implementing rate limiting and authentication for the API endpoints

## Troubleshooting

### dlib Installation Issues

If you encounter issues installing dlib:

1. Install CMake:
```bash
# On Ubuntu/Debian
sudo apt-get install cmake

# On macOS
brew install cmake

# On Windows
# Download and install from https://cmake.org/download/
```

2. Install build tools:
```bash
# On Ubuntu/Debian
sudo apt-get install build-essential

# On macOS
xcode-select --install
```

3. Try installing dlib with specific flags:
```bash
pip install dlib --verbose --no-cache-dir
```

### Model Files Not Found

If you get errors about missing model files, ensure:
1. The `.dat` files are in the `face-recognition/` directory
2. The files are not compressed (must be `.dat`, not `.dat.bz2`)
3. The file paths in the constants match the actual file locations

### Camera Issues

If the mobile app can't connect to the backend:
1. Ensure the backend server is running
2. Check that the mobile app and backend are on the same network
3. Update the `EXPO_PUBLIC_FACE_RECOGNITION_URL` environment variable in the mobile app
4. Check firewall settings on the backend machine

## Development

For development with auto-reloading:

```bash
pip install uvicorn[standard]
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`