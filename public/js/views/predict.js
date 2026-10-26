import { icon } from '../icons.js';
import { state, showToast } from '../store.js';

export function renderPredictForm(container, navigateTo) {
  // Check if we have prefilled inputs from a previous prediction or edit request
  const currentInputs = state.currentPrediction?.inputs || {
    studentName: '',
    ageRange: '15-18',
    gradeLevel: '11th Grade',
    studyHoursPerWeek: 12,
    classAttendancePct: 88,
    previousScore: 78,
    assignmentCompletionPct: 85,
    participationLevel: 'moderate',
    resourceAccess: 'moderate',
    studySupport: 'peer_study',
    extracurricularHours: 6
  };

  container.innerHTML = `
    <div style="padding: 2.5rem 0 4rem 0;">
      <div class="container" style="max-width: 860px;">
        
        <!-- Header & Breadcrumbs -->
        <div style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-subtle); margin-bottom: 0.5rem;">
            <button id="predict-back-home" class="btn btn-ghost btn-sm" style="padding: 0;">${icon('arrow-left', '', 14)} Back to Home</button>
            <span>/</span>
            <span style="color: var(--text-main); font-weight: 500;">Student Performance Form</span>
          </div>
          <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.02em;">
            Estimate Your Academic Trajectory
          </h1>
          <p style="font-size: 1rem; color: var(--text-muted); margin-top: 0.25rem;">
            Fill in your study habits below. Results are supportive estimates based on empirical educational patterns.
          </p>
        </div>

        <!-- Presets Bar for quick testing -->
        <div class="card card-subtle" style="margin-bottom: 2rem; background: #FFFFFF; border: 1px solid var(--border-light); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: var(--primary-600);">${icon('sparkles', '', 18)}</span>
              <span style="font-size: 0.875rem; font-weight: 600; color: var(--text-main);">Try a Quick Demo Profile:</span>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary btn-sm preset-btn" data-preset="balanced">
                Balanced Student (12h, 90%)
              </button>
              <button type="button" class="btn btn-secondary btn-sm preset-btn" data-preset="high_effort">
                High Effort (18h, 95%)
              </button>
              <button type="button" class="btn btn-secondary btn-sm preset-btn" data-preset="needs_attendance">
                Needs Attendance Lift (6h, 72%)
              </button>
            </div>
          </div>
        </div>

        <!-- Multi-Section Form -->
        <form id="prediction-form" novalidate>

          <!-- Section 1: Academic & Personal Context -->
          <div class="card" style="margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: var(--primary-50); color: var(--primary-600); display: flex; align-items: center; justify-content: center;">
                ${icon('user', '', 20)}
              </div>
              <div>
                <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main);">1. Academic & Personal Context</h2>
                <p style="font-size: 0.8rem; color: var(--text-subtle);">Basic context to align expectations with your current educational level.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label" for="studentName">
                  Student Name or Nickname <span style="font-weight: 400; color: var(--text-subtle);">(Optional)</span>
                </label>
                <input 
                  type="text" 
                  id="studentName" 
                  name="studentName" 
                  class="form-input" 
                  placeholder="e.g. Jordan or Alex" 
                  value="${currentInputs.studentName || ''}"
                />
                <div class="form-helper">Used only for personalizing your report. Never shared or stored on public servers.</div>
              </div>

              <div class="form-group">
                <label class="form-label" for="gradeLevel">
                  Current Grade / Level of Study <span style="color: #EF4444;">*</span>
                </label>
                <select id="gradeLevel" name="gradeLevel" class="form-select">
                  <option value="9th Grade" ${currentInputs.gradeLevel === '9th Grade' ? 'selected' : ''}>9th Grade (Freshman)</option>
                  <option value="10th Grade" ${currentInputs.gradeLevel === '10th Grade' ? 'selected' : ''}>10th Grade (Sophomore)</option>
                  <option value="11th Grade" ${currentInputs.gradeLevel === '11th Grade' ? 'selected' : ''}>11th Grade (Junior)</option>
                  <option value="12th Grade" ${currentInputs.gradeLevel === '12th Grade' ? 'selected' : ''}>12th Grade (Senior)</option>
                  <option value="Undergraduate Year 1" ${currentInputs.gradeLevel === 'Undergraduate Year 1' ? 'selected' : ''}>Undergraduate Year 1</option>
                  <option value="Undergraduate Year 2+" ${currentInputs.gradeLevel === 'Undergraduate Year 2+' ? 'selected' : ''}>Undergraduate Year 2+</option>
                  <option value="Graduate / Advanced" ${currentInputs.gradeLevel === 'Graduate / Advanced' ? 'selected' : ''}>Graduate / Advanced</option>
                </select>
                <div class="form-helper">Calibrates expected coursework volume and difficulty.</div>
              </div>
            </div>
          </div>

          <!-- Section 2: Study Habits & Dedication -->
          <div class="card" style="margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: var(--teal-50); color: var(--teal-600); display: flex; align-items: center; justify-content: center;">
                ${icon('clock', '', 20)}
              </div>
              <div>
                <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main);">2. Study Habits & Dedication</h2>
                <p style="font-size: 0.8rem; color: var(--text-subtle);">Weekly time investment outside of regular scheduled lecture hours.</p>
              </div>
            </div>

            <!-- Study Hours Slider -->
            <div class="form-group slider-container">
              <div class="slider-header">
                <label class="form-label" for="studyHoursPerWeek">Weekly Independent Study Hours</label>
                <span class="slider-val-badge" id="studyHours-display">${currentInputs.studyHoursPerWeek} hrs/week</span>
              </div>
              <input 
                type="range" 
                id="studyHoursPerWeek" 
                name="studyHoursPerWeek" 
                min="0" 
                max="40" 
                step="1" 
                value="${currentInputs.studyHoursPerWeek}" 
              />
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-subtle);">
                <span>0 hrs (Minimal)</span>
                <span>12-16 hrs (Standard)</span>
                <span>40 hrs (Intensive)</span>
              </div>
              <div class="helper-box">
                ${icon('info', '', 14)} <strong>Why this matters:</strong> Quality study hours facilitate memory consolidation and conceptual practice. 12-18 hours weekly is typical for strong mastery.
              </div>
            </div>

            <!-- Assignment Completion Slider -->
            <div class="form-group slider-container" style="margin-top: 1.5rem;">
              <div class="slider-header">
                <label class="form-label" for="assignmentCompletionPct">Assignment & Homework Completion Rate</label>
                <span class="slider-val-badge" id="assignment-display">${currentInputs.assignmentCompletionPct}%</span>
              </div>
              <input 
                type="range" 
                id="assignmentCompletionPct" 
                name="assignmentCompletionPct" 
                min="0" 
                max="100" 
                step="5" 
                value="${currentInputs.assignmentCompletionPct}" 
              />
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-subtle);">
                <span>0% (Infrequent)</span>
                <span>80% (Regular)</span>
                <span>100% (All Submissions)</span>
              </div>
              <div class="form-helper">Percentage of assignments completed on or before the due date.</div>
            </div>

            <!-- Learning Resource Access -->
            <div class="form-group" style="margin-top: 1.5rem;">
              <label class="form-label">Access to Learning Resources</label>
              <div class="radio-card-grid">
                <div class="radio-card ${currentInputs.resourceAccess === 'limited' ? 'selected' : ''}" data-field="resourceAccess" data-val="limited">
                  <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem;">Limited</div>
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">Textbooks only, limited internet or quiet space</div>
                </div>
                <div class="radio-card ${currentInputs.resourceAccess === 'moderate' ? 'selected' : ''}" data-field="resourceAccess" data-val="moderate">
                  <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem;">Moderate</div>
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">Reliable internet, standard notes & textbooks</div>
                </div>
                <div class="radio-card ${currentInputs.resourceAccess === 'extensive' ? 'selected' : ''}" data-field="resourceAccess" data-val="extensive">
                  <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem;">Extensive</div>
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">Digital tools, library access, tutor portal</div>
                </div>
              </div>
              <input type="hidden" id="resourceAccess" name="resourceAccess" value="${currentInputs.resourceAccess}" />
            </div>
          </div>

          <!-- Section 3: Engagement & Attendance -->
          <div class="card" style="margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: var(--indigo-50); color: var(--indigo-600); display: flex; align-items: center; justify-content: center;">
                ${icon('calendar', '', 20)}
              </div>
              <div>
                <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main);">3. Classroom Engagement & Attendance</h2>
                <p style="font-size: 0.8rem; color: var(--text-subtle);">Direct engagement with instructors and peer learning environments.</p>
              </div>
            </div>

            <!-- Attendance Rate Slider -->
            <div class="form-group slider-container">
              <div class="slider-header">
                <label class="form-label" for="classAttendancePct">Class Attendance Rate</label>
                <span class="slider-val-badge" id="attendance-display">${currentInputs.classAttendancePct}%</span>
              </div>
              <input 
                type="range" 
                id="classAttendancePct" 
                name="classAttendancePct" 
                min="20" 
                max="100" 
                step="1" 
                value="${currentInputs.classAttendancePct}" 
              />
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-subtle);">
                <span>20% (Frequent Absences)</span>
                <span>85% (Average)</span>
                <span>100% (Full Attendance)</span>
              </div>
              <div class="helper-box">
                ${icon('info', '', 14)} <strong>Empirical Note:</strong> Research shows class attendance has the highest direct correlation with retaining conceptual explanations and spontaneous test hints.
              </div>
            </div>

            <!-- Participation Level -->
            <div class="form-group" style="margin-top: 1.5rem;">
              <label class="form-label">In-Class Discussion & Question Asking</label>
              <div class="radio-card-grid">
                <div class="radio-card ${currentInputs.participationLevel === 'low' ? 'selected' : ''}" data-field="participationLevel" data-val="low">
                  <div style="font-weight: 600; font-size: 0.85rem;">Quiet Observer</div>
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">Rarely asks questions publicly</div>
                </div>
                <div class="radio-card ${currentInputs.participationLevel === 'moderate' ? 'selected' : ''}" data-field="participationLevel" data-val="moderate">
                  <div style="font-weight: 600; font-size: 0.85rem;">Moderate</div>
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">Asks questions when stuck</div>
                </div>
                <div class="radio-card ${currentInputs.participationLevel === 'active' ? 'selected' : ''}" data-field="participationLevel" data-val="active">
                  <div style="font-weight: 600; font-size: 0.85rem;">Active</div>
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">Regularly answers & contributes</div>
                </div>
                <div class="radio-card ${currentInputs.participationLevel === 'very_active' ? 'selected' : ''}" data-field="participationLevel" data-val="very_active">
                  <div style="font-weight: 600; font-size: 0.85rem;">Very Active</div>
                  <div style="font-size: 0.75rem; color: var(--text-subtle);">Leads peer discussions</div>
                </div>
              </div>
              <input type="hidden" id="participationLevel" name="participationLevel" value="${currentInputs.participationLevel}" />
            </div>

            <!-- Study Support & Extracurriculars -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style="margin-top: 1.5rem;">
              <div class="form-group">
                <label class="form-label" for="studySupport">Academic Support Type</label>
                <select id="studySupport" name="studySupport" class="form-select">
                  <option value="none" ${currentInputs.studySupport === 'none' ? 'selected' : ''}>Independent (No tutoring)</option>
                  <option value="peer_study" ${currentInputs.studySupport === 'peer_study' ? 'selected' : ''}>Peer Study Group</option>
                  <option value="office_hours" ${currentInputs.studySupport === 'office_hours' ? 'selected' : ''}>Teacher Office Hours</option>
                  <option value="formal_tutoring" ${currentInputs.studySupport === 'formal_tutoring' ? 'selected' : ''}>Formal Tutoring Service</option>
                </select>
                <div class="form-helper">Collaborative support provides an extra resilience buffer.</div>
              </div>

              <div class="form-group">
                <label class="form-label" for="extracurricularHours">
                  Extracurricular Hours / Week
                </label>
                <input 
                  type="number" 
                  id="extracurricularHours" 
                  name="extracurricularHours" 
                  class="form-input" 
                  min="0" 
                  max="40" 
                  value="${currentInputs.extracurricularHours || 6}" 
                />
                <div class="form-helper">Sports, arts, clubs, or work (4-15 hrs promotes cognitive balance).</div>
              </div>
            </div>
          </div>

          <!-- Section 4: Academic Baseline -->
          <div class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: #ECFDF5; color: #065F46; display: flex; align-items: center; justify-content: center;">
                ${icon('trending-up', '', 20)}
              </div>
              <div>
                <h2 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main);">4. Academic Baseline</h2>
                <p style="font-size: 0.8rem; color: var(--text-subtle);">Your historical benchmark provides context on prior concept mastery.</p>
              </div>
            </div>

            <div class="form-group slider-container">
              <div class="slider-header">
                <label class="form-label" for="previousScore">Previous Term Average Score / Grade Baseline (%)</label>
                <span class="slider-val-badge" id="prevScore-display">${currentInputs.previousScore}%</span>
              </div>
              <input 
                type="range" 
                id="previousScore" 
                name="previousScore" 
                min="30" 
                max="100" 
                step="1" 
                value="${currentInputs.previousScore}" 
              />
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-subtle);">
                <span>30% (Developing)</span>
                <span>75% (Proficient)</span>
                <span>100% (Mastery)</span>
              </div>
              <div class="form-helper">Your previous course grade or overall GPA converted into a percentage estimate.</div>
            </div>
          </div>

          <!-- Form Review & Submission Card -->
          <div class="card" style="background: linear-gradient(135deg, #FFFFFF 0%, #FAF7F5 100%); border: 2px solid var(--primary-100); padding: 1.75rem;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem;">
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">
                  Ready to Generate Your Analysis?
                </h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 520px; line-height: 1.5;">
                  Your submission is processed locally using our documented multi-factor heuristic model. You will receive an estimated performance band, detailed factor contributions, and practical step-by-step habits.
                </p>
              </div>

              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <button type="button" id="reset-form-btn" class="btn btn-secondary">
                  ${icon('refresh-cw', '', 16)} Reset Defaults
                </button>
                <button type="submit" id="submit-prediction-btn" class="btn btn-primary btn-lg">
                  ${icon('sparkles', '', 18)}
                  <span>Calculate Prediction</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        <!-- Loading Overlay Modal (Hidden by default) -->
        <div id="loading-overlay" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100; align-items: center; justify-content: center;">
          <div class="card" style="max-width: 440px; width: 90%; text-align: center; padding: 2.5rem 2rem; box-shadow: var(--shadow-xl);">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--primary-50); color: var(--primary-600); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
              <div class="spinner" style="border: 3px solid rgba(59, 130, 246, 0.2); border-top: 3px solid #3B82F6; border-radius: 50%; width: 32px; height: 32px; animation: spin 0.8s linear infinite;"></div>
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Analyzing Study Rhythms...</h3>
            <p id="loading-quote" style="font-size: 0.875rem; color: var(--text-muted); min-height: 48px; line-height: 1.5;">
              "Consistent small daily efforts compound into extraordinary long-term academic growth."
            </p>
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach back button
  document.getElementById('predict-back-home')?.addEventListener('click', () => {
    navigateTo('landing');
  });

  // Slider live display updates
  setupSliderDisplay('studyHoursPerWeek', 'studyHours-display', ' hrs/week');
  setupSliderDisplay('assignmentCompletionPct', 'assignment-display', '%');
  setupSliderDisplay('classAttendancePct', 'attendance-display', '%');
  setupSliderDisplay('previousScore', 'prevScore-display', '%');

  // Radio cards setup
  container.querySelectorAll('.radio-card').forEach(card => {
    card.addEventListener('click', () => {
      const field = card.getAttribute('data-field');
      const val = card.getAttribute('data-val');
      if (field && val) {
        container.querySelectorAll(`.radio-card[data-field="${field}"]`).forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const hiddenInput = document.getElementById(field);
        if (hiddenInput) hiddenInput.value = val;
      }
    });
  });

  // Preset button handlers
  container.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetType = btn.getAttribute('data-preset');
      applyPreset(presetType);
      showToast('Loaded preset profile', 'info', 2000);
    });
  });

  function applyPreset(type) {
    if (type === 'balanced') {
      updateInput('studentName', 'Alex Jordan');
      updateSlider('studyHoursPerWeek', 12, 'studyHours-display', ' hrs/week');
      updateSlider('assignmentCompletionPct', 88, 'assignment-display', '%');
      updateSlider('classAttendancePct', 90, 'attendance-display', '%');
      updateSlider('previousScore', 80, 'prevScore-display', '%');
      selectRadioCard('resourceAccess', 'moderate');
      selectRadioCard('participationLevel', 'moderate');
      updateSelect('studySupport', 'peer_study');
    } else if (type === 'high_effort') {
      updateInput('studentName', 'Elena Rostova');
      updateSlider('studyHoursPerWeek', 18, 'studyHours-display', ' hrs/week');
      updateSlider('assignmentCompletionPct', 96, 'assignment-display', '%');
      updateSlider('classAttendancePct', 96, 'attendance-display', '%');
      updateSlider('previousScore', 88, 'prevScore-display', '%');
      selectRadioCard('resourceAccess', 'extensive');
      selectRadioCard('participationLevel', 'active');
      updateSelect('studySupport', 'office_hours');
    } else if (type === 'needs_attendance') {
      updateInput('studentName', 'Marcus Vance');
      updateSlider('studyHoursPerWeek', 6, 'studyHours-display', ' hrs/week');
      updateSlider('assignmentCompletionPct', 65, 'assignment-display', '%');
      updateSlider('classAttendancePct', 72, 'attendance-display', '%');
      updateSlider('previousScore', 68, 'prevScore-display', '%');
      selectRadioCard('resourceAccess', 'limited');
      selectRadioCard('participationLevel', 'low');
      updateSelect('studySupport', 'none');
    }
  }

  function updateInput(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function updateSlider(id, val, displayId, suffix) {
    const el = document.getElementById(id);
    const disp = document.getElementById(displayId);
    if (el) el.value = val;
    if (disp) disp.textContent = `${val}${suffix}`;
  }

  function selectRadioCard(field, val) {
    container.querySelectorAll(`.radio-card[data-field="${field}"]`).forEach(c => {
      if (c.getAttribute('data-val') === val) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });
    const input = document.getElementById(field);
    if (input) input.value = val;
  }

  function updateSelect(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function setupSliderDisplay(sliderId, displayId, suffix) {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (slider && display) {
      slider.addEventListener('input', () => {
        display.textContent = `${slider.value}${suffix}`;
      });
    }
  }

  // Reset button
  document.getElementById('reset-form-btn')?.addEventListener('click', () => {
    applyPreset('balanced');
    showToast('Form reset to balanced defaults', 'info');
  });

  // Form submission
  const form = document.getElementById('prediction-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      studentName: document.getElementById('studentName')?.value || 'Student',
      gradeLevel: document.getElementById('gradeLevel')?.value || '11th Grade',
      studyHoursPerWeek: parseFloat(document.getElementById('studyHoursPerWeek')?.value || '12'),
      classAttendancePct: parseFloat(document.getElementById('classAttendancePct')?.value || '85'),
      previousScore: parseFloat(document.getElementById('previousScore')?.value || '75'),
      assignmentCompletionPct: parseFloat(document.getElementById('assignmentCompletionPct')?.value || '85'),
      participationLevel: document.getElementById('participationLevel')?.value || 'moderate',
      resourceAccess: document.getElementById('resourceAccess')?.value || 'moderate',
      studySupport: document.getElementById('studySupport')?.value || 'peer_study',
      extracurricularHours: parseFloat(document.getElementById('extracurricularHours')?.value || '6')
    };

    // Show loading overlay
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';

    // Revolving encouraging quotes during brief loading
    const quotes = [
      '"Studying with focus for 45 minutes beats hours of distracted multitasking."',
      '"Active recall and self-quizzing are the highest-yield cognitive strategies."',
      '"Consistent attendance keeps you seamlessly connected to classroom context."'
    ];
    let qIndex = 0;
    const quoteEl = document.getElementById('loading-quote');
    const interval = setInterval(() => {
      qIndex = (qIndex + 1) % quotes.length;
      if (quoteEl) quoteEl.textContent = quotes[qIndex];
    }, 450);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? Object.values(errorData.errors).join(', ') : 'Prediction failed');
      }

      const result = await response.json();
      if (result.success && result.data) {
        state.currentPrediction = result.data;
        state.activeAICoachPlan = null; // reset coach plan for new prediction
        if (overlay) overlay.style.display = 'none';
        showToast('Prediction calculated successfully!', 'success');
        navigateTo('results');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      clearInterval(interval);
      if (overlay) overlay.style.display = 'none';
      showToast(`Error: ${err.message}`, 'error', 5000);
    }
  });
}
