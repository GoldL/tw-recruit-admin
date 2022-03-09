
<template>
  <basic-container>
    <div class="page-title">咨询管理</div>
    <avue-crud
      ref="crud"
      :data="data"
      v-model="form"
      :option="option"
      :page.sync="page"
      :table-loading="loading"
      @on-load="onLoad"
      @row-del="rowDel"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @size-change="sizeChange"
      @search-reset="searchReset"
      @search-change="searchChange"
      @current-change="currentChange"
      @refresh-change="refreshChange"
      @selection-change="selectionChange"
      :upload-after="uploadAfter"
    >
      <template slot="menuLeft">
        <el-button type="danger" icon="el-icon-delete" size="small" @click="rowMulDel">批量删除</el-button>
      </template>
      <template slot-scope="{type}" slot="contentForm">
        <div v-if="type === 'view'" v-html="form.content"></div>
        <tinymce-editor v-else id="editor1" :obj="form" keyName="content" height="400px"></tinymce-editor>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { informationPageUrl, informationSaveUrl, informationDelUrl, dictUrl, uploadUrl } from '@/api'
import TinymceEditor from '@/components/Tinymce/Tinymce'

export default {
  components: { TinymceEditor },
  data() {
    return {
      form: {},
      data: [],
      query: {},
      loading: false,
      selectionList: [],
      page: { pageSize: 10, currentPage: 1, total: 0 },
      option: {
        align: 'center',
        calcHeight: 30,
        searchShow: true,
        searchMenuSpan: 4,
        index: true,
        columnBtn: false,
        dialogClickModal: false,
        refreshBtn: false,
        viewBtn: true,
        selection: true,
        tip: false,
        column: [
          { label: '标题', prop: 'title', span: 24, search: true, rules: [{ required: true, message: '请输入标题', trigger: 'blur' }] },
          {
            label: '咨询类型',
            prop: 'informationTypeCode',
            span: 24,
            search: true,
            type: 'select',
            props: { label: 'dictValue', value: 'dictKey' },
            dicData: [],
            rules: [{ required: true, message: '请选择咨询类型', trigger: 'blur' }]
          },
          {
            label: '序号',
            prop: 'orderNo',
            span: 24,
            type: 'number',
            precision: 0,
            rules: [{ required: true, message: '请输入序号', trigger: 'blur' }]
          },
          {
            label: '图片',
            prop: 'imgLink',
            span: 24,
            type: 'upload',
            listType: 'picture-img',
            dataType: 'string',
            propsHttp: { res: 'data', name: 'fileName', url: 'link' },
            canvasOption: { ratio: 0.5, text: ' ' },
            accept: 'image/*',
            tip: '请上传 宽度200px 高度110px 的 jepg/png/gif/bmp 图片',
            action: uploadUrl,
            rules: [{ required: true, message: '请上传图片', trigger: 'blur' }]
          },
          {
            label: '内容',
            prop: 'content',
            span: 24,
            hide: true,
            formslot: true,
            rules: [{ required: true, message: '请填写内容', trigger: 'blur' }]
          }
        ]
      }
    }
  },
  computed: {
    ids() {
      return this.selectionList.map(s => s.id).join(',')
    }
  },
  methods: {
    async loadInformationType() {
      const url = `${dictUrl}PORTAL_INFORMATION_TYPE`
      const { data } = await this.$get(url)
      if (data && data.length && data[0].children && data[0].children.length) {
        const networkDom = this.findObject(this.option.column, 'informationTypeCode')
        networkDom.dicData = data[0].children
      }
    },
    async onLoad(page, params = {}) {
      const values = { ...params }
      this.loading = true
      const paramsReq = Object.assign(values, this.query, {
        current: page.currentPage,
        size: page.pageSize
      })
      const { data } = await this.$post(informationPageUrl, paramsReq)
      data.records.forEach(item => {
        item.informationTypeCode = item.informationTypeCode.dictKey
        item.imgLink = item.img.link
        item.img = item.img.id
      })
      this.data = data.records
      this.page.total = data.total
      this.selectionClear()
      this.loading = false
    },
    async rowSave(row, loading, done) {
      try {
        await this.$post(informationSaveUrl, row)
        loading()
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      } catch (e) {
        done()
      }
    },
    async rowUpdate(row, index, loading, done) {
      try {
        await this.$post(informationSaveUrl, row)
        loading()
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      } catch (e) {
        done()
      }
    },
    rowDel({ id, title }) {
      this.$confirm(`确定删除<${title}>的咨询?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$post(informationDelUrl, { ids: id }, false)
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      })
    },
    rowMulDel() {
      if (!this.ids) {
        this.$message.warning('至少选中一条数据')
        return
      }
      this.$confirm('确定删除选中的咨询?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$post(informationDelUrl, { ids: this.ids }, false)
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      })
    },
    uploadAfter(res, done) {
      this.form.img = res.id
      done()
    },
    searchReset() {
      this.query = {}
      this.onLoad(this.page)
    },
    searchChange(params, done) {
      this.query = params
      this.page.currentPage = 1
      this.onLoad(this.page, params)
      done()
    },
    selectionChange(list) {
      this.selectionList = list
    },
    selectionClear() {
      this.selectionList = []
      this.$refs.crud.toggleSelection()
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    refreshChange() {
      this.onLoad(this.page, this.query)
    }
  },
  created() {
    this.loadInformationType()
  }
}
</script>
