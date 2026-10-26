import { icon } from './icons.js';
import { state, setRole, showToast } from './store.js';
import { renderLanding } from './views/landing.js';
import { renderPredictForm } from './views/predict.js';
import { renderResults } from './views/results.js';
import { renderEducator } from './views/educator.js';
import { renderAbout } from './views/about.js';
import { renderHistory } from './views/history.js';

// Router mapping
const routes = {
  landing: renderLanding,
  predict: renderPredictForm,
  results: renderResults,
  educator: renderEducator,
  about: renderAbout,
  history: renderHistory
};

export function navigateTo(viewName) {
  if (!routes[viewName]) {
    viewName = 'landing';
  }
  state.currentView = viewName;
  window.location.hash = viewName === 'landing' ? '' : `#${viewName}`;
  renderCurrentView();
  updateNavState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentView() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const renderer = routes[state.currentView] || renderLanding;
  renderer(container, navigateTo);
}

function updateNavState() {
  // Update desktop navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === state.currentView) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update Role Switcher Toggle
  const studentRoleBtn = document.getElementById('role-btn-student');
  const educatorRoleBtn = document.getElementById('role-btn-educator');
  
  if (state.userRole === 'educator') {
    educatorRoleBtn?.classList.add('active-role');
    studentRoleBtn?.classList.remove('active-role');
  } else {
    studentRoleBtn?.classList.add('active-role');
    educatorRoleBtn?.classList.remove('active-role');
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Hash-based routing check
  const hash = window.location.hash.replace('#', '') || 'landing';
  state.currentView = routes[hash] ? hash : 'landing';

  // Navigation Links
  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const route = el.getAttribute('data-route');
      if (route) {
        // If clicking educator dashboard, automatically set role to educator
        if (route === 'educator') {
          setRole('educator');
        } else if (route === 'predict' || route === 'results') {
          setRole('student');
        }
        navigateTo(route);
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.style.display = 'none';
      }
    });
  });

  // Role Switcher buttons in header
  document.getElementById('role-btn-student')?.addEventListener('click', () => {
    setRole('student');
    showToast('Switched to Student Role', 'info', 2000);
    updateNavState();
    if (state.currentView === 'educator') {
      navigateTo('predict');
    }
  });

  document.getElementById('role-btn-educator')?.addEventListener('click', () => {
    setRole('educator');
    showToast('Switched to Educator Role (Demo)', 'info', 2000);
    updateNavState();
    if (state.currentView === 'landing' || state.currentView === 'predict') {
      navigateTo('educator');
    }
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileToggle?.addEventListener('click', () => {
    if (mobileMenu) {
      mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    }
  });

  // Listen to browser forward/back buttons
  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.replace('#', '') || 'landing';
    if (routes[newHash] && newHash !== state.currentView) {
      state.currentView = newHash;
      renderCurrentView();
      updateNavState();
    }
  });

  // Initial render
  renderCurrentView();
  updateNavState();
});
