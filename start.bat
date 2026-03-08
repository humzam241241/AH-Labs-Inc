@echo off
echo Clearing port 3000...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :3000') DO (
    taskkill /F /PID %%T
)
echo Port cleared!
echo Starting Next.js development server...
npm run dev
