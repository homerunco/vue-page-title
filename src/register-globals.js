import { defineGlobalProperties } from "@/title";
import { registerMixin } from "@/mixin";

export default (Vue) => {
  defineGlobalProperties(Vue);
  registerMixin(Vue);
};
