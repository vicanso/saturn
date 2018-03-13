import { mapActions } from 'vuex';

export default {
  data() {
    return {
      account: '',
      password: '',
    };
  },
  methods: {
    ...mapActions([
      'userLogin',
    ]),
    goBack() {
      this.$router.back();
    },
    async submit() {
      const {
        account,
        password,
      } = this;
      if (!account || !password) {
        this.$toast('必填字段不能为空');
        return;
      }
      const close = this.$loading();
      try {
        await this.userLogin({
          account,
          password,
        });
        this.goBack();
      } catch (err) {
        this.$toast(err);
      } finally {
        close();
      }
    },
  },
};
