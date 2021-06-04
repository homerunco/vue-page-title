import { updateOptions } from "@/options";
import { setTitle, storeOriginalDocumentTitle } from "@/title";
import registerGlobals from "@/register-globals";

const install = (Vue, options = {}) => {
  storeOriginalDocumentTitle();
  updateOptions(options);
  registerGlobals(Vue);
  setTitle();
};

export { install };

export default install;
