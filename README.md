# ParallelAI — The Collective Intelligence Engine

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Groq](https://img.shields.io/badge/AI-Groq%20SDK-orange?style=flat-square)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**ParallelAI** is a high-performance, full-stack AI orchestration platform that leverages multiple Large Language Models (LLMs) in parallel to provide diverse perspectives and synthesized "consensus" answers. By querying multiple models simultaneously, ParallelAI eliminates single-model bias and provides a broader spectrum of intelligence.

---

## Live Demo
Experience ParallelAI: [theparallelai.vercel.app](https://theparallelai.vercel.app/)

---

## Key Features

### Parallel Multi-Model Inference
Query up to 5 different AI models simultaneously. See how different architectures (Llama, Qwen, etc.) interpret and respond to the same prompt in real-time.

###  Consensus Engine
Our proprietary consensus logic takes responses from all active models and synthesizes them into a single, highly accurate, and balanced "Super Answer."

###  Secure Authentication & Persistence
- **JWT-based Auth:** Secure login and registration system.
- **Chat History:** All your queries and multi-model responses are stored securely in MongoDB Atlas for later review.

###  Blazing Fast Performance
Built on the **Groq LPU™ Inference Engine**, delivering near-instantaneous responses across multiple models at once.

---

##  Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), Tailwind CSS, Lucide React, Axios |
| **Backend** | Node.js, Express.js, Winston Logger |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI Layer** | Groq SDK (LLM Orchestration) |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js |

###  Orchestrated Models
- `llama-3.1-8b-instant`
- `qwen/qwen3-32b`
- `groq/compound-mini`
- `openai/gpt-oss-20b`
- `moonshotai/kimi-k2-instruct-0905`

---

##  Project Structure

```text
parallel-ai/
├── frontend/             # Next.js 15 App
│   ├── app/              # Routes & Layouts
│   ├── components/       # UI Components (Auth, Chat, Responses)
│   └── public/           # Static Assets
├── backend/              # Node.js + Express API
│   ├── controllers/      # Business Logic
│   ├── models/           # Mongoose Schemas
│   ├── routes/           # API Endpoints
│   ├── utils/            # Groq Service & Helpers
│   └── server.js         # Entry Point
└── README.md             # Project Documentation
```

---

##  Getting Started

###  Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Groq API Key(s)

###  Environment Variables

#### Backend (`/backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
GROQ_API_KEY1=gsk_your_key_1
GROQ_API_KEY2=gsk_your_key_2
GROQ_API_KEY3=gsk_your_key_3
GROQ_API_KEY4=gsk_your_key_4
GROQ_API_KEY5=gsk_your_key_5
```

#### Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

###  Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/parallel-ai.git
   cd parallel-ai
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

##  Usage

1. **Sign Up / Login:** Create an account to start your parallel workspace.
2. **Select Mode:** 
   - **Multi-Mode:** Get distinct answers from all models.
   - **Consensus Mode:** Get a synthesized expert opinion.
3. **Compare:** Evaluate the quality of different models for your specific query.
4. **History:** Access your previous sessions from the sidebar.

---

##  License
Distributed under the **MIT License**. See `LICENSE` for more information.

##  Acknowledgements
- [Groq](https://groq.com/) for their incredible inference speed.
- [Vercel](https://vercel.com/) for frontend hosting.
- [MongoDB](https://www.mongodb.com/) for reliable data persistence.

---
