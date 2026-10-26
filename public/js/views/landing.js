import { icon } from '../icons.js';
import { state, setRole } from '../store.js';

export function renderLanding(container, navigateTo) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section style="padding: 4.5rem 0 3rem 0; background: linear-gradient(180deg, #FFFFFF 0%, #FAF7F5 100%); border-bottom: 1px solid var(--border-light);">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center;" class="lg:grid-cols-2">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--primary-50); border: 1px solid var(--primary-100); border-radius: 9999px; padding: 0.35rem 0.85rem; margin-bottom: 1.5rem;">
              <span style="color: var(--primary-600);">${icon('sparkles', '', 16)}</span>
              <span style="font-size: 0.825rem; font-weight: 600; color: var(--primary-700);">Empathetic Educational Analytics</span>
            </div>
            
            <h1 style="font-size: 2.75rem; font-weight: 800; line-height: 1.15; color: var(--text-main); margin-bottom: 1.25rem; letter-spacing: -0.025em;">
              Nurturing Academic Potential with <span style="color: var(--primary-600);">Thoughtful Early Insights</span>
            </h1>
            
            <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; max-width: 540px;">
              A supportive platform designed for students and educators to understand study habits, estimate academic trajectories, and discover practical next steps—without labels or pressure.
            </p>
            
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
              <button id="hero-get-prediction-btn" class="btn btn-primary btn-lg">
                ${icon('graduation-cap', '', 20)}
                <span>Get Your Prediction</span>
                ${icon('arrow-right', '', 18)}
              </button>
              
              <button id="hero-explore-dashboard-btn" class="btn btn-secondary btn-lg">
                ${icon('bar-chart-2', '', 18)}
                <span>Explore Educator Dashboard</span>
              </button>
            </div>

            <div style="display: flex; align-items: center; gap: 1.75rem; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-light);">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #10B981;">${icon('check-circle', '', 18)}</span>
                <span style="font-size: 0.875rem; color: var(--text-subtle);">Transparent Factor Breakdown</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #10B981;">${icon('check-circle', '', 18)}</span>
                <span style="font-size: 0.875rem; color: var(--text-subtle);">Privacy-First (No Account Required)</span>
              </div>
            </div>
          </div>

          <!-- Interactive Sample Prediction Card Preview -->
          <div style="position: relative;">
            <div style="position: absolute; -inset: 10px; background: linear-gradient(135deg, rgba(136, 19, 55, 0.12) 0%, rgba(159, 18, 57, 0.05) 100%); filter: blur(20px); border-radius: 24px; z-index: 0;"></div>
            
            <div class="card" style="position: relative; z-index: 1; border: 1px solid var(--border-light); box-shadow: var(--shadow-xl); padding: 1.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
                <div>
                  <div style="font-size: 0.775rem; font-weight: 700; color: var(--primary-600); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Live Sample Prediction</div>
                  <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Alex Jordan • 11th Grade</h3>
                </div>
                <span class="badge badge-blue">
                  ${icon('sparkles', '', 14)}
                  <span>Proficient (On Track)</span>
                </span>
              </div>

              <!-- Score dial summary -->
              <div style="background: linear-gradient(135deg, #FFFFFF 0%, #FAF7F5 50%, #FDF2F4 100%); border: 1px solid var(--primary-100); border-radius: var(--radius-md); padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
                <div>
                  <div style="font-size: 0.8rem; color: var(--text-subtle); margin-bottom: 0.2rem;">Estimated Performance</div>
                  <div style="font-size: 2.25rem; font-weight: 800; color: var(--primary-700); line-height: 1;">84.8%</div>
                  <div style="font-size: 0.775rem; color: var(--text-muted); margin-top: 0.35rem;">Expected Range: 81.5% – 88.0%</div>
                </div>
                <div style="text-align: right; max-width: 170px;">
                  <span class="badge badge-emerald" style="margin-bottom: 0.4rem;">High Confidence (89%)</span>
                  <p style="font-size: 0.75rem; color: var(--text-subtle); line-height: 1.3;">Based on steady attendance and dedicated study blocks.</p>
                </div>
              </div>

              <!-- Interactive Tabs inside preview -->
              <div class="tabs-header" id="sample-tabs" style="margin-bottom: 1rem;">
                <button class="tab-btn active" data-tab="factors">
                  ${icon('sliders', '', 14)} Key Factors
                </button>
                <button class="tab-btn" data-tab="strengths">
                  ${icon('trending-up', '', 14)} Positive Strengths
                </button>
                <button class="tab-btn" data-tab="actions">
                  ${icon('compass', '', 14)} Recommendations
                </button>
              </div>

              <div id="sample-tab-content">
                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.85rem;">
                    <span style="color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">${icon('clock', '', 14)} Study Hours (14 hrs/wk)</span>
                    <span style="font-weight: 600; color: #10B981;">+4.2 pts</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.85rem;">
                    <span style="color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">${icon('calendar', '', 14)} Class Attendance (92%)</span>
                    <span style="font-weight: 600; color: #10B981;">+3.4 pts</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.85rem;">
                    <span style="color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">${icon('book-open', '', 14)} Assignments (85%)</span>
                    <span style="font-weight: 600; color: #3B82F6;">Steady Baseline</span>
                  </div>
                </div>
              </div>

              <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px dashed var(--border-light); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.75rem; color: var(--text-subtle);">Ready to run your personalized estimate?</span>
                <button id="preview-try-btn" class="btn btn-ghost btn-sm" style="color: var(--primary-600); font-weight: 600;">
                  Enter Your Habits ${icon('chevron-right', '', 16)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Features Section -->
    <section style="padding: 4.5rem 0; background-color: var(--bg-app);">
      <div class="container">
        <div style="text-align: center; max-width: 640px; margin: 0 auto 3.5rem auto;">
          <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem;">
            Designed to Guide, Not Grade
          </h2>
          <p style="font-size: 1rem; color: var(--text-muted);">
            Predictive modeling built around student agency, transparent indicators, and early supportive interventions.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card card-hover">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--primary-50); color: var(--primary-600); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
              ${icon('sparkles', '', 24)}
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Personalized Insights</h3>
            <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5;">
              Understand exactly how your study volume, lecture engagement, and coursework habits combine to shape your academic trajectory.
            </p>
          </div>

          <div class="card card-hover">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--teal-50); color: var(--teal-600); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
              ${icon('heart', '', 24)}
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Early Support Pathways</h3>
            <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5;">
              Identify when attendance dips or tricky prerequisite concepts threaten progress, giving students time to adjust weeks before exams.
            </p>
          </div>

          <div class="card card-hover">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--indigo-50); color: var(--indigo-600); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
              ${icon('sliders', '', 24)}
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">What-If Simulator</h3>
            <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5;">
              Interact with live habit levers: see how adding two 45-minute study blocks or boosting assignment completion lifts your expected score.
            </p>
          </div>

          <div class="card card-hover">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #ECFDF5; color: #065F46; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
              ${icon('users', '', 24)}
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Educator Check-ins</h3>
            <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.5;">
              Equips teachers and advisors with non-punitive cohort metrics and compassionate conversation starters to reach students proactively.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section (3 Steps) -->
    <section style="padding: 4.5rem 0; background-color: #FFFFFF; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
      <div class="container">
        <div style="text-align: center; max-width: 600px; margin: 0 auto 3.5rem auto;">
          <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem;">
            How the System Works
          </h2>
          <p style="font-size: 1rem; color: var(--text-muted);">
            Three simple, transparent steps toward clearer academic direction.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div style="position: relative; text-align: center; padding: 1.5rem;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--primary-600); color: #FFFFFF; font-weight: 800; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto; box-shadow: 0 4px 12px rgba(136, 19, 55, 0.35);">
              1
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.6rem;">Share Your Study Context</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
              Enter key academic routines: weekly study hours, attendance rates, past coursework baseline, and resource access.
            </p>
          </div>

          <div style="position: relative; text-align: center; padding: 1.5rem;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--teal-600); color: #FFFFFF; font-weight: 800; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto; box-shadow: 0 4px 10px rgba(13, 148, 136, 0.3);">
              2
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.6rem;">Receive an Estimated Band</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
              View your predicted performance band with transparent factor weighting, confidence bounds, and highlighted strengths.
            </p>
          </div>

          <div style="position: relative; text-align: center; padding: 1.5rem;">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--primary-700); color: #FFFFFF; font-weight: 800; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto; box-shadow: 0 4px 12px rgba(136, 19, 55, 0.35);">
              3
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.6rem;">Take Confident Action</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
              Review practical, personalized study habits, activate our AI Study Coach roadmap, or discuss goals with your educator.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Privacy & Responsible Use Reassurance Banner -->
    <section style="padding: 4rem 0; background-color: var(--bg-app);">
      <div class="container">
        <div class="card" style="background: linear-gradient(135deg, #FFFFFF 0%, #FAF7F5 100%); border: 1px solid var(--border-light); padding: 2.25rem;">
          <div style="display: flex; flex-direction: column; gap: 1.5rem;" class="md:flex-row md:items-center">
            <div style="width: 56px; height: 56px; border-radius: 16px; background: var(--primary-50); border: 1px solid var(--primary-100); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--primary-600);">
              ${icon('shield-check', '', 32)}
            </div>
            <div style="flex: 1;">
              <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">
                Our Responsible Use & Privacy Pledge
              </h3>
              <p style="font-size: 0.925rem; color: var(--text-muted); line-height: 1.6;">
                Predictions are estimated indicators intended solely to encourage students and guide supportive dialogue. They are never formal assessments, nor do they limit a student's potential. We do not require real names or sensitive demographic data, and all inputs remain under your control.
              </p>
            </div>
            <div>
              <button id="learn-more-ethics-btn" class="btn btn-secondary">
                <span>Read Ethics & Privacy</span>
                ${icon('arrow-right', '', 16)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Banner -->
    <section style="padding: 4.5rem 0; background: linear-gradient(135deg, #2B0814 0%, #1A050C 100%); color: #FFFFFF; text-align: center;">
      <div class="container">
        <div style="max-width: 650px; margin: 0 auto;">
          <h2 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; color: #FFFFFF;">
            Start Exploring Your Academic Path Today
          </h2>
          <p style="font-size: 1.05rem; color: #94A3B8; margin-bottom: 2rem; line-height: 1.6;">
            Take 2 minutes to enter your study rhythms and discover evidence-based recommendations tailored to your goals.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <button id="cta-get-prediction-btn" class="btn btn-primary btn-lg" style="background-color: var(--primary-500);">
              ${icon('graduation-cap', '', 20)}
              <span>Calculate My Prediction</span>
            </button>
            <button id="cta-educator-btn" class="btn btn-secondary btn-lg" style="background: rgba(255,255,255,0.1); color: #FFFFFF; border-color: rgba(255,255,255,0.2);">
              ${icon('users', '', 18)}
              <span>Educator Cohort View</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `;

  // Attach button event listeners
  document.getElementById('hero-get-prediction-btn')?.addEventListener('click', () => {
    setRole('student');
    navigateTo('predict');
  });

  document.getElementById('hero-explore-dashboard-btn')?.addEventListener('click', () => {
    setRole('educator');
    navigateTo('educator');
  });

  document.getElementById('preview-try-btn')?.addEventListener('click', () => {
    setRole('student');
    navigateTo('predict');
  });

  document.getElementById('learn-more-ethics-btn')?.addEventListener('click', () => {
    navigateTo('about');
  });

  document.getElementById('cta-get-prediction-btn')?.addEventListener('click', () => {
    setRole('student');
    navigateTo('predict');
  });

  document.getElementById('cta-educator-btn')?.addEventListener('click', () => {
    setRole('educator');
    navigateTo('educator');
  });

  // Tab switching inside preview card
  const tabButtons = container.querySelectorAll('#sample-tabs .tab-btn');
  const contentArea = container.querySelector('#sample-tab-content');

  const tabContents = {
    factors: `
      <div style="display: flex; flex-direction: column; gap: 0.6rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.85rem;">
          <span style="color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">${icon('clock', '', 14)} Study Hours (14 hrs/wk)</span>
          <span style="font-weight: 600; color: #10B981;">+4.2 pts</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.85rem;">
          <span style="color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">${icon('calendar', '', 14)} Class Attendance (92%)</span>
          <span style="font-weight: 600; color: #10B981;">+3.4 pts</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: #FFFFFF; border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.85rem;">
          <span style="color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">${icon('book-open', '', 14)} Assignments (85%)</span>
          <span style="font-weight: 600; color: #3B82F6;">Steady Baseline</span>
        </div>
      </div>
    `,
    strengths: `
      <div style="display: flex; flex-direction: column; gap: 0.6rem;">
        <div style="padding: 0.6rem 0.75rem; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: var(--radius-sm); font-size: 0.825rem; color: #065F46;">
          <strong>Consistent Attendance:</strong> Being present for 92% of classes ensures unbroken conceptual continuity and catches live instructor guidance.
        </div>
        <div style="padding: 0.6rem 0.75rem; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: var(--radius-sm); font-size: 0.825rem; color: #065F46;">
          <strong>Focused Study Windows:</strong> 14 hours per week provides ample time for repetition and retrieval practice.
        </div>
      </div>
    `,
    actions: `
      <div style="display: flex; flex-direction: column; gap: 0.6rem;">
        <div style="padding: 0.6rem 0.75rem; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: var(--radius-sm); font-size: 0.825rem; color: #1E40AF;">
          <strong>Target 90%+ Assignment Rate:</strong> Completing assignments on time provides immediate feedback before exams.
        </div>
        <div style="padding: 0.6rem 0.75rem; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: var(--radius-sm); font-size: 0.825rem; color: #1E40AF;">
          <strong>Peer Study Session:</strong> Add 45 minutes of weekly collaborative review to solidify difficult concepts.
        </div>
      </div>
    `
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabKey = btn.getAttribute('data-tab');
      if (contentArea && tabContents[tabKey]) {
        contentArea.innerHTML = tabContents[tabKey];
      }
    });
  });
}
