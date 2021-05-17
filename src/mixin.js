import { setTitle, setPreviousTitle } from "@/title";
import * as history from "@/history";
import { setNotificationsCount } from "@/notifications";

export default {
  data() {
    return {
      $_vuePageTitle_isTitleSet: false,
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
      setNotificationsCount(count);
      setTitle(history.pop());
    },

    $resetPageTitle() {
      if (this.$_vuePageTitle_isTitleSet) {
        this.$_vuePageTitle_isTitleSet = false;
        setPreviousTitle();
      }
    },

    $setPageTitle(title) {
      this.$_vuePageTitle_isTitleSet = true;
      setTitle(title);
    },
  },
};
