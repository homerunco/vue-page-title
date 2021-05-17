import { setPreviousTitle, setTitle } from "@/title";
import { popHistoryItem } from "@/history";
import { setNotificationsCounter } from "@/notifications";

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
      setNotificationsCounter(count);
      setTitle(popHistoryItem());
    },

    $resetPageTitle() {
      if (this.$_vuePageTitle_isTitleSet) {
        this.$_vuePageTitle_isTitleSet = false;
        setPreviousTitle();
      }
    },

    $setPageTitle(value) {
      this.$_vuePageTitle_isTitleSet = true;
      setTitle(value);
    },
  },
};
