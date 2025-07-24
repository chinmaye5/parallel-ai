# 🧠 ParallelAI – Multi-Model AI Q&A App

ParallelAI is a fullstack application that answers your questions using multiple AI models in parallel.  
Built with **Next.js** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 📁 Project Structure

parallel-ai/
├── backend/ → Node.js + Express + MongoDB backend
├── frontend/ → Next.js 15 frontend (App Router)
├── .env → Shared environment variables (or separate .env files in each folder)
└── README.md → This file


---

## 🚀 Features

- 🔐 JWT Authentication
- 🧠 Multi-model Groq API support
- 🌐 Frontend built with Next.js (App Router)
- ☁️ MongoDB Atlas for data persistence
- ⚙️ CORS-ready for both local & production environments

---

## 🧪 Environment Variables

### ✅ **Frontend `.env.local` (inside `/frontend`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
✅ Backend .env (inside /backend)
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here

GROQ_API_KEY=your_key_here
GROQ_API_KEY1=your_key_1
GROQ_API_KEY2=your_key_2
GROQ_API_KEY3=your_key_3
GROQ_API_KEY4=your_key_4
GROQ_API_KEY5=your_key_5
🛠️ Getting Started
🔹 Backend (Node.js + Express)
cd backend
npm install
node server.js
App runs at: http://localhost:5000

🔹 Frontend (Next.js)
cd frontend
npm install
npm run dev
App runs at: http://localhost:3000

Make sure NEXT_PUBLIC_API_URL in .env.local points to your backend.
