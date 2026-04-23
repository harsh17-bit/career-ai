const STORAGE_KEY = 'career-ai-notifications';
const EVENT_NAME = 'career-ai-notifications-updated';

const getStorage = () => {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveStorage = (items) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

export const getNotifications = () => getStorage();

export const addNotification = ({
  type = 'info',
  title,
  description,
  href = '',
  dedupeKey = '',
}) => {
  if (!title || !description) return;

  const current = getStorage();
  if (dedupeKey && current.some((item) => item.dedupeKey === dedupeKey)) {
    return;
  }

  const nextItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title,
    description,
    href,
    dedupeKey,
    read: false,
    createdAt: new Date().toISOString(),
  };

  saveStorage([nextItem, ...current].slice(0, 20));
};

export const markAllNotificationsRead = () => {
  const current = getStorage();
  saveStorage(current.map((item) => ({ ...item, read: true })));
};

export const clearNotifications = () => saveStorage([]);

export const subscribeNotifications = (handler) => {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
};
