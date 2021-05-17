import { getOptions } from "@/options";
import { setTitle } from "@/title";

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

export default () => {
  const { router } = getOptions();

  if (!router) {
    return;
  }

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
