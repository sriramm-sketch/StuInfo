import { icon } from '../icons.js';

export function renderAbout(container, navigateTo) {
  container.innerHTML = `
    <div style="padding: 3rem 0 5rem 0;">
      <div class="container" style="max-width: 860px;">
        
        <!-- Header -->
        <div style="margin-bottom: 2.5rem; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--primary-50); border: 1px solid var(--primary-100); border-radius: 9999px; padding: 0.35rem 0.85rem; margin-bottom: 1rem;">
            ${icon('shield-check', 'text-blue-600', 16)}
            <span style="font-size: 0.825rem; font-weight: 600; color: var(--primary-700);">Ethical AI & Predictive Stewardship</span>
          </div>
          <h1 style="font-size: 2.5rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.025em; margin-bottom: 0.75rem;">
            Our Responsible Use Philosophy
          </h1>
          <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.6; max-width: 640px; margin: 0 auto;">
            Empowering students and educators with supportive, transparent, and non-stigmatizing academic foresight.
          </p>
        </div>

        <!-- Section 1: What this tool does and does not do -->
        <div class="card" style="margin-bottom: 2rem; padding: 2rem;">
          <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem;">
            What This Tool Can and Cannot Do
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6" style="margin-top: 1.25rem;">
            <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: var(--radius-md); padding: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; color: #065F46; font-weight: 700; margin-bottom: 0.75rem;">
                ${icon('check-circle', '', 18)} What the Tool Does
              </div>
              <ul style="padding-left: 1.25rem; font-size: 0.875rem; color: #065F46; line-height: 1.6;">
                <li style="margin-bottom: 0.4rem;">Provides an early, empirical estimation of performance trajectory.</li>
                <li style="margin-bottom: 0.4rem;">Highlights specific, controllable study habits that drive retention.</li>
                <li style="margin-bottom: 0.4rem;">Identifies moments where a supportive check-in can unlock growth.</li>
                <li>Gives students a sandbox ("What-If" simulator) to experiment with weekly schedules.</li>
              </ul>
            </div>

            <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: var(--radius-md); padding: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; color: #991B1B; font-weight: 700; margin-bottom: 0.75rem;">
                ${icon('alert-circle', '', 18)} What the Tool Does NOT Do
              </div>
              <ul style="padding-left: 1.25rem; font-size: 0.875rem; color: #991B1B; line-height: 1.6;">
                <li style="margin-bottom: 0.4rem;">It does NOT determine or cap a student's true future capabilities.</li>
                <li style="margin-bottom: 0.4rem;">It is NOT a formal diagnostic test or official school transcript grade.</li>
                <li style="margin-bottom: 0.4rem;">It NEVER labels students with negative words like "bad", "weak", or "failure".</li>
                <li>It does NOT replace personal empathy, mentorship, and teacher insight.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Section 2: What Information We Use -->
        <div class="card" style="margin-bottom: 2rem; padding: 2rem;">
          <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem;">
            Information We Collect & Ethical Data Boundaries
          </h2>
          <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem;">
            To calculate a useful estimate, the system only asks for academic and study rhythm factors that are directly actionable by the student:
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="padding: 0.85rem 1rem; background: #F8FAFC; border: 1px solid var(--border-light); border-radius: var(--radius-md);">
              <strong style="color: var(--text-main); font-size: 0.9rem;">Weekly Study Hours:</strong>
              <span style="font-size: 0.85rem; color: var(--text-muted);"> Used to model memory consolidation volume and repetition intervals.</span>
            </div>
            <div style="padding: 0.85rem 1rem; background: #F8FAFC; border: 1px solid var(--border-light); border-radius: var(--radius-md);">
              <strong style="color: var(--text-main); font-size: 0.9rem;">Class Attendance Rate:</strong>
              <span style="font-size: 0.85rem; color: var(--text-muted);"> Accounts for direct teacher contact time and live context cues.</span>
            </div>
            <div style="padding: 0.85rem 1rem; background: #F8FAFC; border: 1px solid var(--border-light); border-radius: var(--radius-md);">
              <strong style="color: var(--text-main); font-size: 0.9rem;">Previous Academic Score:</strong>
              <span style="font-size: 0.85rem; color: var(--text-muted);"> Provides a historical baseline of prerequisite comprehension.</span>
            </div>
            <div style="padding: 0.85rem 1rem; background: #F8FAFC; border: 1px solid var(--border-light); border-radius: var(--radius-md);">
              <strong style="color: var(--text-main); font-size: 0.9rem;">Engagement & Resource Access:</strong>
              <span style="font-size: 0.85rem; color: var(--text-muted);"> Factors in active questioning, peer study groups, and digital learning support.</span>
            </div>
          </div>

          <div class="helper-box" style="margin-top: 1.25rem;">
            ${icon('shield-check', '', 16)} <strong>Zero Invasive Tracking:</strong> We never ask for sensitive demographic variables, financial records, or government IDs. Your privacy is paramount.
          </div>
        </div>

        <!-- Section 3: Guidance for Educators -->
        <div class="card" style="margin-bottom: 2rem; padding: 2rem;">
          <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem;">
            Responsible Guidance for Educators & Advisors
          </h2>
          <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem;">
            When reviewing predictions on the Educator Dashboard, please observe these core professional guidelines:
          </p>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; gap: 0.75rem;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--primary-50); color: var(--primary-600); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">1</div>
              <div>
                <strong style="color: var(--text-main); font-size: 0.9rem;">Lead with Curiosity and Empathy</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Never show a student their predicted score in isolation without supportive conversation. Ask open-ended questions about how they feel about the material and where they feel friction.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--primary-50); color: var(--primary-600); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">2</div>
              <div>
                <strong style="color: var(--text-main); font-size: 0.9rem;">Treat Results as Dynamic Hypotheses</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Human motivation is non-linear. A student with low historical scores who receives one great mentor check-in can completely redefine their trajectory.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--primary-50); color: var(--primary-600); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">3</div>
              <div>
                <strong style="color: var(--text-main); font-size: 0.9rem;">Protect Confidentiality</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Cohort metrics and individual flags should remain strictly confidential between certified educational staff, students, and authorized guardians.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Back to Prediction Button -->
        <div style="text-align: center; margin-top: 2.5rem;">
          <button id="about-predict-btn" class="btn btn-primary btn-lg">
            ${icon('graduation-cap', '', 18)} Go to Student Prediction Form
          </button>
        </div>

      </div>
    </div>
  `;

  document.getElementById('about-predict-btn')?.addEventListener('click', () => {
    navigateTo('predict');
  });
}
