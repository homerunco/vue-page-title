import { setTitle } from "@/title";
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

  methods: {
    $setPageTitleNotifications(count) {
      setNotificationsCounter(count);

      if (count === 0) {
        this.$setPageTitle(this.$data.$_vuePageTitle_title);
        return;
      }

      this.$setPageTitle(this.$pageTitle);
    },

    $setPageTitle(value) {
      if (!this.$data.$_vuePageTitle_title) {
        this.$data.$_vuePageTitle_title = value;
      }

      setTitle(value);
    },
  },
};

export const registerMixin = (Vue) => {
  Vue.mixin(mixin);
};

export default mixin;
