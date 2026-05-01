// Browser-first API base:
// - Dev: use Vite proxy (relative "/api")
// - Prod/preview: allow overriding via VITE_API_BASE, otherwise fallback to localhost backend
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? '' : 'http://localhost:5000');

async function safeJson(res: Response) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return await res.json();
  const text = await res.text();
  const snippet = text.slice(0, 160).replace(/\s+/g, ' ').trim();
  throw new Error(
    `Non-JSON response (${res.status}) from ${res.url}. ` +
    `Is backend running and dev server restarted? Body: ${snippet || '(empty)'}`
  );
}

function getToken() {
  return localStorage.getItem('app_token');
}

const api = {
  post: (path: string, body: any) => fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
    },
    body: JSON.stringify(body)
  }),
  get: (path: string) => fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
    }
  }),
  put: (path: string, body: any) => fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
    },
    body: JSON.stringify(body)
  }),

  // Convenience helpers that never throw "Unexpected token <".
  postJson: async (path: string, body: any) => {
    const res = await api.post(path, body);
    const json = await safeJson(res);
    return { res, json };
  },
  getJson: async (path: string) => {
    const res = await api.get(path);
    const json = await safeJson(res);
    return { res, json };
  },
  putJson: async (path: string, body: any) => {
    const res = await api.put(path, body);
    const json = await safeJson(res);
    return { res, json };
  },
};

export default api;
