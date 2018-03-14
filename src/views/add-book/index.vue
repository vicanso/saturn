<template>
  <div>
    <mt-header
      title="增加书籍"
    >
      <mt-button
        icon="back"
        slot="left"
        @click="$router.back()"
      ></mt-button>
    </mt-header>
    <mt-field
      label="名称"
      class="mtop10"
      placeholder="请输入名称"
      v-model="name"
    ></mt-field>
    <mt-field
      label="作者"
      class="mtop10"
      placeholder="请输入作者"
      v-model="author"
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
  
<script src="./add-book.js">
</script>
