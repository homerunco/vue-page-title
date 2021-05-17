import { getOptions } from "@/options";
import { getNotificationsCount } from "@/notifications";
import * as history from "@/history";

let $page = {
  title: "",
};

export const defineTitleProperty = (Vue) => {
  Object.defineProperty(Vue.prototype, "$title", {
    get: () => $page.title,
  });
};

export const getPageTitle = (title) => {
  const { title: appName, divider } = getOptions();
  const notificationsCount = getNotificationsCount();

  let pageTitle = document.title;

  if (title) {
    pageTitle = title + (appName ? ` ${divider} ${appName}` : "");
  } else if (appName) {
    pageTitle = appName;
  }

  if (notificationsCount > 0) {
    pageTitle = `(${notificationsCount}) ${pageTitle}`;
  }

  return pageTitle;
};

export const setTitle = (value) => {
  const pageTitle = getPageTitle(value);

  // add to history array
  history.add(value);

  // update global computed property
  $page.title = value;

  // update HTML tag
  document.title = pageTitle;
};

export const setPreviousTitle = () => {
  history.pop();
  setTitle(history.pop());
};
