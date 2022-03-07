<template>
  <basic-container>
    <div class="page-title">招聘会管理</div>
    <avue-crud
      :data="data"
      :page.sync="page"
      :table-loading="loading"
      :option="option"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-radio-group v-model="conductStatus" @change="refreshChange">
          <el-radio-button v-for="(value, key) in conductStatusObj" :key="key" :label="key">
            <el-badge :hidden="!['2', '3', '4'].includes(key) && !todoNumOjb[key]" :value="todoNumOjb[key]" :max="99">{{ value }}</el-badge>
          </el-radio-button>
        </el-radio-group>
        <div class="search-box">
          <el-input v-model="searchValue" placeholder="输入搜索关键字" @input="refreshChange" suffix-icon="el-icon-search"></el-input>
        </div>
      </template>
      <template slot="menu" slot-scope="{ row, type, size }">
        <el-button :size="size" :type="type" @click="handleDetail(row)">查看</el-button>
        <el-button v-if="row.conductStatus !== '6'" :size="size" :type="type" @click="handleEdit(row)">编辑</el-button>
        <el-button v-if="['1'].includes(row.conductStatus)" :type="type" :size="size" @click="handlePublish(row)">发布</el-button>
        <el-button v-if="['2', '3'].includes(row.conductStatus)" :size="size" :type="type" @click="handleCancel(row)">撤销</el-button>
        <el-button v-if="['2,4', '4', '5'].includes(row.conductStatus)" :size="size" :type="type" @click="handleOff(row)">下线</el-button>
        <el-button v-if="['6'].includes(row.conductStatus)" :size="size" :type="type" @click="handleDel(row)">删除</el-button>
      </template>
      <template slot="menuRight">
        <el-button type="primary" @click="handleAdd">创建招聘会</el-button>
      </template>

      <template slot-scope="{ row }" slot="name">
        <span class="primary-color">{{ row.name }}</span>
      </template>
      <template slot-scope="{ row }" slot="type">
        <span>{{ row.type === '1' ? '线上' : '线下' }}</span>
      </template>
      <template slot-scope="{ row }" slot="companyCount">
        <span class="primary-color">{{ row.companyCount }}</span>
      </template>
      <template slot-scope="{ row }" slot="postCount">
        <span class="primary-color">{{ row.postCount }}</span>
      </template>
      <template slot-scope="{ row }" slot="display">
        <el-switch v-model="row.display" @change="displayChange(row)"></el-switch>
      </template>
      <template slot-scope="{ row }" slot="top">
        <el-switch v-model="row.top" @change="topChange(row)"></el-switch>
      </template>
      <template slot-scope="{ row }" slot="conductStatus">
        <span v-if="row.conductStatus.length === 1" :class="['cicle-status', conductStatusColor[row.conductStatus]]">{{
          conductStatusObj[row.conductStatus]
        }}</span>
        <span v-else class="cicle-status success">报名中/进行中</span>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  jobFairPageUrl,
  jobFairRemoveUrl,
  jobFairCancelUrl,
  jobFairPublishUrl,
  jobFairUpdateNameUrl,
  jobFairCountUrl,
  updateDisplayUrl,
  updateTopUrl
} from '@/api'

export default {
  data() {
    return {
      searchValue: '',
      conductStatus: '0',
      conductStatusObj: { 0: '全部', 1: '未发布', 2: '报名中', 3: '待开始', 4: '进行中', 5: '已结束', 6: '已撤销' },
      conductStatusColor: { 2: 'success', 3: 'warn', 4: 'success', 5: 'info', 6: 'info' },
      data: [],
      query: {},
      page: { pageSize: 10, currentPage: 1, total: 0 },
      loading: false,
      todoNumOjb: {},
      option: {
        align: 'center',
        calcHeight: 30,
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        columnBtn: false,
        dialogClickModal: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        refreshBtn: false,
        column: [
          { label: '招聘会', prop: 'name', slot: true },
          { label: '形式', prop: 'type', slot: true },
          { label: '参加单位', prop: 'companyCount', slot: true },
          { label: '岗位', prop: 'postCount', slot: true },
          { label: '招聘会开始时间', prop: 'startDate' },
          { label: '发布时间', prop: 'publishDate' },
          { label: '是否显示', prop: 'display', slot: true },
          { label: '是否置顶', prop: 'top', slot: true },
          { label: '状态', prop: 'conductStatus', slot: true }
        ]
      }
    }
  },
  methods: {
    async loadCount() {
      const { data } = await this.$get(jobFairCountUrl)
      this.todoNumOjb = data.map
    },
    async onLoad(page, params = {}) {
      const values = { ...params }
      this.loading = true
      const paramsReq = Object.assign(values, this.query, {
        current: page.currentPage,
        size: page.pageSize,
        searchValue: this.searchValue,
        conductStatus: this.conductStatus
      })
      const { data } = await this.$post(jobFairPageUrl, paramsReq)
      this.data = data.records
      this.page.total = data.total
      this.loading = false
      this.loadCount()
    },
    handleAdd() {
      this.$router.push({ path: '/job/fair/edit/-1' })
    },
    handleDetail({ id }) {
      this.$router.push({ path: `/job/fair/detail/${id}` })
    },
    handleEdit({ id = '-1', name = '' }) {
      this.$router.push({ path: `/job/fair/edit/${id}`, query: { name: `编辑-${name}` } })
    },
    handleEditName({ name, id }) {
      this.$prompt('请填写修改的招聘会名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请填写招聘会名称'
      }).then(async ({ value }) => {
        await this.$post(jobFairUpdateNameUrl, { id, name: value }, true)
        this.refreshChange()
      })
    },
    handlePublish({ id, name }) {
      this.$confirm(`确定发布<${name}>的招聘会?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { msg: message } = await this.$post(jobFairPublishUrl, { id: id }, false)
        this.onLoad(this.page)
        this.$message({ type: 'success', message })
      })
    },
    handleCancel({ id, name }) {
      this.$confirm(`确定撤销<${name}>的招聘会?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { msg: message } = await this.$post(jobFairCancelUrl, { id: id }, false)
        this.onLoad(this.page)
        this.$message({ type: 'success', message })
      })
    },
    handleOff({ id, name }) {
      this.$confirm(`确定下线<${name}>的招聘会?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { msg: message } = await this.$post(updateDisplayUrl, { id, display: false })
        this.$message.success('操作成功!')
        this.onLoad(this.page)
        this.$message({ type: 'success', message })
      })
    },
    handleDel({ id, name }) {
      this.$confirm(`确定删除<${name}>的招聘会?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { msg: message } = await this.$post(jobFairRemoveUrl, { ids: id }, false)
        this.onLoad(this.page)
        this.$message({ type: 'success', message })
      })
    },
    displayChange(row) {
      const { id, name, display } = row
      const title = `确定将招聘会<${name}>设置为${display ? '显示' : '不显示'}`
      this.$confirm(title, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          try {
            await this.$post(updateDisplayUrl, { id, display })
            this.$message.success('操作成功!')
          } catch (e) {
            console.log(e)
            row.display = !row.display
          }
        })
        .catch(() => {
          row.display = !row.display
        })
    },
    topChange(row) {
      const { id, name, top } = row
      const title = `确定将招聘会<${name}>${top ? '置顶' : '取消置顶'}`
      this.$confirm(title, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          try {
            await this.$post(updateTopUrl, { id, top })
            this.$message.success('操作成功!')
          } catch (e) {
            console.log(e)
            row.top = !row.top
          }
        })
        .catch(() => {
          row.top = !row.top
        })
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
    this.loadCount()
  }
}
</script>
