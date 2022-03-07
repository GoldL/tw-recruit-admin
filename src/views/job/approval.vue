<template>
  <basic-container>
    <div class="page-title">招聘会审核</div>
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
        <el-radio-group v-model="status" @change="raidoChange">
          <el-radio-button v-for="(value, key) in statusObj" :key="key" :label="key">
            <el-badge :hidden="key !== '2' || !auditNum" :value="auditNum" :max="99">{{ value }}</el-badge>
          </el-radio-button>
        </el-radio-group>
        <div class="search-box">
          <el-input v-model="searchValue" placeholder="输入搜索关键字" @input="refreshChange" suffix-icon="el-icon-search"></el-input>
        </div>
      </template>
      <template slot="menu" slot-scope="{ row, type, size }">
        <el-button :size="size" :type="type" @click="handleDetail(row)">{{ row.status === 2 ? '审核' : '查看' }}</el-button>
      </template>

      <template slot-scope="{ row }" slot="jobFairId">
        <span class="primary-color">{{ row.jobFairId }}</span>
      </template>
      <template slot-scope="{ row }" slot="name">
        <span class="primary-color">{{ row.name }}</span>
      </template>
      <template slot-scope="{ row }" slot="type">
        <span>{{ row.type === '1' ? '线上' : '线下' }}</span>
      </template>
      <template slot-scope="{ row }" slot="status">
        共有
        <span class="primary-color">{{ [2, 4].includes(row.status) ? row.auditCount || 0 : row.passCount + row.notPassCount }}</span>
        个岗位
        <br />已通过
        <span class="success-color">{{ [2, 4].includes(row.status) ? 0 : row.passCount }}</span>
        个岗位,未通过
        <span class="error-color">{{ [2, 4].includes(row.status) ? 0 : row.notPassCount }}</span>
        个岗位
      </template>
    </avue-crud>

    <el-dialog
      v-if="dialogVisible"
      class="avue-dialog"
      top="2%"
      width="80%"
      append-to-body
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-row class="line-desc postion">
        <el-col :span="8" :offset="5">
          <div>招聘会名称：{{ detail.name }}</div>
          <div>招聘会开始时间：{{ detail.startDate }}</div>
        </el-col>
        <el-col :span="8">
          <div>招聘会类型：{{ detail.type === '1' ? '线上' : '线下' }}</div>
          <div>申请单位：{{ detail.companyName }}</div>
          <div v-if="detail.address">会议地点：{{ detail.address }}</div>
        </el-col>
      </el-row>
      <avue-crud class="no-top" :data="detail.list" :option="detailOption">
        <template slot-scope="{ row }" slot="requireMaleCount">
          <span v-if="!row.requireMaleCount && !row.requireFemaleCount">不限</span>
          <span v-else-if="row.requireMaleCount && !row.requireFemaleCount">男</span>
          <span v-else-if="!row.requireMaleCount && row.requireFemaleCount">女</span>
          <span v-else>男{{ row.requireMaleCount }},女{{ row.requireFemaleCount }}</span>
        </template>
        <template slot-scope="{ row }" slot="salaryExpectationMin">
          <span v-if="row.salaryExpectationMin && row.salaryExpectationMax">
            {{ row.salaryExpectationMin }}-{{ row.salaryExpectationMax }}元/月
          </span>
          <span v-else-if="row.salaryExpectationMin">{{ row.salaryExpectationMin }}元以上/月</span>
          <span v-else-if="row.salaryExpectationMax">{{ row.salaryExpectationMax }}元以下/月</span>
          <span v-else>不限</span>
        </template>

        <template slot="statusHeader">
          <div v-if="selectedItem.status === 2">
            <el-button type="text" @click="handleAll(3)">全部通过</el-button>
            <el-button type="text" @click="handleAll(4)">全部拒绝</el-button>
          </div>
          <div v-else>审核结果</div>
        </template>

        <template slot="status" slot-scope="{ row }">
          <div v-if="selectedItem.status === 2">
            <el-radio-group v-model="row.status">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="4">拒绝</el-radio>
            </el-radio-group>
            <el-input v-if="row.status === 4" v-model="row.refuseReason" placeholder="请输入拒绝理由" :maxlength="32"></el-input>
          </div>
          <div v-else>
            <span :class="['cicle-status', row.jobFairCompanyPostStatus === 3 ? 'success' : 'error']">{{
              row.jobFairCompanyPostStatus === 3 ? '通过' : '拒绝'
            }}</span>
            <span v-if="row.refuseReason">（{{ row.refuseReason }}）</span>
          </div>
        </template>
      </avue-crud>
      <div v-if="selectedItem.status === 2" class="tc">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="handleApproval">提交</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { jobFairApprovalPageUrl, jobFairApprovalDetailUrl, jobFairApprovalSubmitUrl, jobFairApprovalCountUrl } from '@/api'

export default {
  data() {
    return {
      searchValue: '',
      status: '0',
      statusObj: { 0: '全部', 2: '待审批', 3: '已审批', 4: '已作废' },
      data: [],
      query: {},
      page: { pageSize: 10, currentPage: 1, total: 0 },
      loading: false,
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
          { label: '参加单位', prop: 'companyName', slot: true },
          { label: '形式', prop: 'type', slot: true },
          { label: '招聘会开始时间', prop: 'startDate' },
          { label: '申请时间', prop: 'applyTime' },
          { label: '状态', prop: 'status', hide: false, slot: true }
        ]
      },
      auditNum: 0,
      selectedItem: {},
      dialogVisible: false,
      detail: { list: [] },
      detailOption: {
        align: 'center',
        calcHeight: 30,
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        columnBtn: false,
        dialogClickModal: false,
        addBtn: false,
        menu: false,
        refreshBtn: false,
        column: [
          { label: '岗位名称', prop: 'name' },
          { label: '招聘人数', prop: 'requireCount' },
          { label: '性别要求', prop: 'requireMaleCount', slot: true },
          { label: '工作要求', prop: 'postDescribe' },
          { label: '薪资待遇', prop: 'salaryExpectationMin', slot: true },
          { label: '福利待遇', prop: 'welfare' },
          { prop: 'status', slot: true, headerslot: true, width: 200 }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.selectedItem.status === 2 ? '招聘会审核' : '招聘会审核结果'
    }
  },
  methods: {
    async loadAuditCount() {
      const { data } = await this.$get(jobFairApprovalCountUrl)
      this.auditNum = data.map && data.map[2]
    },
    async onLoad(page, params = {}) {
      const values = { ...params }
      this.loading = true
      const paramsReq = Object.assign(values, this.query, {
        current: page.currentPage,
        size: page.pageSize,
        searchValue: this.searchValue,
        status: this.status === '0' ? '' : this.status
      })
      const { data } = await this.$post(jobFairApprovalPageUrl, paramsReq)
      this.data = data.records
      this.page.total = data.total
      this.loading = false
      this.loadAuditCount()
    },
    async loadDetail() {
      const { jobFairCompanyId } = this.selectedItem
      const { data } = await this.$get(jobFairApprovalDetailUrl, { jobFairCompanyId })
      data.list.forEach(item => (item.status = ''))
      this.detail = data
      this.all = ''
      this.dialogVisible = true
    },
    handleAll(status) {
      this.detail.list.forEach(item => (item.status = status))
    },
    async handleApproval() {
      const list = this.detail.list.map(item => {
        const { jobFairCompanyPostId, status, refuseReason } = item
        return { jobFairCompanyPostId, status, refuseReason }
      })
      if (list.some(item => !item.status)) {
        this.$message.warning('请确认所有岗位已经审核完毕')
        return
      }
      if (list.filter(item => item.status === 4).some(item => !item.refuseReason)) {
        this.$message.warning('拒绝的岗位必须填写理由')
        return
      }
      const { jobFairCompanyId } = this.selectedItem
      const { msg: message } = await this.$post(jobFairApprovalSubmitUrl, { jobFairCompanyId, list })
      this.refreshChange()
      this.$message({ type: 'success', message })
      this.dialogVisible = false
    },
    handleDetail(row) {
      this.selectedItem = row
      this.loadDetail()
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
    },
    raidoChange() {
      const status = this.findObject(this.option.column, 'status')
      status.hide = ['2', '4'].includes(this.status)
      this.refreshChange()
    }
  },
  created() {
    this.loadAuditCount()
  }
}
</script>

<style lang="scss" scoped>
.postion {
  position: relative;
  .all-pass {
    position: absolute;
    right: 0;
    bottom: 16px;
  }
}
</style>
