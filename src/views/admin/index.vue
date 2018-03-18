<template>
  <div>
    <mt-header
      title="管理后台"
    >
      <mt-button
        icon="back"
        slot="left"
        @click="$router.back()"
      ></mt-button>
    </mt-header>
    <div v-if="userInfo">
      <p class="tac" v-if="!userInfo.account">请先登录</p>
      <p class="tac" v-else-if="!userInfo.isAdmin">此功能仅限管理员使用</p>
      <div v-else>
        <mt-cell
          title="增加来源"
          @click.native="go('add-source')"
          is-link
        ></mt-cell>
        <mt-cell
          title="增加书籍"
          @click.native="go('add-book')"
          is-link
        ></mt-cell>
        <mt-cell
          title="更新书籍"
          @click.native="go('update-book')"
          is-link
        ></mt-cell>
        <mt-cell
          title="修改书籍"
          @click.native="go('modify-book')"
          is-link
        ></mt-cell>
      </div>
    </div>
  </div>
</template>

<script src="./admin.js">
</script>
