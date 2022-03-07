<template>
  <basic-container>
    <div class="page-title">主管单位</div>
    <avue-form :option="option" v-model="form" @submit="submit" :upload-after="uploadAfter">
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
      <template slot="content">
        <div v-if="option.detail" v-html="form.content"></div>
        <tinymce-editor v-else id="editor1" :obj="form" keyName="content" height="400px"></tinymce-editor>
      </template>
    </avue-form>
  </basic-container>
</template>

<script>
import { orgDetailUrl, orgSaveUrl, uploadUrl } from '@/api'
import TinymceEditor from '@/components/Tinymce/Tinymce'

export default {
  components: { TinymceEditor },
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
            label: '主管单位',
            icon: 'el-icon-collection',
            prop: 'detail',
            collapse: true,
            column: [
              { label: '名称', prop: 'title', span: 24, rules: [{ required: true, message: '请填写名称', trigger: 'blur' }] },
              {
                label: '视频介绍',
                prop: 'videoLink',
                span: 24,
                type: 'upload',
                listType: 'picture-img',
                accept: 'video/mp4',
                propsHttp: { res: 'data', name: 'fileName', url: 'link' },
                tip: '请上传mp4格式的视频介绍',
                action: uploadUrl,
                rules: [{ required: true, message: '请上传视频介绍', trigger: 'blur' }]
              },
              {
                label: '简介',
                prop: 'content',
                span: 24,
                formslot: true,
                rules: [{ required: true, message: '请填写简介', trigger: 'blur' }]
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    async loadDetail() {
      const { data } = await this.$get(orgDetailUrl)
      data.videoLink = data.video.link
      data.video = data.video.id
      this.form = data
    },
    async submit(form, done) {
      try {
        const { msg } = await this.$post(orgSaveUrl, form)
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
    },
    uploadAfter(res, done) {
      this.form.video = res.id
      done()
    }
  },
  created() {
    this.loadDetail()
  }
}
</script>
