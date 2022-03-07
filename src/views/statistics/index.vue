<template>
  <basic-container>
    <div class="page-title">招聘会统计</div>
    <el-tabs v-model="tabActive">
      <el-tab-pane label="线上招聘会" name="online">
        <Online />
      </el-tab-pane>
      <el-tab-pane label="线下招聘会" name="offline">
        <Offline />
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import Online from './components/Online'
import Offline from './components/Offline'

export default {
  components: { Online, Offline },
  data() {
    return {
      tabActive: 'online'
    }
  }
}
</script>
