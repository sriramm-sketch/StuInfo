/**
 * Client-Side Application State & Storage
 */

const STORAGE_KEY_PREDICTIONS = 'spps_saved_predictions_v1';
const STORAGE_KEY_ROLE = 'spps_user_role_v1';

export const state = {
  currentView: 'landing',
  userRole: localStorage.getItem(STORAGE_KEY_ROLE) || 'student', // 'student' | 'educator'
  currentPrediction: null,
  activeAICoachPlan: null,
  isGeneratingPrediction: false,
  isGeneratingCoachPlan: false,
  savedPredictions: loadSavedPredictions(),
  selectedEducatorStudent: null,
  toasts: []
};

export function setRole(role) {
  state.userRole = role;
  localStorage.setItem(STORAGE_KEY_ROLE, role);
  window.dispatchEvent(new CustomEvent('role-changed', { detail: role }));
}

export function loadSavedPredictions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREDICTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading saved predictions:', e);
    return [];
  }
}

export function savePredictionToStorage(prediction) {
  try {
    const existing = loadSavedPredictions();
    // Avoid exact duplicate ID
    const filtered = existing.filter(p => p.id !== prediction.id);
    filtered.unshift(prediction);
    // Keep last 25 records
    const trimmed = filtered.slice(0, 25);
    localStorage.setItem(STORAGE_KEY_PREDICTIONS, JSON.stringify(trimmed));
    state.savedPredictions = trimmed;
    return true;
  } catch (e) {
    console.error('Failed to save prediction:', e);
    return false;
  }
}

export function deleteSavedPrediction(id) {
  try {
    const existing = loadSavedPredictions();
    const updated = existing.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PREDICTIONS, JSON.stringify(updated));
    state.savedPredictions = updated;
    return true;
  } catch (e) {
    return false;
  }
}

export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconHtml = '';
  if (type === 'success') {
    iconHtml = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  } else if (type === 'error') {
    iconHtml = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else {
    iconHtml = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
  }

  toast.innerHTML = `${iconHtml} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}
