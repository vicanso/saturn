<template lang="pug">
div
  mt-header(
    title="登录"
  )
    mt-button(
      icon="back"
      slot="left"
      @click="$router.back()" 
    )
  mt-field(
    label="用户名"
    class="mbottom10"
    placeholder="请输入用户名"
    v-model="account"
  )
  mt-field(
    label="密码"
    class="mbottom10"
    placeholder="请输入密码"
    type="password"
    v-model="password"
  )
  mt-button(
    type="primary"
    size="large"
    :style="{marginTop: '30px'}"
    @click="submit"
  ) 提交
</template>

<script src="./login.js">
</script>
