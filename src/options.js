const defaultOptions = {
  divider: "-",
  suffix: null,
  prefix: null,
  maxNotificationAmount: 99,
};

let options = {
  ...defaultOptions,
};

export const getOptions = () => options;

export const updateOptions = (params) => {
  options = {
    ...defaultOptions,
    ...params,
  };
};
