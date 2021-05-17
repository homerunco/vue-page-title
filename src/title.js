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
  const { suffix, divider } = getOptions();
  const notifications = getNotificationsCounter();

  let pageTitle = document.title;

  if (value) {
    pageTitle = value + (suffix ? ` ${divider} ${suffix}` : "");
  } else if (suffix) {
    pageTitle = suffix;
  }

  if (notifications > 0) {
    pageTitle = `(${notifications}) ${pageTitle}`;
  }

  return pageTitle;
};

export const setTitle = (value) => {
  $page.title = value;

  addHistoryItem(value);

  document.title = getPageTitle(value);
};

export const setPreviousTitle = () => {
  popHistoryItem();
  setTitle(popHistoryItem());
};
