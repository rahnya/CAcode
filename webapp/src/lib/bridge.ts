type BridgeAction =
  | 'FOLLOW_PROJECT'
  | 'UNFOLLOW_PROJECT'
  | 'GET_FOLLOWED'
  | 'IS_FOLLOWED'
  | 'SET_PREFERENCE'
  | 'GET_PREFERENCE';

interface BridgeMessage {
  id: string;
  action: BridgeAction;
  payload?: unknown;
}

type PendingResolve = (value: unknown) => void;

const pending = new Map<string, PendingResolve>();
let counter = 0;

function generateId(): string {
  return `msg_${++counter}_${Date.now()}`;
}

function isWebView(): boolean {
  return typeof (window as any).ReactNativeWebView !== 'undefined';
}

// Called by Expo's injectJavaScript to resolve promises
(window as any).__bridge_resolve = (id: string, result: unknown) => {
  const resolve = pending.get(id);
  if (resolve) {
    pending.delete(id);
    resolve(result);
  }
};

// Listen for postMessage responses (fallback)
window.addEventListener('message', (event) => {
  try {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    if (data?.id && pending.has(data.id)) {
      const resolve = pending.get(data.id)!;
      pending.delete(data.id);
      resolve(data.result);
    }
  } catch {
    // ignore non-bridge messages
  }
});

export const bridge = {
  isWebView,

  send<T = unknown>(action: BridgeAction, payload?: unknown): Promise<T> {
    if (!isWebView()) {
      return bridge.localFallback(action, payload) as Promise<T>;
    }

    return new Promise<T>((resolve) => {
      const id = generateId();
      pending.set(id, resolve as PendingResolve);

      const message: BridgeMessage = { id, action, payload };
      (window as any).ReactNativeWebView.postMessage(JSON.stringify(message));

      // Timeout after 5s
      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          resolve(bridge.localFallback(action, payload) as T);
        }
      }, 5000);
    });
  },

  async localFallback(action: BridgeAction, payload?: unknown): Promise<unknown> {
    const STORAGE_KEY = 'cacode_followed';
    const PREF_PREFIX = 'cacode_pref_';

    switch (action) {
      case 'FOLLOW_PROJECT': {
        const { projectId } = payload as { projectId: string };
        const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (!ids.includes(projectId)) {
          ids.push(projectId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        }
        return { ok: true };
      }
      case 'UNFOLLOW_PROJECT': {
        const { projectId } = payload as { projectId: string };
        const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const filtered = ids.filter((id: string) => id !== projectId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return { ok: true };
      }
      case 'GET_FOLLOWED': {
        const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return { ids };
      }
      case 'IS_FOLLOWED': {
        const { projectId } = payload as { projectId: string };
        const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return { followed: ids.includes(projectId) };
      }
      case 'SET_PREFERENCE': {
        const { key, value } = payload as { key: string; value: string };
        localStorage.setItem(PREF_PREFIX + key, value);
        return { ok: true };
      }
      case 'GET_PREFERENCE': {
        const { key } = payload as { key: string };
        return { value: localStorage.getItem(PREF_PREFIX + key) };
      }
      default:
        return { error: 'Unknown action' };
    }
  },
};
