# Student Performance Prediction System (EduPredict)

An empathetic, trustworthy, and modern educational analytics web application designed for students and educators to understand academic trajectories and identify proactive support opportunities.

---

## 🎯 Product Philosophy & Responsible AI Principles

- **Estimates, Not Guarantees**: Predictions are calculated to assist academic planning and encourage proactive study habits. They are never formal assessments or ceilings on potential.
- **Supportive Language**: The platform actively avoids labeling students with negative or deterministic terms (e.g., "bad", "failure", "at-risk"). Instead, we identify *growth opportunities* and celebrate *positive strengths*.
- **Privacy-First**: No sensitive demographic information (e.g., race, gender, income, government IDs) is required. Data can be saved locally in the browser with zero third-party tracking.

---

## 🏛️ System Architecture

```
ggu/
├── .env                              # Environment configuration (Port, Groq API key)
├── package.json                      # Native ESM configuration & scripts
├── public/                           # Client-side web application
│   ├── index.html                    # Semantic HTML5 shell with role switcher
│   ├── css/
│   │   └── app.css                   # Tailwind-inspired design system & theme
│   └── js/
│       ├── app.js                    # SPA router & lifecycle controller
│       ├── icons.js                  # Lucide SVG vector icon library
│       ├── store.js                  # Client state & localStorage persistence
│       └── views/
│           ├── landing.js            # Landing page with interactive preview
│           ├── predict.js            # Multi-section student prediction form
│           ├── results.js            # Prediction results, What-If simulator & AI coach
│           ├── educator.js           # Educator analytics dashboard & student drawer
│           ├── about.js              # Responsible use manifesto & ethics guidelines
│           └── history.js            # Saved predictions & side-by-side comparison
├── src/
│   ├── types/
│   │   └── index.ts                  # Strongly-typed domain models & interfaces
│   ├── services/
│   │   ├── validationService.ts      # Input validation, bounds checks & sanitization
│   │   ├── predictionService.ts      # Deterministic demo prediction engine
│   │   ├── aiCoachService.ts         # Groq LLM integration with heuristic fallback
│   │   └── educatorService.ts        # Educator cohort database, metrics & CSV export
│   └── server/
│       └── index.ts                  # Native high-performance HTTP server & REST API
└── test/
    ├── run-tests.ts                  # Automated unit and integration test suite
    └── probe-server.ts               # End-to-end API and static route probe
```

---

## 🚀 How to Run the Application

### Prerequisites
- Node.js v22.9 or later

### 1. Start the Web Server
To start the production/development server:

```powershell
npm start
# or
node --env-file-if-exists=.env --experimental-strip-types src/server/index.ts
```

The application will start on **`http://localhost:3000`** (or the port defined in `.env`).

### 2. Run the Verification Test Suite
Run our comprehensive 31-test automated suite verifying validation, scoring determinism, performance bands, What-If simulations, educator filtering, and AI coaching:

```powershell
npm test
# or
node --experimental-strip-types test/run-tests.ts
```

---

## 🔍 Where the Demo Prediction Logic Lives

All prediction algorithms, factor weighting, and recommendation logic are located in:
📂 **[`src/services/predictionService.ts`](file:///c:/Users/iraga/OneDrive/Desktop/ggu/src/services/predictionService.ts)**

### Multi-Factor Scoring Distribution
- **Academic Baseline (Previous Score)**: 35% weight
- **Weekly Dedicated Study Hours**: 25% weight (calibrated against an optimal 12–20 hour curve with diminishing returns)
- **Class Attendance Rate**: 20% weight (reflects direct instructional exposure and teacher context cues)
- **Assignment Completion Rate**: 12% weight (formative feedback indicator)
- **Class Participation & Resources**: 8% weight
- **Collaborative Support & Balance Buffers**: Adjustments for peer study, tutoring, and healthy extracurricular activity (4–15 hrs/wk)

### Performance Bands
- **High Potential / Exceeding Expectations**: `85.0% – 100%`
- **On Track / Proficient**: `70.0% – 84.9%`
- **Developing / Target Support Recommended**: `55.0% – 69.9%`
- **Foundational / Priority Check-in Suggested**: `< 55.0%`

---

## 🔌 How to Connect a Real Machine Learning Model Later

The architecture isolates prediction calculation behind the `generatePrediction()` service boundary. To connect a trained model:

1. Open `src/services/predictionService.ts`.
2. Locate the documented TODO block in `calculateRawScore()`:
   ```typescript
   // Example Python FastAPI / Scikit-Learn / ONNX Endpoint:
   const response = await fetch('https://your-ml-inference-service/predict', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       previous_score: input.previousScore,
       study_hours: input.studyHoursPerWeek,
       attendance: input.classAttendancePct,
       assignment_rate: input.assignmentCompletionPct,
       participation_level: input.participationLevel,
       resource_access: input.resourceAccess,
       study_support: input.studySupport
     })
   });
   const mlData = await response.json();
   const finalScore = mlData.predicted_score;
   ```
3. Return the standard `PredictionResult` structure so all UI charts, factor breakdowns, What-If simulators, and educator dashboards work seamlessly without changing any frontend code.

---

## 🤖 Groq AI Academic Coach Integration

Set `GROQ_API_KEY` in your local `.env` file. `.env` is excluded from Git; use `.env.example` as a template.
- **Model**: `llama-3.3-70b-versatile`
- **Resilient Fallback**: In offline environments or if the Groq endpoint times out, the system automatically and gracefully transitions to our rich, deterministic heuristic coaching generator without throwing errors.
- **Capabilities**: Produces an executive coaching summary, a structured 4-week growth roadmap, Pomodoro and Spaced Repetition routines, and supportive talking points for teacher-student conferences.

---

## 📱 User Roles & Flow Walkthrough

1. **Student Role**:
   - Access the multi-section form (`/predict`) or use quick presets ("Balanced Student", "High Effort", "Needs Attendance Lift").
   - Review transparent factor contributions and positive strengths (`/results`).
   - Interact with the **What-If Scenario Simulator** to test how +2 study hours or 95% attendance changes the trajectory in real-time.
   - Activate the **AI Academic Coach** for a 4-week roadmap.
   - Save the record to local browser storage (`/history`) and compare two predictions side-by-side.
2. **Educator Role**:
   - Access the **Educator Advisory Dashboard** (`/educator`).
   - Monitor cohort KPIs: Total Monitored, Cohort Mean Score, Students Suggested for Check-ins, Average Attendance.
   - Analyze the **Performance Band Distribution** visual bar chart.
   - Filter and search student records by name, ID, grade, or check-in recommendation status.
   - Open the **Student Detail Drawer** to review individual habit breakdowns and confidential educator notes.
   - Export cohort records directly to a formatted CSV spreadsheet.
