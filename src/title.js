import { getOptions } from "@/options";
import { getNotificationsCounter } from "@/notifications";
import { addHistoryItem } from "@/history";

let documentTitle;
let $page = {
  title: "",
};

export const storeOriginalDocumentTitle = () => {
  documentTitle = document.title;
};

export const defineGlobalProperties = (Vue) => {
  Object.defineProperty(Vue.prototype, "$title", {
    get: () => $page.title,
  });
};

export const getPageTitle = (value) => {
  const { suffix, prefix, divider } = getOptions();
  const notifications = getNotificationsCounter();
  const fallbackTitle = prefix || suffix;

  let pageTitle = documentTitle;

  if (value) {
    const suffixValue = suffix ? ` ${divider} ${suffix}` : "";
    const prefixValue = prefix ? `${prefix} ${divider} ` : "";

    pageTitle = prefixValue + value + suffixValue;
  } else if (fallbackTitle) {
    pageTitle = fallbackTitle;
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
