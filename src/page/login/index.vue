<template>
  <div class="login-container" ref="login" @keyup.enter="handleLogin">
    <div class="login-main">
      <div class="title">厦门市思明区台湾人才服务中心</div>
      <div class="login-content">
        <div class="login-title">帐号登录</div>
        <userLogin></userLogin>
      </div>
    </div>
  </div>
</template>
<script>
import userLogin from './userlogin'
import { mapGetters } from 'vuex'
import { dateFormat } from '@/util/date'
import { validatenull } from '@/util/validate'
import { getQueryString, getTopUrl } from '@/util/util'

export default {
  name: 'login',
  components: {
    userLogin
  },
  data() {
    return {
      time: '',
      activeName: 'user',
      socialForm: {
        tenantId: '000000',
        source: '',
        code: '',
        state: ''
      }
    }
  },
  watch: {
    $route() {
      this.handleLogin()
    }
  },
  created() {
    this.handleLogin()
    this.getTime()
  },
  mounted() {},
  computed: {
    ...mapGetters(['website', 'tagWel'])
  },
  props: [],
  methods: {
    getTime() {
      setInterval(() => {
        this.time = dateFormat(new Date())
      }, 1000)
    },
    handleLogin() {
      const topUrl = getTopUrl()
      const redirectUrl = '/oauth/redirect/'
      this.socialForm.source = getQueryString('source')
      this.socialForm.code = getQueryString('code')
      this.socialForm.state = getQueryString('state')
      if (validatenull(this.socialForm.source) && topUrl.includes(redirectUrl)) {
        let source = topUrl.split('?')[0]
        source = source.split(redirectUrl)[1]
        this.socialForm.source = source
      }
      if (!validatenull(this.socialForm.source) && !validatenull(this.socialForm.code) && !validatenull(this.socialForm.state)) {
        const loading = this.$loading({
          lock: true,
          text: '第三方系统登录中,请稍后。。。',
          spinner: 'el-icon-loading'
        })
        this.$store
          .dispatch('LoginBySocial', this.socialForm)
          .then(() => {
            window.location.href = topUrl.split(redirectUrl)[0]
            this.$router.push({ path: this.tagWel.value })
            loading.close()
          })
          .catch(() => {
            loading.close()
          })
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/login.scss';
</style>
