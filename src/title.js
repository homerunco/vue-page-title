import { getOptions } from "@/options";
import { getNotificationsCounter } from "@/notifications";
import { popHistoryItem, addHistoryItem } from "@/history";

let $page = {
  title: "",
};

export const defineGlobalProperties = (Vue) => {
  Object.defineProperty(Vue.prototype, "$title", {
    get: () => $page.title,
  });
};

export const getPageTitle = (value) => {
  const { appName, divider } = getOptions();
  const notifications = getNotificationsCounter();

  let pageTitle = document.title;

  if (value) {
    pageTitle = value + (appName ? ` ${divider} ${appName}` : "");
  } else if (appName) {
    pageTitle = appName;
  }

  if (notifications > 0) {
    pageTitle = `(${notifications}) ${pageTitle}`;
  }

  return pageTitle;
};

export const setTitle = (value) => {
  const pageTitle = getPageTitle(value);

  // add to history array
  addHistoryItem(value);

  // update global computed property
  $page.title = value;

  // update HTML tag
  document.title = pageTitle;
};

export const setPreviousTitle = () => {
  popHistoryItem();
  setTitle(popHistoryItem());
};
