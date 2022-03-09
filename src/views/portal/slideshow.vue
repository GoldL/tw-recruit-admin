
<template>
  <basic-container>
    <div class="page-title">轮播图管理</div>
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
        <el-radio-group v-model="deviceType" size="small" @change="searchReset">
          <el-radio-button v-for="(name, label) in  deviceTypeObj" :key="label" :label="label">{{name}}</el-radio-button>
        </el-radio-group>
      </template>

      <template slot="menuRight">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="$refs.crud.rowAdd()">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" plain @click="rowMulDel">批量删除</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { slideshowPageUrl, slideshowSaveUrl, slideshowDelUrl, uploadUrl } from '@/api'

export default {
  data() {
    return {
      deviceType: 1,
      deviceTypeObj: { 1: 'PC端', 2: '移动端' },
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
        addBtn: false,
        viewBtn: true,
        selection: true,
        tip: false,
        column: [
          { label: '标题', prop: 'title', span: 24, search: true, rules: [{ required: true, message: '请输入标题', trigger: 'blur' }] },
          {
            label: '设备类型',
            prop: 'deviceType',
            span: 24,
            type: 'select',
            dicData: [
              { label: 'PC端', value: 1 },
              { label: '移动端', value: 2 }
            ],
            rules: [{ required: true, message: '请选择设备类型', trigger: 'blur' }]
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
            label: '轮播图',
            prop: 'imgLink',
            span: 24,
            type: 'upload',
            listType: 'picture-img',
            dataType: 'string',
            propsHttp: { res: 'data', name: 'fileName', url: 'link' },
            canvasOption: { ratio: 0.5, text: ' ' },
            accept: 'image/*',
            tip: '请上传 宽度200px 高度110px 的 jepg/png/gif/bmp 轮播图',
            action: uploadUrl,
            rules: [{ required: true, message: '请上传轮播图', trigger: 'blur' }]
          },
          { label: '备注', prop: 'remark', span: 24, type: 'textarea' }
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
    async onLoad(page, params = {}) {
      const values = { ...params }
      this.loading = true
      const paramsReq = Object.assign(values, this.query, {
        current: page.currentPage,
        size: page.pageSize,
        deviceType: this.deviceType
      })
      const { data } = await this.$post(slideshowPageUrl, paramsReq)
      data.records.forEach(item => {
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
        await this.$post(slideshowSaveUrl, row)
        loading()
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      } catch (e) {
        done()
      }
    },
    async rowUpdate(row, index, loading, done) {
      try {
        await this.$post(slideshowSaveUrl, row)
        loading()
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      } catch (e) {
        done()
      }
    },
    rowDel({ id, title }) {
      this.$confirm(`确定删除<${title}>的轮播图?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$post(slideshowDelUrl, { ids: id }, false)
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      })
    },
    rowMulDel() {
      if (!this.ids) {
        this.$message.warning('至少选中一条数据')
        return
      }
      this.$confirm('确定删除选中的轮播图?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$post(slideshowDelUrl, { ids: this.ids }, false)
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
  }
}
</script>
