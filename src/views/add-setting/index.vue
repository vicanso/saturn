<template>
  <div class="fullHeightScroll">
    <mt-header
      title="增加配置"
    >
      <mt-button
        icon="back"
        slot="left"
        @click="$router.back()"
      ></mt-button>
    </mt-header>
    <mt-field
      class="fieldItem"
      label="名称"
      v-model="name"
    ></mt-field>
    <mt-field
      class="fieldItem"
      label="是否禁用"
    >
      <mt-switch
        v-model="disabled"
      ></mt-switch>
    </mt-field>
    <mt-field
      class="fieldItem"
      label="配置"
      v-model="data"
      type="textarea"
      rows="6"
    ></mt-field>
    <mt-field
      class="fieldItem"
      label="描述"
      v-model="description"
      type="textarea"
      rows="4"
    ></mt-field>
    <mt-button
      type="primary"
      size="large"
      :style="{
        marginTop: '30px',
      }"
      @click="submit"
    >提交</mt-button>
  </div>
</template>

<script src="./add-setting.js"></script>

<style lang="sass" scoped>
@import '../../variables';
.fieldItem
  border-bottom: $GRAY_BORDER
</style>
