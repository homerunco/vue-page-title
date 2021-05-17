let history = [];

export const add = (value) => {
  if (!value || history.includes(value)) {
    return;
  }

  history.push(value);
};

export const pop = () => {
  return history.pop();
};

export const clear = () => {
  history = [];
};
