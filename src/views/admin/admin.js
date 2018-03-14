import {mapState} from 'vuex';
export default {
  data() {
    return {};
  },
  methods: {
    go(url) {
      this.$router.push(url);
    },
  },
  watch: {
    userInfo(v) {
      if (v && this.closeLoading) {
        this.closeLoading();
        this.closeLoading = null;
      }
    },
  },
  computed: {
    ...mapState({
      userInfo: ({user}) => user.info,
    }),
  },
  beforeMount() {
    if (!this.userInfo) {
      this.closeLoading = this.$loading();
    }
  },
};
