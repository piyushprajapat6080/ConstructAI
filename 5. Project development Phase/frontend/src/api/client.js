import { compressImage } from '../utils/imageCompressor';

// Production Render backend fallback URL
const DEFAULT_RENDER_BACKEND = 'https://constructai-backend.onrender.com';

/**
 * Returns the dynamic Swagger Interactive Docs URL based on environment configuration.
 * Priority:
 * 1. import.meta.env.VITE_API_URL or VITE_RENDER_BACKEND_URL (e.g. https://<app>.onrender.com)
 * 2. import.meta.env.VITE_API_BASE_URL (e.g. https://<app>.onrender.com/api)
 * 3. Fallback to production Render backend docs URL (https://constructai-backend.onrender.com/docs)
 */
export const getSwaggerDocsUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_RENDER_BACKEND_URL;
  if (envApiUrl && typeof envApiUrl === 'string') {
    const trimmed = envApiUrl.trim();
    if (trimmed.endsWith('/docs')) return trimmed;
    const clean = trimmed.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    return `${clean}/docs`;
  }

  const envApiBase = import.meta.env.VITE_API_BASE_URL;
  if (envApiBase && typeof envApiBase === 'string') {
    const trimmed = envApiBase.trim();
    if (trimmed.endsWith('/docs')) return trimmed;
    const clean = trimmed.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    return `${clean}/docs`;
  }

  return `${DEFAULT_RENDER_BACKEND}/docs`;
};

export const SWAGGER_DOCS_URL = getSwaggerDocsUrl();

// ConstructAI API Client Base Endpoint
const API_BASE = 
  import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.trim().replace(/\/api\/?$/, '').replace(/\/+$/, '')}/api` : 'http://localhost:8000/api');

async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    let message = `API Error ${res.status}: ${res.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.detail) message = typeof parsed.detail === 'string' ? parsed.detail : JSON.stringify(parsed.detail);
    } catch (_) {}
    throw new Error(message);
  }
  return await res.json();
}

export const api = {
  // 1. Site Safety Monitor
  async analyzeSafety({ sitePhoto, sitePhotoBase64, observationLog, safetyDoc }) {
    const formData = new FormData();
    if (sitePhoto) {
      let finalPhoto = sitePhoto;
      if (sitePhoto.size && sitePhoto.size > 800 * 1024) {
        try {
          const comp = await compressImage(sitePhoto, 1600, 0.8);
          if (comp && comp.file) finalPhoto = comp.file;
        } catch (_) {}
      }
      formData.append('site_photo', finalPhoto);
    }
    if (sitePhotoBase64) {
      formData.append('site_photo_b64', sitePhotoBase64);
    }
    formData.append('observation_log', observationLog || '');
    if (safetyDoc) {
      formData.append('safety_doc', safetyDoc);
    }

    const res = await fetch(`${API_BASE}/safety/analyze`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },

  // 2. Structural Crack Diagnosis
  async analyzeCrack({ crackImage, crackImageBase64, description, structureType }) {
    const formData = new FormData();
    if (crackImage) {
      let finalCrack = crackImage;
      if (crackImage.size && crackImage.size > 800 * 1024) {
        try {
          const comp = await compressImage(crackImage, 1600, 0.8);
          if (comp && comp.file) finalCrack = comp.file;
        } catch (_) {}
      }
      formData.append('crack_image', finalCrack);
    }
    if (crackImageBase64) {
      formData.append('crack_image_b64', crackImageBase64);
    }
    formData.append('description', description || '');
    formData.append('structure_type', structureType || 'RCC Beam');

    const res = await fetch(`${API_BASE}/crack/analyze`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },

  // 3. Real Estate Valuation
  async calculateValuation(data) {
    const res = await fetch(`${API_BASE}/valuation/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // 4. Project Planner & Cost Estimator
  async generatePlan(projectBrief) {
    const res = await fetch(`${API_BASE}/planner/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_brief: projectBrief }),
    });
    return handleResponse(res);
  },

  // 5. Knowledge Assistant
  async queryKnowledge(category, query) {
    const res = await fetch(`${API_BASE}/knowledge/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, query }),
    });
    return handleResponse(res);
  },

  // 6. Chatbot
  async sendChatMessage(message, history = []) {
    const res = await fetch(`${API_BASE}/chatbot/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    return handleResponse(res);
  },

  // 7. Daily Site Assistant
  async generateDailyAssistant(data) {
    const res = await fetch(`${API_BASE}/assistant/generate-daily`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // 8. Weather Advisor
  async checkWeatherFeasibility(data) {
    const res = await fetch(`${API_BASE}/weather/check-feasibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Authentication & RBAC
  async login({ username, password, role }) {
    const res = await fetch(`${API_BASE}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });
    return handleResponse(res);
  },

  async getRoles() {
    const res = await fetch(`${API_BASE}/v1/auth/roles`);
    return handleResponse(res);
  },

  async getCurrentUser(token) {
    const res = await fetch(`${API_BASE}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  },

  // Enterprise Credential & Staff Provisioning (Admin only)
  async getProvisionedUsers(token) {
    const authToken = token || localStorage.getItem('constructai_token');
    const res = await fetch(`${API_BASE}/v1/admin/users`, {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}` 
      },
    });
    return handleResponse(res);
  },

  async provisionUser(userData, token) {
    const authToken = token || localStorage.getItem('constructai_token');
    const res = await fetch(`${API_BASE}/v1/admin/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}` 
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async revokeUser(userId, token) {
    const authToken = token || localStorage.getItem('constructai_token');
    const res = await fetch(`${API_BASE}/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 
        Authorization: `Bearer ${authToken}` 
      },
    });
    return handleResponse(res);
  },

  // Health check
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { status: 'offline', error: e.message };
    }
  }
};
