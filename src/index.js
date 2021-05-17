import { updateOptions } from "@/options";
import { setTitle } from "@/title";
import addRoutesTracking from "@/add-routes-tracking";
import registerGlobals from "@/register-globals";

const install = (Vue, options = {}) => {
  updateOptions(options);
  registerGlobals(Vue);
  addRoutesTracking();

  setTitle();
};

export { install };

export default install;
