
const STORAGE_KEY = "cute-task-manager-browser-id";

export const getBrowserId = () => {
  let browserId = localStorage.getItem(STORAGE_KEY);

  if (!browserId) {
    browserId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, browserId);
  }

  return browserId;
};