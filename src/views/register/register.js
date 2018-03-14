import {mapActions} from 'vuex';

export default {
  data() {
    return {
      account: '',
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions(['userRegister']),
    async submit() {
      const {account, email, password, submitting} = this;
      if (submitting) {
        return;
      }
      if (!account || !email || !password) {
        this.$toast('必填字段不能为空');
        return;
      }
      const close = this.$loading();
      this.submitting = true;
      try {
        await this.userRegister({
          account,
          password,
          email,
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
