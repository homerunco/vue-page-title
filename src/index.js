const install = (Vue, newProps = {}) => {
  const history = [];
  let notificationsCount = 0;
  const $page = { title: "" };
  const defaultProps = {
    divider: "-",
    title: null,
    router: null,
  };
  const props = { ...defaultProps, ...newProps };

  const { router } = props;

  const setPreviousTitle = () => {
    // we remove the current title from the history array
    history.pop();
    // we remove the previous title from the history array and render it as the current one
    setTitle(history.pop());
  };

  const setPageTitle = (title) => {
    const { title: appName, divider } = props;

    let pageTitle = document.title;

    if (title) {
      pageTitle = title + (appName ? ` ${divider} ${appName}` : "");
    } else if (appName) {
      pageTitle = appName;
    }

    if (notificationsCount > 0) {
      pageTitle = `(${notificationsCount}) ${pageTitle}`;
    }

    document.title = pageTitle;
  };

  const addToHistory = (title) => {
    if (!title || history.includes(title)) {
      return;
    }

    history.push(title);
  };

  const setTitle = (title) => {
    setPageTitle(title);
    addToHistory(title);

    $page.title = title;
  };

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
      this.$resetPageTitle();
    },

    methods: {
      $updateNotificationsCounter(count) {
        notificationsCount = count;
        setTitle(history.pop());
      },

      $resetPageTitle() {
        if (this.$_vueReactiveTitle_isTitleSet) {
          this.$_vueReactiveTitle_isTitleSet = false;
          setPreviousTitle();
        }
      },

      $setPageTitle(title) {
        this.$_vueReactiveTitle_isTitleSet = true;
        setTitle(title);
      },
    },
  });

  if (!router) {
    return;
  }

  const getRouteTitle = (route) => {
    const nearestRoute = route.matched.find((route) => route.meta.title);

    let title;

    if (route.meta.title) {
      title = route.meta.title;
    } else if (nearestRoute) {
      title = nearestRoute.meta.title;
    }

    return title;
  };

  router.onReady(() => {
    setTitle(getRouteTitle(router.currentRoute));

    router.afterEach((to) => {
      if (to.matched.find((route) => route.meta.inheritPageTitle)) {
        return;
      }

      setTitle(getRouteTitle(to));
    });
  });
};

export { install };

export default install;
