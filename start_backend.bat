@echo off
echo Starting SINAIS Face Recognition Backend...
echo.
echo Make sure you have installed all requirements:
echo pip install -r backend/requirements.txt
echo.
echo Starting server at http://192.168.15.10:8000
echo Press Ctrl+C to stop the server
echo.

cd backend
python main.py