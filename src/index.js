import { updateOptions } from "@/options";
import { setTitle, storeOriginalDocumentTitle } from "@/title";
import addRoutesTracking from "@/add-routes-tracking";
import registerGlobals from "@/register-globals";

const install = (Vue, options = {}) => {
  storeOriginalDocumentTitle();
  updateOptions(options);
  registerGlobals(Vue);

  if (options.router) {
    addRoutesTracking(options.router);
    return;
  }

  setTitle();
};

export { install };

export default install;
