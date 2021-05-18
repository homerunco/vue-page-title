import { setTitle } from "@/title";
import { getLasteHistoryItem, removeHistoryItem } from "@/history";
import { setNotificationsCounter } from "@/notifications";

const mixin = {
  data() {
    return {
      $_vuePageTitle_title: null,
    };
  },

  created() {
    const { title } = this.$options;

    if (!title) {
      return;
    }

    this.$setPageTitle(
      typeof title === "function" ? title.call(this, this) : title
    );
  },

  beforeDestroy() {
    this.$resetPageTitle();
  },

  methods: {
    $updateNotificationsCounter(count) {
      setNotificationsCounter(count);
      setTitle(getLasteHistoryItem());
    },

    $resetPageTitle() {
      if (!this.$_vuePageTitle_title) {
        return;
      }

      removeHistoryItem(this.$_vuePageTitle_title);
      setTitle(getLasteHistoryItem());
      this.$_vuePageTitle_title = null;
    },

    $setPageTitle(value) {
      this.$_vuePageTitle_title = value;
      setTitle(value);
    },
  },
};

export const registerMixin = (Vue) => {
  Vue.mixin(mixin);
};

export default mixin;
