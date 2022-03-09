<template>
  <div class="header-box">
    <div class="title">厦门市思明区台湾人才服务中心</div>
    <div>
      <img class="top-bar__img" :src="userInfo.avatar" />
      <el-dropdown>
        <span class="el-dropdown-link">
          欢迎, {{userInfo.user_name}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/info/index">{{$t('navbar.userinfo')}}</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>{{$t('navbar.logOut')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { resetRouter } from '@/router/router'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    logout() {
      this.$confirm(this.$t('logoutTip'), this.$t('tip'), {
        confirmButtonText: this.$t('submitText'),
        cancelButtonText: this.$t('cancelText'),
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          resetRouter()
          this.$router.push({ path: '/login' })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header-box {
  position: relative;
  z-index: 1026;
  height: 80px;
  line-height: 80px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  white-space: nowrap;
  color: #fff;
  background: url('~@/assets/imgs/header_bg.png') no-repeat;
  background-size: 100%;
}

.title {
  font-size: 30px;
  font-weight: bold;
}

.el-dropdown-link {
  color: #fff;
}
</style>
