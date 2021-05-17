import { updateOptions } from "@/options";
import { defineGlobalProperties } from "@/title";
import mixin from "@/mixin";
import addRoutesTracking from "@/add-routes-tracking";

const install = (Vue, options = {}) => {
  updateOptions(options);
  addRoutesTracking();
  defineGlobalProperties(Vue);

  Vue.mixin(mixin);
};

export { install };

export default install;
