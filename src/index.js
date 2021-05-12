const install = (Vue, newProps = {}) => {
  const defaultProps = {
    divider: "-",
    title: null,
    router: null,
  };

  const props = { ...defaultProps, ...newProps };
  const { router, title: appName, divider } = props;
  const history = [];

  const setPreviousTitle = () => {
    history.pop();
    setTitle(history.pop());
  };

  const setPageTitle = (title) => {
    let pageTitle = document.title;

    if (title) {
      pageTitle = title + (appName ? ` ${divider} ${appName}` : "");
    } else if (appName) {
      pageTitle = appName;
    }

    document.title = pageTitle;
  };

  const addToHistory = (title) => {
    if (!title) {
      return;
    }

    history.push(title);
  };

  const setTitle = (title) => {
    setPageTitle(title);
    addToHistory(title);
    $page.title = title;
  };

  const $page = {
    title: "",
  };

  Vue.util.defineReactive($page, "title", "");

  Object.defineProperty(Vue.prototype, "$title", {
    get: () => $page.title,
  });

  Vue.mixin({
    data() {
      return {
        $_vueReactiveTitle_isTitleSet: false,
      };
    },

    created() {
      const { title } = this.$options;

      if (!title) {
        return;
      }

      this.$setPageTitle(
        typeof title === "function" ? title.call(this, this) : title
      );
    },

    beforeDestroy() {
      if (this.$_vueReactiveTitle_isTitleSet) {
        setPreviousTitle();
      }
    },

    methods: {
      $setPageTitle(title) {
        this.$_vueReactiveTitle_isTitleSet = true;
        setTitle(title);
      },
    },
  });

  if (!router) {
    return;
  }

  router.onReady(() => {
    setTitle(router.currentRoute.meta.title);

    router.afterEach((to) => {
      if (to.matched.find((route) => route.meta.inheritPageTitle)) {
        return;
      }

      setTitle(to.meta.title);
    });
  });
};

export { install };

export default install;
