import { updateOptions } from "@/options";
import { defineTitleProperty } from "@/title";
import mixin from "@/mixin";
import addRoutesTracking from "@/add-routes-tracking";

const install = (Vue, options = {}) => {
  updateOptions(options);
  addRoutesTracking();
  defineTitleProperty(Vue);

  Vue.mixin(mixin);
};

export { install };

export default install;
