import { icon } from '../icons.js';
import { state, showToast, savePredictionToStorage } from '../store.js';

export function renderResults(container, navigateTo) {
  const prediction = state.currentPrediction;

  if (!prediction) {
    container.innerHTML = `
      <div style="padding: 5rem 0; text-align: center;">
        <div class="container" style="max-width: 500px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--primary-50); color: var(--primary-600); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
            ${icon('info', '', 32)}
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">No Active Prediction Found</h2>
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.5rem;">
            Please enter your study habits and academic baseline to generate an analysis.
          </p>
          <button id="start-new-pred-btn" class="btn btn-primary btn-lg">
            ${icon('graduation-cap', '', 18)} Go to Prediction Form
          </button>
        </div>
      </div>
    `;
    document.getElementById('start-new-pred-btn')?.addEventListener('click', () => navigateTo('predict'));
    return;
  }

  const {
    studentName,
    gradeLevel,
    predictedScore,
    scoreRange,
    performanceBand,
    confidenceScore,
    confidenceDescription,
    factors,
    strengths,
    growthAreas,
    recommendations,
    disclaimer,
    calculatedAt,
    modelMetadata,
    inputs
  } = prediction;

  container.innerHTML = `
    <div style="padding: 2.5rem 0 4rem 0;">
      <div class="container">
        
        <!-- Top Action Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button id="revise-inputs-btn" class="btn btn-secondary btn-sm">
              ${icon('arrow-left', '', 16)} Edit Inputs
            </button>
            <span style="font-size: 0.85rem; color: var(--text-subtle);">
              Analysis for <strong style="color: var(--text-main);">${studentName}</strong> (${gradeLevel})
            </span>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;" class="no-print">
            <button id="save-history-btn" class="btn btn-secondary btn-sm">
              ${icon('bookmark', '', 16)} Save to My Records
            </button>
            <button id="print-result-btn" class="btn btn-secondary btn-sm">
              ${icon('printer', '', 16)} Print Summary
            </button>
            <button id="new-prediction-btn" class="btn btn-primary btn-sm">
              ${icon('plus', '', 16)} New Prediction
            </button>
          </div>
        </div>

        <!-- Prominent Disclaimer Notice Banner -->
        <div class="card" style="background-color: #FAF7F5; border: 1px solid var(--border-light); padding: 1rem 1.25rem; margin-bottom: 1.75rem; border-left: 4px solid var(--primary-600);">
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="color: var(--primary-600); margin-top: 0.1rem;">${icon('info', '', 18)}</span>
            <div style="font-size: 0.825rem; color: var(--text-muted); line-height: 1.5;">
              <strong>Empathetic Estimate Notice:</strong> ${disclaimer}
            </div>
          </div>
        </div>

        <!-- Main Score Hero Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" style="margin-bottom: 2rem;">
          
          <!-- Primary Score Dial Card -->
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 2rem; border-top: 4px solid var(--primary-600);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.05em;">Predicted Trajectory</span>
                <span class="badge ${performanceBand.badgeBg}">${performanceBand.label}</span>
              </div>

              <div class="score-circle-container">
                <div class="score-display-number">${predictedScore.toFixed(1)}<span style="font-size: 1.8rem; font-weight: 600; color: var(--text-subtle);">%</span></div>
                <div style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.5rem; text-align: center;">
                  Estimated Range: <strong>${scoreRange[0].toFixed(1)}% – ${scoreRange[1].toFixed(1)}%</strong>
                </div>
              </div>
            </div>

            <div style="background: #FAF7F5; border-radius: var(--radius-md); padding: 1rem; border: 1px solid var(--border-light); margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">Model Confidence</span>
                <span class="badge badge-burgundy">${confidenceScore}% Index</span>
              </div>
              <p style="font-size: 0.775rem; color: var(--text-muted); line-height: 1.4;">${confidenceDescription}</p>
            </div>
          </div>

          <!-- Factor Impact & Weight Breakdown Card -->
          <div class="card lg:grid-cols-2" style="grid-column: span 2; padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div>
                <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--text-main);">What Influenced This Estimate?</h3>
                <p style="font-size: 0.825rem; color: var(--text-subtle);">Contribution of each academic factor relative to typical benchmark baselines.</p>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${factors.map(f => {
                const isPositive = f.impactPoints >= 0;
                const pointColor = isPositive ? '#10B981' : '#F59E0B';
                const sign = isPositive ? '+' : '';
                return `
                  <div style="background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.85rem 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: ${pointColor};">${icon(isPositive ? 'trending-up' : 'trending-down', '', 16)}</span>
                        <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-main);">${f.name}</span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 0.8rem; color: var(--text-subtle);">Yours: <strong>${f.userValue}</strong></span>
                        <span style="font-size: 0.85rem; font-weight: 700; color: ${pointColor};">${sign}${f.impactPoints} pts</span>
                      </div>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">${f.description}</p>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>

        <!-- Practical Tailored Recommendations -->
        <div class="card" style="margin-bottom: 2.5rem; padding: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary-600); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.2rem;">Next Steps</div>
              <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main);">Practical, High-Impact Recommendations</h3>
            </div>
            <span class="badge badge-emerald">${recommendations.length} Action Pathways</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${recommendations.map((rec, idx) => `
              <div style="background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main);">${rec.title}</h4>
                    <span class="badge badge-blue" style="font-size: 0.7rem;">${rec.estimatedScoreImpact}</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">
                    ${rec.description}
                  </p>
                </div>

                <div style="background: #F8FAFC; border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; border-left: 3px solid var(--primary-500); font-size: 0.8rem; color: var(--text-main);">
                  <strong>First Step:</strong> ${rec.firstStep}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Interactive What-If Simulator & AI Study Coach Tabs -->
        <div class="card" style="padding: 2rem; margin-bottom: 2.5rem;">
          <div class="tabs-header" id="results-advanced-tabs">
            <button class="tab-btn active" data-view="what-if">
              ${icon('sliders', '', 16)} Interactive "What-If" Scenario Simulator
            </button>
            <button class="tab-btn" data-view="ai-coach">
              ${icon('sparkles', '', 16)} AI Academic Coach Roadmap
            </button>
          </div>

          <!-- TAB 1: What-If Simulator -->
          <div id="tab-what-if-panel">
            <div class="what-if-box">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">
                    Test Real-Time Academic Adjustments
                  </h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 600px;">
                    Move the sliders below to explore how modifying specific weekly habits can alter your estimated score.
                  </p>
                </div>
                
                <!-- Live Delta Display -->
                <div style="background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.75rem 1.25rem; text-align: right; box-shadow: var(--shadow-sm);">
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">Simulated New Score</div>
                  <div id="simulated-score-val" style="font-size: 1.75rem; font-weight: 800; color: var(--primary-700); line-height: 1.1;">
                    ${predictedScore.toFixed(1)}%
                  </div>
                  <div id="simulated-delta-badge" style="font-size: 0.8rem; font-weight: 600; color: #10B981; margin-top: 0.2rem;">
                    Baseline
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6" style="margin-bottom: 1.25rem;">
                <!-- Study Hours Sim -->
                <div class="form-group slider-container">
                  <div class="slider-header">
                    <label class="form-label" style="font-size: 0.85rem;">Study Hours / Wk</label>
                    <span class="slider-val-badge" id="sim-hours-display">${inputs.studyHoursPerWeek} hrs</span>
                  </div>
                  <input type="range" id="sim-studyHours" min="0" max="40" step="1" value="${inputs.studyHoursPerWeek}" />
                </div>

                <!-- Attendance Sim -->
                <div class="form-group slider-container">
                  <div class="slider-header">
                    <label class="form-label" style="font-size: 0.85rem;">Attendance Rate</label>
                    <span class="slider-val-badge" id="sim-attendance-display">${inputs.classAttendancePct}%</span>
                  </div>
                  <input type="range" id="sim-attendance" min="30" max="100" step="1" value="${inputs.classAttendancePct}" />
                </div>

                <!-- Assignment Sim -->
                <div class="form-group slider-container">
                  <div class="slider-header">
                    <label class="form-label" style="font-size: 0.85rem;">Assignment Rate</label>
                    <span class="slider-val-badge" id="sim-assignment-display">${inputs.assignmentCompletionPct}%</span>
                  </div>
                  <input type="range" id="sim-assignment" min="20" max="100" step="5" value="${inputs.assignmentCompletionPct}" />
                </div>
              </div>

              <div id="sim-explanation-text" style="font-size: 0.85rem; color: var(--text-muted); background: #FFFFFF; border-radius: var(--radius-sm); padding: 0.75rem 1rem; border: 1px solid var(--border-light);">
                Adjust sliders to see estimated impact.
              </div>
            </div>
          </div>

          <!-- TAB 2: AI Study Coach -->
          <div id="tab-ai-coach-panel" style="display: none;">
            <div id="coach-content-area">
              <div style="text-align: center; padding: 2.5rem 1rem;">
                <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--primary-50); color: var(--primary-600); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
                  ${icon('brain', '', 26)}
                </div>
                <h4 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">
                  Generate Your Personalized 4-Week Study Blueprint
                </h4>
                <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 550px; margin: 0 auto 1.5rem auto; line-height: 1.5;">
                  Synthesizes your score factors into a structured weekly timeline, Pomodoro study techniques, and discussion prompts for your educators.
                </p>
                <button id="generate-coach-plan-btn" class="btn btn-primary btn-lg">
                  ${icon('sparkles', '', 18)} Generate Academic Coaching Plan
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  // Attach Top Action Bar listeners
  document.getElementById('revise-inputs-btn')?.addEventListener('click', () => {
    navigateTo('predict');
  });

  document.getElementById('save-history-btn')?.addEventListener('click', () => {
    const success = savePredictionToStorage(prediction);
    if (success) {
      showToast('Prediction successfully saved to your browser history!', 'success');
    } else {
      showToast('Could not save prediction.', 'error');
    }
  });

  document.getElementById('print-result-btn')?.addEventListener('click', () => {
    window.print();
  });

  document.getElementById('new-prediction-btn')?.addEventListener('click', () => {
    state.currentPrediction = null;
    navigateTo('predict');
  });

  // Tab switching between What-If and AI Coach
  const tabButtons = container.querySelectorAll('#results-advanced-tabs .tab-btn');
  const whatIfPanel = document.getElementById('tab-what-if-panel');
  const coachPanel = document.getElementById('tab-ai-coach-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-view');
      if (view === 'what-if') {
        if (whatIfPanel) whatIfPanel.style.display = 'block';
        if (coachPanel) coachPanel.style.display = 'none';
      } else {
        if (whatIfPanel) whatIfPanel.style.display = 'none';
        if (coachPanel) coachPanel.style.display = 'block';
        // Auto-load coach plan if already cached in state
        if (state.activeAICoachPlan) {
          renderCoachPlanUI(state.activeAICoachPlan);
        }
      }
    });
  });

  // What-If Simulator Real-Time Interaction
  const simHours = document.getElementById('sim-studyHours');
  const simAtt = document.getElementById('sim-attendance');
  const simAss = document.getElementById('sim-assignment');

  const simHoursDisp = document.getElementById('sim-hours-display');
  const simAttDisp = document.getElementById('sim-attendance-display');
  const simAssDisp = document.getElementById('sim-assignment-display');

  const simScoreVal = document.getElementById('sim-score-val');
  const simDeltaBadge = document.getElementById('sim-delta-badge');
  const simExplanation = document.getElementById('sim-explanation-text');

  let debounceTimer = null;

  function runSimulation() {
    const hours = parseFloat(simHours?.value || inputs.studyHoursPerWeek);
    const attendance = parseFloat(simAtt?.value || inputs.classAttendancePct);
    const assignments = parseFloat(simAss?.value || inputs.assignmentCompletionPct);

    if (simHoursDisp) simHoursDisp.textContent = `${hours} hrs`;
    if (simAttDisp) simAttDisp.textContent = `${attendance}%`;
    if (simAssDisp) simAssDisp.textContent = `${assignments}%`;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch('/api/what-if', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseInputs: inputs,
            modifications: {
              studyHoursPerWeek: hours,
              classAttendancePct: attendance,
              assignmentCompletionPct: assignments
            }
          })
        });

        if (response.ok) {
          const res = await response.json();
          if (res.success && res.data) {
            const { newScore, delta, explanation } = res.data;
            if (simScoreVal) simScoreVal.textContent = `${newScore.toFixed(1)}%`;
            if (simDeltaBadge) {
              const sign = delta > 0 ? '+' : '';
              simDeltaBadge.textContent = delta === 0 ? 'Baseline' : `${sign}${delta.toFixed(1)} pts delta`;
              simDeltaBadge.style.color = delta > 0 ? '#10B981' : delta < 0 ? '#EF4444' : '#64748B';
            }
            if (simExplanation) simExplanation.textContent = explanation;
          }
        }
      } catch (err) {
        console.error('Simulation error:', err);
      }
    }, 120);
  }

  simHours?.addEventListener('input', runSimulation);
  simAtt?.addEventListener('input', runSimulation);
  simAss?.addEventListener('input', runSimulation);

  // AI Coach Plan Generator button
  document.getElementById('generate-coach-plan-btn')?.addEventListener('click', async () => {
    const coachContent = document.getElementById('coach-content-area');
    if (!coachContent) return;

    coachContent.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <div class="spinner" style="border: 3px solid rgba(59, 130, 246, 0.2); border-top: 3px solid #3B82F6; border-radius: 50%; width: 36px; height: 36px; animation: spin 0.8s linear infinite; margin: 0 auto 1rem auto;"></div>
        <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">Formulating Academic Roadmap...</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Consulting educational guidance models and tailoring study sprints.</p>
      </div>
    `;

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prediction })
      });

      if (!response.ok) throw new Error('Failed to generate coach plan');
      const res = await response.json();
      if (res.success && res.data) {
        state.activeAICoachPlan = res.data;
        renderCoachPlanUI(res.data);
        showToast('Academic coaching roadmap ready!', 'success');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
      coachContent.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <p style="color: #EF4444; margin-bottom: 1rem;">Unable to load AI roadmap.</p>
          <button id="retry-coach-btn" class="btn btn-secondary btn-sm">Try Again</button>
        </div>
      `;
      document.getElementById('retry-coach-btn')?.addEventListener('click', () => {
        document.getElementById('generate-coach-plan-btn')?.click();
      });
    }
  });

  function renderCoachPlanUI(plan) {
    const coachContent = document.getElementById('coach-content-area');
    if (!coachContent) return;

    coachContent.innerHTML = `
      <div>
        <!-- Provider & AI status banner -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: #FAF7F5; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-main);">
            <span style="color: var(--primary-600);">${icon('sparkles', '', 16)}</span>
            <strong>Personalized Academic Coaching Blueprint</strong>
          </div>
          <span class="badge ${plan.isAIPowered ? 'badge-burgundy' : 'badge-emerald'}" style="font-size: 0.75rem;">
            Engine: ${plan.provider}
          </span>
        </div>

        <!-- Executive Summary -->
        <div style="background: linear-gradient(135deg, #FFFFFF 0%, #FAF7F5 100%); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">Coaching Perspective</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">${plan.summary}</p>
        </div>

        <!-- 4-Week Roadmap -->
        <div style="margin-bottom: 2rem;">
          <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem;">
            Structured 4-Week Growth Roadmap
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${plan.fourWeekRoadmap.map((wk, i) => `
              <div style="background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary-600); text-transform: uppercase; letter-spacing: 0.05em;">Milestone 0${i+1}</span>
                  <span class="badge badge-burgundy">Week ${i+1}</span>
                </div>
                <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">${wk.week}</h5>
                <p style="font-size: 0.8rem; color: var(--text-subtle); margin-bottom: 0.75rem;"><strong>Focus:</strong> ${wk.focus}</p>
                <ul style="padding-left: 1.1rem; font-size: 0.825rem; color: var(--text-muted); line-height: 1.5;">
                  ${wk.actionItems.map(item => `<li style="margin-bottom: 0.25rem;">${item}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Suggested Study Routines -->
        <div style="margin-bottom: 2rem;">
          <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem;">
            Evidence-Based Study Techniques
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${plan.suggestedStudyRoutines.map(r => `
              <div style="background: #FAF7F5; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem;">
                <h5 style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">${r.title}</h5>
                <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">${r.detail}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Educator Conference Talking Points -->
        <div style="background: #FDF2F4; border: 1px solid #FCE7EB; border-radius: var(--radius-md); padding: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="color: var(--primary-600);">${icon('users', '', 18)}</span>
            <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--primary-700);">Suggested Discussion Points for Teachers & Advisors</h5>
          </div>
          <p style="font-size: 0.825rem; color: var(--primary-800); margin-bottom: 0.75rem;">
            Bring these questions to your next office hour or advisor conference to build an aligned plan:
          </p>
          <ul style="padding-left: 1.25rem; font-size: 0.825rem; color: var(--primary-800); line-height: 1.6;">
            ${plan.educatorConferenceTips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }
}
