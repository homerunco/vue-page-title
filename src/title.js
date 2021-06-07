import { getOptions } from "@/options";
import { getNotificationsCounter } from "@/notifications";

let documentTitle;
let $page = {
  title: "",
};

export const storeOriginalDocumentTitle = () => {
  documentTitle = document.title;
};

export const defineGlobalProperties = (Vue) => {
  Vue.util.defineReactive($page, "title", "");
  Object.defineProperty(Vue.prototype, "$pageTitle", {
    get: () => $page.title,
  });
};

export const getPageTitle = (value) => {
  const { suffix, prefix, divider, maxNotificationAmount } = getOptions();
  const notificationCounter = getNotificationsCounter();
  const fallback = prefix || suffix;

  let pageTitle = documentTitle;

  if (value !== null && value === fallback) {
    pageTitle = value;
  } else if (value) {
    const suffixValue = suffix ? ` ${divider} ${suffix}` : "";
    const prefixValue = prefix ? `${prefix} ${divider} ` : "";

    pageTitle = prefixValue + value + suffixValue;
  } else if (fallback) {
    pageTitle = fallback;
  }

  if (pageTitle !== "" && notificationCounter > 0) {
    const notifications =
      notificationCounter > maxNotificationAmount
        ? `${maxNotificationAmount}+`
        : notificationCounter;

    pageTitle = `(${notifications}) ${pageTitle}`;
  }

  return pageTitle;
};

export const setTitle = (value) => {
  $page.title = value;
  document.title = getPageTitle(value);
};
