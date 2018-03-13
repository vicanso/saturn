<template>
  <div>
    <mt-header
      title="登录"
    >
      <mt-button
        icon="back"
        slot="left"
        @click="goBack"
      ></mt-button>
    </mt-header>
    <mt-field
      label="用户名"
      class="formItem"
      placeholder="请输入用户名"
      v-model="account"
    ></mt-field>
    <mt-field
      label="密码"
      class="formItem"
      placeholder="请输入密码"
      type="password"
      v-model="password"
    >
    </mt-field>
    <mt-button
      type="primary"
      size="large"
      class="formSubmit"
      @click="submit"
    >提交</mt-button>
  </div>
</template>

<script src="./login.js"></script>
<style lang="sass" src="./login.sass" scoped></style>

