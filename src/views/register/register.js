import { mapActions } from 'vuex';

export default {
  data() {
    return {
      account: '',
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions([
      'userRegister',
    ]),
    goBack() {
      this.$router.back();
    },
    async submit() {
      const {
        account,
        email,
        password,
      } = this;
      if (!account || !email || !password) {
        this.$toast('必填字段不能为空');
        return;
      }
      const close = this.$loading();
      try {
        await this.userRegister({
          account,
          password,
          email,
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
