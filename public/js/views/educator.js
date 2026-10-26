import { icon } from '../icons.js';
import { state, showToast } from '../store.js';

export function renderEducator(container, navigateTo) {
  container.innerHTML = `
    <div style="padding: 2.5rem 0 4rem 0;">
      <div class="container">
        
        <!-- Header & Breadcrumbs -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-subtle); margin-bottom: 0.5rem;">
              <button id="educator-back-home" class="btn btn-ghost btn-sm" style="padding: 0;">${icon('arrow-left', '', 14)} Back to Home</button>
              <span>/</span>
              <span style="color: var(--text-main); font-weight: 500;">Educator Cohort Analytics</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <h1 style="font-size: 2.25rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.02em;">
                Educator Advisory Dashboard
              </h1>
              <span class="badge badge-amber" style="font-size: 0.75rem;">Demo Dataset Active</span>
            </div>
            <p style="font-size: 0.95rem; color: var(--text-muted); margin-top: 0.25rem;">
              Cohort tracking and early check-in indicators to support student success with empathy.
            </p>
          </div>

          <!-- Top Actions -->
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <button id="export-csv-btn" class="btn btn-secondary">
              ${icon('download', '', 16)} Export Cohort CSV
            </button>
            <button id="add-student-modal-btn" class="btn btn-primary">
              ${icon('plus', '', 16)} Add Demo Student
            </button>
          </div>
        </div>

        <!-- Summary KPI Metrics Cards -->
        <div id="educator-kpi-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style="margin-bottom: 2rem;">
          <div class="card skeleton" style="height: 110px;"></div>
          <div class="card skeleton" style="height: 110px;"></div>
          <div class="card skeleton" style="height: 110px;"></div>
          <div class="card skeleton" style="height: 110px;"></div>
        </div>

        <!-- Cohort Distribution Chart Card -->
        <div class="card" style="margin-bottom: 2rem; padding: 1.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main);">Performance Band Distribution</h3>
              <p style="font-size: 0.8rem; color: var(--text-subtle);">Active cohort breakdown across empirical mastery tiers.</p>
            </div>
            <div id="cohort-avg-tag" style="font-size: 0.85rem; font-weight: 600; color: var(--primary-700); background: var(--primary-50); padding: 0.25rem 0.65rem; border-radius: var(--radius-sm); border: 1px solid var(--primary-100);">
              Loading analytics...
            </div>
          </div>

          <div id="distribution-chart-area" style="display: flex; flex-direction: column; gap: 0.85rem;">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Search & Filter Controls -->
        <div class="card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
          <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;" class="md:grid-cols-4">
            
            <!-- Search Input -->
            <div style="position: relative;" class="md:grid-cols-2">
              <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-subtle);">
                ${icon('search', '', 16)}
              </span>
              <input 
                type="text" 
                id="educator-search-input" 
                class="form-input" 
                placeholder="Search by student name or STU ID..." 
                style="padding-left: 2.25rem;"
              />
            </div>

            <!-- Grade Filter -->
            <div>
              <select id="filter-grade" class="form-select">
                <option value="all">All Grade Levels</option>
                <option value="9th Grade">9th Grade</option>
                <option value="10th Grade">10th Grade</option>
                <option value="11th Grade">11th Grade</option>
                <option value="12th Grade">12th Grade</option>
                <option value="Undergraduate Year 1">Undergraduate Year 1</option>
              </select>
            </div>

            <!-- Band Filter -->
            <div>
              <select id="filter-band" class="form-select">
                <option value="all">All Performance Bands</option>
                <option value="exceeding">Exceeding (85%+)</option>
                <option value="proficient">Proficient (70-84%)</option>
                <option value="developing">Developing (55-69%)</option>
                <option value="foundational">Foundational (&lt;55%)</option>
              </select>
            </div>

            <!-- Check-in only checkbox -->
            <div style="display: flex; align-items: center; gap: 0.5rem; padding-left: 0.25rem;">
              <input type="checkbox" id="filter-checkin-only" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary-600);" />
              <label for="filter-checkin-only" style="font-size: 0.875rem; font-weight: 600; color: var(--text-main); cursor: pointer;">
                Check-in Suggested Only
              </label>
            </div>

          </div>
        </div>

        <!-- Student Data Table Container -->
        <div class="table-container" style="margin-bottom: 2rem;">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Predicted Score</th>
                <th>Performance Band</th>
                <th>Attendance</th>
                <th>Study Time</th>
                <th>Check-In Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody id="student-table-body">
              <tr>
                <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-subtle);">
                  Loading student cohort records...
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Student Detail Drawer Panel -->
        <div id="student-drawer-backdrop" class="drawer-backdrop">
          <div class="drawer-panel" id="student-drawer-panel">
            <div id="drawer-content-area">
              <!-- Rendered when a student is selected -->
            </div>
          </div>
        </div>

        <!-- Add Student Modal -->
        <div id="add-student-modal" style="display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 60; align-items: center; justify-content: center;">
          <div class="card" style="max-width: 520px; width: 90%; max-height: 90vh; overflow-y: auto; padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Add Demo Student Record</h3>
              <button id="close-add-modal" class="btn btn-ghost btn-sm" style="padding: 0.25rem;">${icon('x', '', 20)}</button>
            </div>
            
            <form id="add-student-form">
              <div class="form-group">
                <label class="form-label">Student Name</label>
                <input type="text" id="add-name" class="form-input" placeholder="e.g. Samuel Chen" required />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Grade Level</label>
                  <select id="add-grade" class="form-select">
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                    <option value="11th Grade" selected>11th Grade</option>
                    <option value="12th Grade">12th Grade</option>
                    <option value="Undergraduate Year 1">Undergrad Year 1</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Attendance (%)</label>
                  <input type="number" id="add-att" class="form-input" min="20" max="100" value="85" required />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Study Hours/Wk</label>
                  <input type="number" id="add-hours" class="form-input" min="0" max="40" value="12" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Previous Score (%)</label>
                  <input type="number" id="add-score" class="form-input" min="30" max="100" value="78" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Educator Observation / Note</label>
                <textarea id="add-notes" class="form-input" rows="3" placeholder="Optional notes on learning preferences or support needs..."></textarea>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
                <button type="button" id="cancel-add-btn" class="btn btn-secondary">Cancel</button>
                <button type="submit" class="btn btn-primary">Save to Cohort</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach navigation
  document.getElementById('educator-back-home')?.addEventListener('click', () => {
    navigateTo('landing');
  });

  // CSV Export action
  document.getElementById('export-csv-btn')?.addEventListener('click', () => {
    window.location.href = '/api/educator/export';
    showToast('Cohort CSV exported successfully!', 'success');
  });

  // Modal open/close
  const addModal = document.getElementById('add-student-modal');
  document.getElementById('add-student-modal-btn')?.addEventListener('click', () => {
    if (addModal) addModal.style.display = 'flex';
  });
  document.getElementById('close-add-modal')?.addEventListener('click', () => {
    if (addModal) addModal.style.display = 'none';
  });
  document.getElementById('cancel-add-btn')?.addEventListener('click', () => {
    if (addModal) addModal.style.display = 'none';
  });

  // Add student form submission
  document.getElementById('add-student-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newRecord = {
      studentName: document.getElementById('add-name')?.value || 'Demo Student',
      gradeLevel: document.getElementById('add-grade')?.value || '11th Grade',
      attendancePct: parseFloat(document.getElementById('add-att')?.value || '85'),
      studyHoursPerWeek: parseFloat(document.getElementById('add-hours')?.value || '12'),
      previousScore: parseFloat(document.getElementById('add-score')?.value || '75'),
      assignmentCompletionPct: 85,
      participationLevel: 'moderate',
      notes: document.getElementById('add-notes')?.value || ''
    };

    try {
      const response = await fetch('/api/educator/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
      if (response.ok) {
        if (addModal) addModal.style.display = 'none';
        showToast('New student added to demo cohort!', 'success');
        loadAnalytics();
        loadStudents();
      }
    } catch (err) {
      showToast('Failed to add student record.', 'error');
    }
  });

  // Drawer backdrop click to close
  const drawerBackdrop = document.getElementById('student-drawer-backdrop');
  drawerBackdrop?.addEventListener('click', (e) => {
    if (e.target === drawerBackdrop) {
      drawerBackdrop.classList.remove('open');
    }
  });

  // Search & Filter event bindings
  const searchInput = document.getElementById('educator-search-input');
  const gradeSelect = document.getElementById('filter-grade');
  const bandSelect = document.getElementById('filter-band');
  const checkInCheck = document.getElementById('filter-checkin-only');

  let filterTimeout = null;
  function triggerFilterUpdate() {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(loadStudents, 200);
  }

  searchInput?.addEventListener('input', triggerFilterUpdate);
  gradeSelect?.addEventListener('change', triggerFilterUpdate);
  bandSelect?.addEventListener('change', triggerFilterUpdate);
  checkInCheck?.addEventListener('change', triggerFilterUpdate);

  // Initial Data Load
  loadAnalytics();
  loadStudents();

  // Load KPI analytics & distribution
  async function loadAnalytics() {
    try {
      const response = await fetch('/api/educator/analytics');
      if (!response.ok) return;
      const res = await response.json();
      if (!res.success || !res.data) return;

      const data = res.data;
      const kpiContainer = document.getElementById('educator-kpi-container');
      if (kpiContainer) {
        kpiContainer.innerHTML = `
          <!-- KPI 1 -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-subtle); text-transform: uppercase;">Total Monitored</span>
              <span style="color: var(--primary-600);">${icon('users', '', 20)}</span>
            </div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--text-main); line-height: 1;">${data.totalStudents}</div>
            <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 0.4rem;">Across active grades</div>
          </div>

          <!-- KPI 2 -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-subtle); text-transform: uppercase;">Cohort Avg Score</span>
              <span style="color: #10B981;">${icon('trending-up', '', 20)}</span>
            </div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--text-main); line-height: 1;">${data.averagePredictedScore}%</div>
            <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 0.4rem;">Proficient baseline</div>
          </div>

          <!-- KPI 3 -->
          <div class="card" style="border-left: 4px solid #F59E0B;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 600; color: #B45309; text-transform: uppercase;">Check-Ins Suggested</span>
              <span style="color: #F59E0B;">${icon('heart', '', 20)}</span>
            </div>
            <div style="font-size: 2rem; font-weight: 800; color: #92400E; line-height: 1;">${data.checkInRecommendedCount}</div>
            <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 0.4rem;">Early outreach opportunities</div>
          </div>

          <!-- KPI 4 -->
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-subtle); text-transform: uppercase;">Avg Attendance</span>
              <span style="color: var(--teal-600);">${icon('calendar', '', 20)}</span>
            </div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--text-main); line-height: 1;">${data.averageAttendance}%</div>
            <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 0.4rem;">Class presence rate</div>
          </div>
        `;
      }

      // Update avg tag
      const avgTag = document.getElementById('cohort-avg-tag');
      if (avgTag) avgTag.textContent = `Cohort Mean: ${data.averagePredictedScore}%`;

      // Render Visual Distribution Bars
      const chartArea = document.getElementById('distribution-chart-area');
      if (chartArea && data.bandDistribution) {
        chartArea.innerHTML = data.bandDistribution.map(band => `
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.825rem; font-weight: 600; margin-bottom: 0.3rem;">
              <span style="color: var(--text-main);">${band.label}</span>
              <span style="color: var(--text-muted);">${band.count} students (${band.percentage}%)</span>
            </div>
            <div style="width: 100%; height: 10px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
              <div style="width: ${band.percentage}%; height: 100%; background-color: ${band.color}; border-radius: 9999px; transition: width 0.4s ease;"></div>
            </div>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  }

  // Load students table with active filters
  async function loadStudents() {
    const searchVal = searchInput?.value || '';
    const gradeVal = gradeSelect?.value || 'all';
    const bandVal = bandSelect?.value || 'all';
    const checkInVal = checkInCheck?.checked || false;

    const params = new URLSearchParams();
    if (searchVal) params.set('search', searchVal);
    if (gradeVal !== 'all') params.set('grade', gradeVal);
    if (bandVal !== 'all') params.set('band', bandVal);
    if (checkInVal) params.set('checkInOnly', 'true');

    try {
      const response = await fetch(`/api/educator/students?${params.toString()}`);
      if (!response.ok) return;
      const res = await response.json();
      if (!res.success) return;

      const tbody = document.getElementById('student-table-body');
      if (!tbody) return;

      if (!res.data || res.data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-muted);">
              ${icon('search', '', 28)}
              <div style="font-weight: 600; margin-top: 0.5rem;">No student records match the current filters.</div>
              <div style="font-size: 0.825rem; color: var(--text-subtle);">Try clearing your search query or reset filters.</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = res.data.map(student => `
        <tr class="table-row-hover">
          <td>
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <div style="width: 34px; height: 34px; border-radius: 50%; background: var(--primary-50); color: var(--primary-700); border: 1px solid var(--primary-100); font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center;">
                ${student.studentName.charAt(0)}
              </div>
              <div>
                <div style="font-weight: 600; color: var(--text-main);">${student.studentName}</div>
                <div style="font-size: 0.75rem; color: var(--text-subtle);">${student.studentIdTag}</div>
              </div>
            </div>
          </td>
          <td><span style="font-size: 0.85rem; color: var(--text-muted);">${student.gradeLevel}</span></td>
          <td><strong style="color: var(--text-main); font-size: 0.95rem;">${student.predictedScore.toFixed(1)}%</strong></td>
          <td><span class="badge ${student.performanceBand.badgeBg}">${student.performanceBand.label}</span></td>
          <td><span style="font-size: 0.875rem;">${student.attendancePct}%</span></td>
          <td><span style="font-size: 0.875rem;">${student.studyHoursPerWeek} hrs/wk</span></td>
          <td>
            ${student.checkInRecommended 
              ? `<span class="badge badge-amber">${icon('heart', '', 12)} Check-In Suggested</span>`
              : `<span class="badge badge-emerald">${icon('check-circle', '', 12)} On Track</span>`}
          </td>
          <td style="text-align: right;">
            <button class="btn btn-ghost btn-sm view-student-btn" data-id="${student.id}" style="color: var(--primary-600); font-weight: 600;">
              View Details ${icon('chevron-right', '', 14)}
            </button>
          </td>
        </tr>
      `).join('');

      // Attach View Details handlers
      tbody.querySelectorAll('.view-student-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          openStudentDrawer(id);
        });
      });
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  }

  // Open Student Detail Drawer
  async function openStudentDrawer(studentId) {
    const drawerBackdrop = document.getElementById('student-drawer-backdrop');
    const drawerContent = document.getElementById('drawer-content-area');
    if (!drawerBackdrop || !drawerContent) return;

    drawerContent.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem;">
        <div class="spinner" style="border: 3px solid #E2E8F0; border-top: 3px solid #3B82F6; border-radius: 50%; width: 32px; height: 32px; animation: spin 0.8s linear infinite; margin: 0 auto 1rem auto;"></div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">Loading student profile...</div>
      </div>
    `;
    drawerBackdrop.classList.add('open');

    try {
      const response = await fetch(`/api/educator/student/${studentId}`);
      if (!response.ok) throw new Error('Student not found');
      const res = await response.json();
      if (!res.success || !res.data) throw new Error('Invalid student data');

      const student = res.data;

      drawerContent.innerHTML = `
        <div>
          <!-- Drawer Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-light);">
            <div>
              <div style="font-size: 0.775rem; font-weight: 700; color: var(--primary-600); text-transform: uppercase; letter-spacing: 0.05em;">Student Profile</div>
              <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main);">${student.studentName}</h3>
              <div style="font-size: 0.85rem; color: var(--text-subtle);">${student.studentIdTag} • ${student.gradeLevel}</div>
            </div>
            <button id="close-drawer-btn" class="btn btn-ghost btn-sm" style="padding: 0.35rem;">
              ${icon('x', '', 20)}
            </button>
          </div>

          <!-- Score Card -->
          <div style="background: linear-gradient(135deg, #FFFFFF 0%, #FAF7F5 50%, #FDF2F4 100%); border: 1px solid var(--primary-100); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-subtle);">Predicted Trajectory</span>
              <span class="badge ${student.performanceBand.badgeBg}">${student.performanceBand.label}</span>
            </div>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--primary-700);">${student.predictedScore.toFixed(1)}%</div>
          </div>

          <!-- Supportive Check-in Guidance (If recommended) -->
          ${student.checkInRecommended ? `
            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; color: #92400E; margin-bottom: 0.4rem;">
                ${icon('heart', '', 18)}
                <h4 style="font-size: 0.95rem; font-weight: 700;">Check-in Opportunity</h4>
              </div>
              <p style="font-size: 0.85rem; color: #92400E; line-height: 1.5; margin-bottom: 0.75rem;">
                ${student.checkInReason || 'Metrics indicate a timely moment for supportive dialogue.'}
              </p>
              <div style="background: #FFFFFF; border-radius: var(--radius-sm); padding: 0.75rem; border: 1px solid #FCD34D;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #B45309; text-transform: uppercase; margin-bottom: 0.25rem;">Suggested Question for Teacher:</div>
                <div style="font-size: 0.825rem; color: #78350F; font-style: italic;">
                  "I've noticed your natural curiosity during class. How are your current study hours feeling, and is there any topic we can clarify together?"
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Academic Factors Breakdown -->
          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem;">Key Academic Habits</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; justify-content: space-between; padding: 0.65rem 0.85rem; background: #F8FAFC; border-radius: var(--radius-sm); border: 1px solid var(--border-light); font-size: 0.85rem;">
                <span style="color: var(--text-muted);">Class Attendance Rate</span>
                <strong>${student.attendancePct}%</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.65rem 0.85rem; background: #F8FAFC; border-radius: var(--radius-sm); border: 1px solid var(--border-light); font-size: 0.85rem;">
                <span style="color: var(--text-muted);">Weekly Independent Study</span>
                <strong>${student.studyHoursPerWeek} hrs/week</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.65rem 0.85rem; background: #F8FAFC; border-radius: var(--radius-sm); border: 1px solid var(--border-light); font-size: 0.85rem;">
                <span style="color: var(--text-muted);">Assignment Completion</span>
                <strong>${student.assignmentCompletionPct}%</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.65rem 0.85rem; background: #F8FAFC; border-radius: var(--radius-sm); border: 1px solid var(--border-light); font-size: 0.85rem;">
                <span style="color: var(--text-muted);">Classroom Participation</span>
                <strong style="text-transform: capitalize;">${student.participationLevel.replace('_', ' ')}</strong>
              </div>
            </div>
          </div>

          <!-- Educator Observational Notes -->
          <div style="margin-bottom: 2rem;">
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem;">Educator Log & Notes</h4>
            <div id="drawer-notes-list" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem;">
              ${student.notes.map(note => `
                <div style="padding: 0.65rem 0.85rem; background: #F8FAFC; border-left: 3px solid var(--primary-500); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.825rem; color: var(--text-main);">
                  ${note}
                </div>
              `).join('')}
            </div>

            <!-- Add quick note -->
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="quick-note-input" class="form-input" placeholder="Add confidential observation note..." style="font-size: 0.85rem;" />
              <button id="add-quick-note-btn" class="btn btn-secondary btn-sm">Add</button>
            </div>
          </div>

        </div>
      `;

      // Close button inside drawer
      document.getElementById('close-drawer-btn')?.addEventListener('click', () => {
        drawerBackdrop.classList.remove('open');
      });

      // Quick note add
      document.getElementById('add-quick-note-btn')?.addEventListener('click', () => {
        const input = document.getElementById('quick-note-input');
        if (input && input.value.trim()) {
          const notesList = document.getElementById('drawer-notes-list');
          if (notesList) {
            const newDiv = document.createElement('div');
            newDiv.style.cssText = 'padding: 0.65rem 0.85rem; background: #F8FAFC; border-left: 3px solid var(--primary-500); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.825rem; color: var(--text-main);';
            newDiv.textContent = input.value.trim();
            notesList.appendChild(newDiv);
          }
          input.value = '';
          showToast('Observation note appended.', 'success');
        }
      });
    } catch (err) {
      drawerContent.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <p style="color: #EF4444; margin-bottom: 1rem;">Could not load student profile.</p>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('student-drawer-backdrop').classList.remove('open')">Close</button>
        </div>
      `;
    }
  }
}
