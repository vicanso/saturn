import request from 'axios';

import {
  SETTINGS,
} from '../../urls';

export default {
  data() {
    return {
      name: '',
      data: null,
      disabled: false,
      description: '', 
    };
  },
  methods: {
    async submit() {
      const {
        name,
        data,
        disabled,
        description,
      } = this;
      if (!name || !data || !description) {
        this.$toast('请将配置填写完整');
        return;
      }
      const close = this.$loading();
      try {
        await request.post(SETTINGS, {
          name,
          disabled,
          data: JSON.parse(data),
          description,
        });
      } catch (err) {
        this.$toast(err);
      } finally {
        close();
      }
    },
  },
};
