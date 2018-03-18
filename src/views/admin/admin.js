import {mapState} from 'vuex';
export default {
  data() {
    return {};
  },
  methods: {
    go(name) {
      this.$router.push({
        name,
      });
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
