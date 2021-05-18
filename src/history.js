export let history = [];

export const addHistoryItem = (value) => {
  if (!value || history.includes(value)) {
    return;
  }

  history.push(value);
};

export const removeHistoryItem = (value) => {
  history.splice(
    history.findIndex((item) => item === value),
    1
  );
};

export const getLasteHistoryItem = () => {
  return history[history.length - 1];
};

export const clearHistory = () => (history = []);
