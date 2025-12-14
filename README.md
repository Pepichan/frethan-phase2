# Frethan RFQ (Clean Project)

## Run everything (recommended)
Open the folder in VS Code (the folder that contains backend/ and frontend/), then:

```bash
npm install
npm run dev
```

### MongoDB
Create `backend/.env` from `backend/.env.example` and paste your MongoDB URI.

Example:
PORT=5000
MONGO_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/FrethanDB?retryWrites=true&w=majority
FRONTEND_ORIGIN=http://localhost:5173

## URLs
- Backend: http://localhost:5000/health
- Frontend: http://localhost:5173
