<template>
  <div class="fullHeightScroll">
    <mt-header
      title="更新书籍"
    >
      <mt-button
        icon="back"
        slot="left"
        @click="$router.back()"
      ></mt-button>
    </mt-header>
    <div v-if="items">
      <mt-cell
        v-for="item in items"
        :title="item.key"
        :key="item.key"
        :value="item.updatedAt"
        @click.native="update(item)"
      ></mt-cell>
    </div>
  </div>
</template>
<script src="./update-book.js">
</script>
