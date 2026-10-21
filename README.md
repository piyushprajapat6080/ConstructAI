# 🏗️ CONSTRUCTAI — Ultra-Modern Multimodal Construction Intelligence Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Pydantic v2](https://img.shields.io/badge/Pydantic-v2.6+-e92063?style=flat&logo=pydantic&logoColor=white)](https://docs.pydantic.dev/)
[![React 18](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646cff?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38bdf8?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**CONSTRUCTAI** is an enterprise-grade full-stack multimodal AI platform designed for structural diagnostics, site safety audits, project estimation, and construction operations. Built with strict defensive programming, it guarantees zero-crash fallback and features an ultra-modern UI matching Linear, Vercel, and Stripe design benchmarks.

---

## 🌟 Key Platform Modules

1. **🛡️ Site Safety Monitor (`/api/safety/analyze`)**
   - Multimodal computer vision inspection for fall risks, perimeter slab edges, and scaffolding defects.
   - Dynamic 0–100 risk score with critical/high/moderate badges.
   - Interactive PPE compliance auditor (Hard hats, high-vis vests, full-body harnesses).
   - Regulatory enforcement citations (BOCW Act 1996, IS 3696 Part 1, IS 5216).

2. **⚡ Structural Crack Diagnosis (`/api/crack/analyze`)**
   - Finite visual classifier for structural shear cracks, non-structural drying shrinkage, and differential settlement.
   - Severity percentage gauge, width estimation (in mm), and probable root causes.
   - Step-by-step remediation blueprint with material specs (IS 9162 epoxy, CFRP wraps) and estimated costs in ₹ INR.

3. **🏢 Real Estate Valuation (`/api/valuation/calculate`)**
   - Algorithmic micro-market appraisal for Indian residential, commercial, villa, and land assets.
   - Dynamic KPI stat cards formatted in ₹ Lakhs & Crores (e.g. ₹88.50 L, ₹2.40 Cr).
   - Rate/sq.ft, expected monthly rent yield, 5-year annualized ROI, and micro-market drivers.

4. **📋 Project Planner & Cost Estimator (`/api/planner/generate`)**
   - Natural language project brief processor (e.g., *"20x30 slab casting"*, *"2-storey brick masonry"*).
   - Computes total concrete volume (m³), cement bags, Fe550D TMT steel, and sand/aggregates.
   - Interactive multi-segment cost progress bar (Materials vs. Labour vs. Finishing/Contingency).
   - Vertical milestone execution timeline conforming to CPWD curing schedules.

5. **📚 Technical Knowledge Base (`/api/knowledge/query`)**
   - Segmented categories: **SAFETY**, **TECHNIQUE**, and **DOC_GEN**.
   - Direct citations from the Bureau of Indian Standards (IS 456:2000, IS 10262:2019, NBC 2016).
   - Automated site inspection certificates and RFI document generation.

6. **💬 Construction Chatbot (`/api/chatbot/message`)**
   - Multimodal AI copilot with markdown formatting, code blocks, and technical formulas.
   - Smart one-click follow-up prompt chips for effortless deep-dive reasoning.

7. **👷 Daily Site Assistant (`/api/assistant/generate-daily`)**
   - Morning toolbox meeting directives based on daily activity, deployed workforce count, and ground status.
   - Prioritized hourly time slots, mandatory safety checks, and machinery inspection checklists.

8. **🌦️ Weather Advisor (`/api/weather/check-feasibility`)**
   - Meteorological feasibility engine evaluating monsoon rainfall, high-wind crane hoisting, and extreme dry heat.
   - Large dynamic clearance banners (**GO**, **PROCEED WITH CAUTION**, **NO-GO**).
   - Mitigations referencing IS 7861 hot/cold weather concreting standards.

---

## 📁 Repository Directory Structure

```text
constructai-platform/
├── backend/
│   ├── .env.example
│   ├── .env
│   ├── requirements.txt
│   ├── main.py
│   ├── config.py
│   ├── services/
│   │   ├── groq_service.py       # Multimodal Groq AI with automatic fallback
│   │   └── mock_data.py          # High-fidelity realistic engineering mock data
│   ├── schemas/                  # Pydantic v2 validation contracts
│   │   ├── safety_schema.py
│   │   ├── crack_schema.py
│   │   ├── valuation_schema.py
│   │   ├── planner_schema.py
│   │   ├── knowledge_schema.py
│   │   ├── assistant_schema.py
│   │   ├── chatbot_schema.py
│   │   └── weather_schema.py
│   └── routes/                   # FastAPI route handlers
│       ├── safety_router.py
│       ├── crack_router.py
│       ├── valuation_router.py
│       ├── planner_router.py
│       ├── knowledge_router.py
│       ├── assistant_router.py
│       ├── chatbot_router.py
│       └── weather_router.py
└── frontend/
    ├── package.json
    ├── vite.config.js            # Vite config with API proxying
    ├── tailwind.config.js        # Industrial dark & construction amber theme
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── App.jsx               # Layout, mobile drawer, and view routing
        ├── main.jsx
        ├── index.css             # Design tokens, scrollbars, and shimmer animations
        ├── api/
        │   └── client.js         # API integration client
        ├── components/
        │   ├── Sidebar.jsx       # Industrial dark navigation (#0B0F17)
        │   ├── Header.jsx        # Breadcrumbs, live status & Swagger links
        │   ├── LoadingSkeleton.jsx # Pulse shimmer loaders (no blank screens)
        │   ├── FileUploadZone.jsx # Drag-and-drop dropzone with instant preview
        │   ├── StatCard.jsx      # Monospace KPI cards with progress bars
        │   └── Toast.jsx         # Non-blocking feedback notification toasts
        └── views/
            ├── SafetyMonitorView.jsx
            ├── CrackDetectionView.jsx
            ├── RealEstateValuationView.jsx
            ├── ProjectPlannerView.jsx
            ├── KnowledgeAssistantView.jsx
            ├── ChatbotView.jsx
            ├── DailySiteAssistantView.jsx
            └── WeatherAdvisorView.jsx
```

---

## 🚀 Execution & Setup Instructions

### 1. Backend Setup (Isolated Virtual Environment)

To prevent any system dependency conflicts, the backend runs in a dedicated Python `venv`:

```bash
cd backend

# Create isolated Python virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Launch FastAPI backend server (Runs on port 8000)
uvicorn main:app --reload --port 8000
```

> **Interactive API Documentation:**
> Visit [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive Swagger UI and [http://localhost:8000/redoc](http://localhost:8000/redoc) for ReDoc.

### 2. Frontend Setup (React + Vite + Tailwind)

In a separate terminal window:

```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite development server (Runs on port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to explore the dashboard.

---

## 🔑 AI Engine & Live Inference Architecture

ConstructAI is connected directly to Groq's high-speed inference engine for real-time multimodal intelligence:
- **Vision Models (`qwen/qwen3.8-27b`)** for real-time visual inspection of structural cracks, defect detection, and site safety sweeps.
- **Reasoning Models (`qwen/qwen3.8-27b` / `openai/gpt-oss-120b`)** for BOQ material estimation, real estate cashflows, and daily operational planning.

### Live Groq Multimodal AI:
- `GROQ_API_KEY` is configured in `backend/.env`.
- Mock fallbacks are disabled; all uploaded photos and engineering prompts are processed live by Groq with strict JSON output validation via Pydantic v2 schemas.
- Root endpoint (`GET /`) reports `status: "online"` and `mode: "Live Groq Multimodal AI Engine"`.

---

## 🛡️ Robustness & Zero-Crash Rules Followed

1. **Guarded Array Renders:** Every list and mapping operation implements safe fallbacks: `(data?.hazards || []).map(...)`.
2. **Indian Currency Formatting:** All monetary outputs are formatted in Indian Rupee denomination: `₹.toLocaleString('en-IN')` or formatted in Lakhs/Crores (`₹88.50 L`, `₹2.40 Cr`).
3. **Responsive Grid Layouts:** Multi-column grids smoothly adapt from `lg:grid-cols-12` down to single-column on tablets and phones, with an off-canvas mobile drawer.
4. **CORS Configured:** FastAPI middleware enables full bidirectional communication with `allow_origins=["*"]`.
5. **Interactive Preset Demonstrations:** All views include 1-click demo presets (e.g., sample high-rise site photo, sample RCC beam shear crack) so you can test every workflow immediately without external files.
