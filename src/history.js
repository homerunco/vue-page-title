let history = [];

export const addHistoryItem = (value) => {
  if (!value || history.includes(value)) {
    return;
  }

  history.push(value);
};

export const popHistoryItem = () => history.pop();

export const clearHistory = () => (history = []);
