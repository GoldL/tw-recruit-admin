<template>
  <div class="bread-crumb">
    <div class="bread-crumb-center">
      <div v-for="(item, index) in breakCrumb" :key="index">
        <router-link :to="item.path" v-if="item.path" class="link">
          {{ item.name }}
          <span class="m-lr-6">/</span>
        </router-link>
        <span class="primary-color" v-else>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    breakCrumb: { type: Array, default: () => [] }
  }
}
</script>

<style lang="scss" scoped>
.bread-crumb {
  position: sticky;
  left: 0;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 6px 10px 6px;
  font-size: 14px;
  border-radius: 4px;
  background: #f0f2f5;
  .bread-crumb-center {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin: 0 auto;
    background-color: #fff;
  }
  .m-lr-6 {
    margin: 0 6px;
  }
  .link {
    color: $text-color-secondary;
    &:hover {
      color: $primary-color;
    }
  }
}
</style>
