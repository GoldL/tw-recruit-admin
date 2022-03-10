<template>
  <basic-container>
    <div class="page-title">联系我们</div>
    <avue-form :option="option" v-model="form" @submit="submit">
      <template slot="detailHeader" slot-scope="{column}">
        <div class="rdx-flex-1 rdx-flex rdx-row-between">
          <div class="avue-group__title">
            <i :class="column.icon"></i>
            {{column.label}}
          </div>
          <el-button
            type="primary"
            size="mini"
            :icon="option.detail ? 'el-icon-edit' : 'el-icon-circle-close'"
            class="rdx-m-r-20"
            @click.stop="handleEdit"
          >{{option.detail ? '编辑' : '取消'}}</el-button>
        </div>
      </template>
    </avue-form>
  </basic-container>
</template>

<script>
import { contactUsDetailUrl, contactUsSaveUrl } from '@/api'

export default {
  data() {
    return {
      showForm: false,
      form: {},
      registerTypeList: [],
      option: {
        detail: true,
        menuBtn: false,
        labelWidth: 120,
        submitText: '保 存',
        menuPosition: 'center',
        group: [
          {
            accordion: false,
            label: '联系我们',
            icon: 'el-icon-collection',
            prop: 'detail',
            collapse: true,
            column: [
              { label: '联系方式', prop: 'contact', span: 24, rules: [{ required: true, message: '请填写联系方式', trigger: 'blur' }] },
              {
                label: '工作时间',
                prop: 'workTime',
                span: 24,
                type: 'textarea',
                rules: [{ required: true, message: '请填写工作时间', trigger: 'blur' }]
              },
              {
                label: '联系地址',
                prop: 'address',
                span: 24,
                type: 'textarea',
                rules: [{ required: true, message: '请填写联系地址', trigger: 'blur' }]
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    async loadDetail() {
      const { data } = await this.$get(contactUsDetailUrl)
      this.form = data
    },
    async submit(form, done) {
      try {
        const { msg } = await this.$post(contactUsSaveUrl, form)
        this.handleEdit()
        this.loadDetail()
        this.$message.success(msg)
        done()
      } catch (e) {
        console.log(e)
        done()
      }
    },
    handleEdit() {
      this.showForm = !this.showForm
      this.option.detail = !this.option.detail
      this.option.menuBtn = !this.option.menuBtn
    }
  },
  created() {
    this.loadDetail()
  }
}
</script>
