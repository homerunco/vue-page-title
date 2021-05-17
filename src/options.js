const defaultOptions = {
  divider: "-",
  suffix: null,
  router: null,
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
