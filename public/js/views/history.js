import { icon } from '../icons.js';
import { state, loadSavedPredictions, deleteSavedPrediction, showToast } from '../store.js';

export function renderHistory(container, navigateTo) {
  const saved = loadSavedPredictions();

  if (saved.length === 0) {
    container.innerHTML = `
      <div style="padding: 5rem 0; text-align: center;">
        <div class="container" style="max-width: 520px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--primary-50); color: var(--primary-600); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
            ${icon('history', '', 32)}
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">No Saved Predictions Yet</h2>
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 1.75rem; line-height: 1.5;">
            When you calculate a prediction, you can click "Save to My Records" to store it locally in your browser for easy review and comparison.
          </p>
          <button id="history-start-pred-btn" class="btn btn-primary btn-lg">
            ${icon('graduation-cap', '', 18)} Create Your First Prediction
          </button>
        </div>
      </div>
    `;
    document.getElementById('history-start-pred-btn')?.addEventListener('click', () => navigateTo('predict'));
    return;
  }

  container.innerHTML = `
    <div style="padding: 2.5rem 0 4rem 0;">
      <div class="container">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-subtle); margin-bottom: 0.5rem;">
              <button id="history-back-home" class="btn btn-ghost btn-sm" style="padding: 0;">${icon('arrow-left', '', 14)} Back to Home</button>
              <span>/</span>
              <span style="color: var(--text-main); font-weight: 500;">Saved Records</span>
            </div>
            <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.02em;">
              Your Saved Predictions (${saved.length})
            </h1>
            <p style="font-size: 0.95rem; color: var(--text-muted); margin-top: 0.25rem;">
              Compare past iterations and observe how adjustments to study hours reflect in your trajectory.
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button id="compare-btn" class="btn btn-secondary" style="display: none;">
              ${icon('sliders', '', 16)} Compare Selected (2)
            </button>
            <button id="history-new-btn" class="btn btn-primary">
              ${icon('plus', '', 16)} New Prediction
            </button>
          </div>
        </div>

        <!-- Saved Records Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="history-cards-grid" style="margin-bottom: 2.5rem;">
          ${saved.map((item, idx) => `
            <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between; border-top: 3px solid var(--primary-500); padding: 1.5rem;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                  <div>
                    <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main);">${item.studentName || 'Student'}</h3>
                    <div style="font-size: 0.775rem; color: var(--text-subtle);">${item.gradeLevel} • ${new Date(item.calculatedAt).toLocaleDateString()}</div>
                  </div>
                  <span class="badge ${item.performanceBand?.badgeBg || 'badge-burgundy'}">${item.performanceBand?.label || 'Proficient'}</span>
                </div>

                <div style="background: #FAF7F5; border-radius: var(--radius-md); padding: 1rem; border: 1px solid var(--border-light); margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-size: 0.75rem; color: var(--text-subtle);">Predicted Score</div>
                    <div style="font-size: 1.75rem; font-weight: 800; color: var(--primary-700);">${item.predictedScore.toFixed(1)}%</div>
                  </div>
                  <div style="text-align: right; font-size: 0.8rem; color: var(--text-muted);">
                    <div>${item.inputs?.studyHoursPerWeek} hrs/wk</div>
                    <div>${item.inputs?.classAttendancePct}% attendance</div>
                  </div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <input type="checkbox" class="compare-checkbox" data-id="${item.id}" id="chk_${item.id}" style="cursor: pointer;" />
                  <label for="chk_${item.id}" style="font-size: 0.775rem; color: var(--text-subtle); cursor: pointer;">Compare</label>
                </div>

                <div style="display: flex; gap: 0.4rem;">
                  <button class="btn btn-ghost btn-sm delete-saved-btn" data-id="${item.id}" title="Delete Record" style="color: #94A3B8;">
                    ${icon('x', '', 16)}
                  </button>
                  <button class="btn btn-secondary btn-sm view-saved-btn" data-id="${item.id}">
                    View Full Analysis
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Comparison Modal Dialog -->
        <div id="comparison-modal" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 60; align-items: center; justify-content: center;">
          <div class="card" style="max-width: 800px; width: 95%; max-height: 90vh; overflow-y: auto; padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
              <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main);">Side-by-Side Trajectory Comparison</h3>
              <button id="close-compare-modal" class="btn btn-ghost btn-sm">${icon('x', '', 20)}</button>
            </div>
            <div id="comparison-content-grid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Rendered dynamically -->
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.getElementById('history-back-home')?.addEventListener('click', () => navigateTo('landing'));
  document.getElementById('history-new-btn')?.addEventListener('click', () => navigateTo('predict'));

  // View full analysis buttons
  container.querySelectorAll('.view-saved-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const found = saved.find(p => p.id === id);
      if (found) {
        state.currentPrediction = found;
        navigateTo('results');
      }
    });
  });

  // Delete saved record buttons
  container.querySelectorAll('.delete-saved-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to remove this record from your local history?')) {
        deleteSavedPrediction(id);
        showToast('Record deleted.', 'info');
        renderHistory(container, navigateTo);
      }
    });
  });

  // Comparison checkboxes logic
  const compareCheckboxes = container.querySelectorAll('.compare-checkbox');
  const compareBtn = document.getElementById('compare-btn');

  function updateCompareButton() {
    const checked = Array.from(compareCheckboxes).filter(c => c.checked);
    if (checked.length === 2) {
      if (compareBtn) {
        compareBtn.style.display = 'inline-flex';
        compareBtn.textContent = 'Compare Selected (2)';
      }
    } else {
      if (compareBtn) compareBtn.style.display = 'none';
      if (checked.length > 2) {
        showToast('You can compare at most 2 records at a time.', 'info');
      }
    }
  }

  compareCheckboxes.forEach(chk => chk.addEventListener('change', updateCompareButton));

  // Open comparison modal
  compareBtn?.addEventListener('click', () => {
    const checked = Array.from(compareCheckboxes).filter(c => c.checked).map(c => c.getAttribute('data-id'));
    if (checked.length !== 2) return;

    const itemA = saved.find(p => p.id === checked[0]);
    const itemB = saved.find(p => p.id === checked[1]);
    if (!itemA || !itemB) return;

    const modal = document.getElementById('comparison-modal');
    const content = document.getElementById('comparison-content-grid');
    if (!modal || !content) return;

    content.innerHTML = `
      ${renderCompareCard(itemA, 'Run A')}
      ${renderCompareCard(itemB, 'Run B')}
    `;

    modal.style.display = 'flex';
  });

  document.getElementById('close-compare-modal')?.addEventListener('click', () => {
    const modal = document.getElementById('comparison-modal');
    if (modal) modal.style.display = 'none';
  });

  function renderCompareCard(item, label) {
    return `
      <div style="background: #F8FAFC; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span class="badge badge-blue">${label}</span>
          <span style="font-size: 0.75rem; color: var(--text-subtle);">${new Date(item.calculatedAt).toLocaleDateString()}</span>
        </div>
        <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">${item.studentName}</h4>
        <div style="font-size: 0.8rem; color: var(--text-subtle); margin-bottom: 1rem;">${item.gradeLevel}</div>

        <div style="background: #FFFFFF; border-radius: var(--radius-sm); padding: 0.85rem; border: 1px solid var(--border-light); margin-bottom: 1rem; text-align: center;">
          <div style="font-size: 0.75rem; color: var(--text-subtle);">Predicted Score</div>
          <div style="font-size: 2rem; font-weight: 800; color: var(--primary-700);">${item.predictedScore.toFixed(1)}%</div>
          <span class="badge ${item.performanceBand?.badgeBg || 'badge-blue'}">${item.performanceBand?.label}</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.825rem;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Study Hours / Wk:</span>
            <strong>${item.inputs?.studyHoursPerWeek} hrs</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Class Attendance:</span>
            <strong>${item.inputs?.classAttendancePct}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Assignment Completion:</span>
            <strong>${item.inputs?.assignmentCompletionPct}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Baseline Score:</span>
            <strong>${item.inputs?.previousScore}%</strong>
          </div>
        </div>
      </div>
    `;
  }
}
