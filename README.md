# SIT Full Stack Engineering Challenge - Graph Visualizer

A complete, high-performance MERN solution (excluding MongoDB as per constraints) built to validate graph edges, detect duplicate inputs, handle multi-parents using first-parent-wins, group vertices into weakly connected components, detect cycles via Depth First Search (DFS), reconstruct visual hierarchies, and aggregate analytics summaries.

---

## 📂 Project Structure

```text
bfhl-main/
├── backend/
│   ├── config/
│   │   └── identity.js            # User identification details
│   ├── controllers/
│   │   └── graphController.js      # Endpoint processing controller
│   ├── routes/
│   │   └── graphRoutes.js          # API route bindings
│   ├── utils/
│   │   ├── cycleDetector.js        # 3-color DFS cycle detector
│   │   ├── depthCalculator.js      # Tree path depth calculator
│   │   ├── graphBuilder.js         # Component grouping & tree builder
│   │   └── validateEdges.js        # Input format & duplicate validator
│   ├── index.js                    # Express application entry
│   ├── package.json                # Backend dependencies
│   └── test.js                     # Standalone test runner
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DuplicateEdges.jsx  # Skipped duplicate visual list
│   │   │   ├── GraphInput.jsx      # Flex input textarea & example loader
│   │   │   ├── HierarchyViewer.jsx # Recursive ASCII tree & cycle display
│   │   │   ├── InvalidEntries.jsx  # Validation errors visual card
│   │   │   ├── LoadingSpinner.jsx  # Styled loading spinner
│   │   │   └── SummaryCards.jsx    # Analytics card metrics
│   │   ├── App.jsx                 # App shell, fetch coordinator & layout
│   │   ├── index.css               # Tailwind & custom global styling
│   │   └── main.jsx                # React DOM renderer
│   ├── index.html                  # Main viewport container
│   ├── package.json                # Frontend dependencies
│   ├── postcss.config.js           # PostCSS setup
│   ├── tailwind.config.js          # Custom Tailwind configuration
│   └── vite.config.js              # Vite server configuration
└── README.md                       # Complete documentation
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env` or deployment settings)
- `PORT`: Server listening port (default: `3000`)

### Frontend (`frontend/.env` or deployment settings)
- `VITE_API_URL`: Backend API endpoint (default: `http://localhost:3000/api/graph`)

---

## 🚀 Running Locally

Follow these steps to spin up the application in a local development environment.

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18+) installed.

### 2. Backend
Open a terminal in the project root and navigate to the backend directory:
```bash
cd backend
npm install
```

#### Run Tests
Before starting the backend, verify all edge-case tests pass:
```bash
node test.js
```

#### Start Server
Start the development server using nodemon:
```bash
npm run dev
```
The backend will run on `http://localhost:3000`.

---

### 3. Frontend
Open another terminal window, navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🎨 API Specification

### `POST /api/graph`

Processes a list of directed edges.

**Request Body:**
```json
{
  "edges": ["A->B", "A->C", "B->D"]
}
```

**Success Response (200 OK):**
```json
{
  "user_id": "john_doe_17091999",
  "email_id": "john.doe@sit.edu",
  "enrollment_number": "SIT20260610",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "D": {}
          },
          "C": {}
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

---

## 🌐 Deployment Instructions

### Backend (Render)
1. Sign in to [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Name**: `sit-graph-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Render will deploy and generate a public URL (e.g., `https://sit-graph-backend.onrender.com`).

---

### Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Set the following configurations:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In the **Environment Variables** section, add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://sit-graph-backend.onrender.com/api/graph` (replace with your Render URL)
6. Click **Deploy**. Vercel will host your client static files.
