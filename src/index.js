const install = (Vue, newProps = {}) => {
  const defaultProps = {
    divider: "-",
    title: null,
    router: null,
  };

  const props = { ...defaultProps, ...newProps };
  const { router, title: appName, divider } = props;

  const setTitle = (title) => {
    let pageTitle = document.title;

    if (title) {
      pageTitle = title + (appName ? ` ${divider} ${appName}` : "");
    } else if (appName) {
      pageTitle = appName;
    }

    document.title = pageTitle;
  };

  const $page = {
    title: "",
  };

  Vue.util.defineReactive($page, "title", "");

  Object.defineProperty(Vue.prototype, "$title", {
    get: () => $page.title,
    set: (value) => setTitle(value),
  });

  Vue.prototype.$vueReactiveTitle = {
    reset: () => setTitle(router.currentRoute.meta.title),
  };

  if (!router) {
    return;
  }

  router.onReady(() => {
    setTitle(router.currentRoute.meta.title);

    router.afterEach((to) => {
      setTitle(to.meta.title);
    });
  });
};

export { install };

export default install;
