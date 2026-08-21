// Utility helper for authenticated and unauthenticated API calls
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('adminToken');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  return fetch(url, fetchOptions);
}

export async function parseApiResponse<T = any>(res: Response): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  const contentType = res.headers.get('content-type') || '';
  let data: any = null;

  try {
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || `HTTP ${res.status}: ${res.statusText}` };
      }
    }
  } catch (err: any) {
    data = { error: err.message || 'Failed to parse response' };
  }

  if (res.ok) {
    return { ok: true, status: res.status, data };
  } else {
    const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
    return { ok: false, status: res.status, error: errorMsg, data };
  }
}
