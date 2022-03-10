
<template>
  <basic-container>
    <div class="page-title">友情链接</div>
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
    >
      <template slot="menuLeft">
        <el-button type="danger" icon="el-icon-delete" size="small" plain @click="rowMulDel">批量删除</el-button>
      </template>
      <template slot="url" slot-scope="{row}">
        <el-link type="primary" @click="handleLink(row.url)">{{row.url}}</el-link>
      </template>
      <template slot-scope="{type}" slot="urlForm">
        <el-link v-if="type === 'view'" type="primary" @click="handleLink(form.url)">{{form.url}}</el-link>
        <el-input v-else v-model="form.url"></el-input>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { linkPageUrl, linkSaveUrl, linkDelUrl } from '@/api'

export default {
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
          { label: '链接名称', prop: 'title', span: 24, search: true, rules: [{ required: true, message: '请输入标题', trigger: 'blur' }] },
          {
            label: '链接地址',
            prop: 'url',
            span: 24,
            slot: true,
            formslot: true,
            rules: [{ required: true, message: '请输入链接地址', trigger: 'blur' }]
          },
          {
            label: '序号',
            prop: 'orderNo',
            span: 24,
            type: 'number',
            precision: 0,
            rules: [{ required: true, message: '请输入序号', trigger: 'blur' }]
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
        size: page.pageSize
      })
      const { data } = await this.$post(linkPageUrl, paramsReq, false)
      this.data = data
      this.selectionClear()
      this.loading = false
    },
    async rowSave(row, loading, done) {
      try {
        await this.$post(linkSaveUrl, row)
        loading()
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      } catch (e) {
        done()
      }
    },
    async rowUpdate(row, index, loading, done) {
      try {
        await this.$post(linkSaveUrl, row)
        loading()
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      } catch (e) {
        done()
      }
    },
    rowDel({ id, title }) {
      this.$confirm(`确定删除<${title}>的友情链接?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$post(linkDelUrl, { ids: id }, false)
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      })
    },
    rowMulDel() {
      if (!this.ids) {
        this.$message.warning('至少选中一条数据')
        return
      }
      this.$confirm('确定删除选中的友情链接?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$post(linkDelUrl, { ids: this.ids }, false)
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
      })
    },
    handleLink(url) {
      window.open(url)
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
