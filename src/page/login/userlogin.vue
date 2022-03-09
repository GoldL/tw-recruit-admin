<template>
  <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
    <el-form-item prop="username">
      <el-input @keyup.enter.native="handleLogin" v-model="loginForm.username" auto-complete="off" :placeholder="$t('login.username')">
        <i slot="prefix" class="icon-yonghu icon" />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        @keyup.enter.native="handleLogin"
        :type="passwordType"
        v-model="loginForm.password"
        auto-complete="off"
        :placeholder="$t('login.password')"
      >
        <i slot="prefix" class="icon-mima icon" />
      </el-input>
    </el-form-item>
    <el-form-item v-if="this.website.captchaMode" prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input @keyup.enter.native="handleLogin" v-model="loginForm.code" auto-complete="off" :placeholder="$t('login.code')"></el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img :src="loginForm.image" class="login-code-img" @click="refreshCode" />
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="login-submit" round @click.native.prevent="handleLogin">{{$t('login.submit')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { info } from '@/api/system/tenant'
import { getCaptcha } from '@/api/user'
import { getTopUrl } from '@/util/util'
import website from '@/config/website'

export default {
  name: 'userlogin',
  data() {
    return {
      tenantMode: this.website.tenantMode,
      loginForm: {
        // 租户ID
        tenantId: '000000',
        // 部门ID
        deptId: '',
        // 角色ID
        roleId: '',
        // 用户名
        username: 'admin',
        // 密码
        password: 'admin',
        // 账号类型
        type: 'account',
        // 验证码的值
        code: '',
        // 验证码的索引
        key: '',
        // 预加载白色背景
        image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      },
      loginRules: {
        tenantId: [{ required: false, message: '请输入租户ID', trigger: 'blur' }],
        username: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      passwordType: 'password',
      userBox: false,
      userForm: {
        deptId: '',
        roleId: ''
      },
      userOption: {
        labelWidth: 70,
        submitBtn: true,
        emptyBtn: false,
        submitText: '登录',
        column: [
          {
            label: '部门',
            prop: 'deptId',
            type: 'select',
            props: {
              label: 'deptName',
              value: 'id'
            },
            dicUrl: '/tw-recruit-api/blade-system/dept/select',
            span: 24,
            display: false,
            rules: [
              {
                required: true,
                message: '请选择部门',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '角色',
            prop: 'roleId',
            type: 'select',
            props: {
              label: 'roleName',
              value: 'id'
            },
            dicUrl: '/tw-recruit-api/blade-system/role/select',
            span: 24,
            display: false,
            rules: [
              {
                required: true,
                message: '请选择角色',
                trigger: 'blur'
              }
            ]
          }
        ]
      }
    }
  },
  created() {
    this.getTenant()
    this.refreshCode()
  },
  mounted() {},
  watch: {
    'loginForm.deptId'() {
      const column = this.findObject(this.userOption.column, 'deptId')
      if (this.loginForm.deptId.includes(',')) {
        column.dicUrl = `/tw-recruit-api/blade-system/dept/select?deptId=${this.loginForm.deptId}`
        column.display = true
      } else {
        column.dicUrl = ''
      }
    },
    'loginForm.roleId'() {
      const column = this.findObject(this.userOption.column, 'roleId')
      if (this.loginForm.roleId.includes(',')) {
        column.dicUrl = `/tw-recruit-api/blade-system/role/select?roleId=${this.loginForm.roleId}`
        column.display = true
      } else {
        column.dicUrl = ''
      }
    }
  },
  computed: {
    ...mapGetters(['tagWel', 'userInfo'])
  },
  props: [],
  methods: {
    refreshCode() {
      if (this.website.captchaMode) {
        getCaptcha().then(res => {
          const data = res.data
          this.loginForm.key = data.key
          this.loginForm.image = data.image
        })
      }
    },
    showPassword() {
      this.passwordType === '' ? (this.passwordType = 'password') : (this.passwordType = '')
    },
    submitLogin(form, done) {
      if (form.deptId !== '') {
        this.loginForm.deptId = form.deptId
      }
      if (form.roleId !== '') {
        this.loginForm.roleId = form.roleId
      }
      this.handleLogin()
      done()
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '登录中,请稍后。。。',
            spinner: 'el-icon-loading'
          })
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(async () => {
              if (this.website.switchMode) {
                const deptId = this.userInfo.dept_id
                const roleId = this.userInfo.role_id
                if (deptId.includes(',') || roleId.includes(',')) {
                  this.loginForm.deptId = deptId
                  this.loginForm.roleId = roleId
                  this.userBox = true
                  this.$store.dispatch('LogOut').then(() => {
                    loading.close()
                  })
                  return false
                }
              }
              // 登录权限第一个
              loading.close()
              const data = await this.$store.dispatch('GetMenu')
              if (!data.length) {
                this.$router.push({ path: this.tagWel.value })
                return
              }
              this.$router.$avueRouter.formatRoutes(data, true)
              const label = data[0].children && data[0].children.length ? data[0].children[0].name : data[0].name
              const path = data[0].children && data[0].children.length ? data[0].children[0].path : data[0].path
              website.fistPage.label = label
              website.fistPage.value = path
              this.$router.push({ path })
              loading.close()
            })
            .catch(() => {
              loading.close()
              this.refreshCode()
            })
        }
      })
    },
    getTenant() {
      const domain = getTopUrl()
      // 临时指定域名，方便测试
      // domain = "https://bladex.vip";
      info(domain).then(res => {
        const data = res.data
        if (data.success && data.data.tenantId) {
          this.tenantMode = false
          this.loginForm.tenantId = data.data.tenantId
          this.$parent.$refs.login.style.backgroundImage = `url(${data.data.backgroundUrl})`
        }
      })
    }
  }
}
</script>
