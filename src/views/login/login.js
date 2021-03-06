import {mapActions} from 'vuex';

export default {
  data() {
    return {
      account: '',
      password: '',
    };
  },
  methods: {
    ...mapActions(['userLogin']),
    async submit() {
      const {account, password, submitting} = this;
      if (submitting) {
        return;
      }
      if (!account || !password) {
        this.$toast('必填字段不能为空');
        return;
      }
      const close = this.$loading();
      this.submitting = true;
      try {
        await this.userLogin({
          account,
          password,
        });
        this.$router.back();
      } catch (err) {
        this.$toast(err);
      } finally {
        this.submitting = false;
        close();
      }
    },
  },
};
