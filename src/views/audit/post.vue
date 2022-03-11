
<template>
  <basic-container>
    <div class="page-title">岗位审核</div>
    <avue-crud
      ref="crud"
      :data="data"
      v-model="form"
      :option="option"
      :page.sync="page"
      :table-loading="loading"
      @on-load="onLoad"
      @size-change="sizeChange"
      @search-reset="searchReset"
      @search-change="searchChange"
      @current-change="currentChange"
      @refresh-change="refreshChange"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <el-radio-group v-model="auditStatus" size="small" @change="searchReset">
          <el-radio-button v-for="(name, label) in  auditStatusObj" :key="label" :label="label">{{name}}</el-radio-button>
        </el-radio-group>
      </template>

      <template v-if="auditStatus === '1'" slot="menuRight">
        <el-button type="primary" icon="el-icon-document-checked" size="small" @click="rowMulAudit(2)">批量通过</el-button>
        <el-button type="danger" icon="el-icon-document-delete" size="small" plain @click="rowMulAudit(3)">批量不通过</el-button>
      </template>

      <template slot-scope="{row}" slot="menu">
        <el-button v-if="row.auditStatus === 1" type="text" icon="el-icon-document-checked" @click="rowAudit(row, 2)">通过</el-button>
        <el-button v-if="row.auditStatus === 1" type="text" icon="el-icon-document-delete" @click="rowAudit(row, 3)">不通过</el-button>
      </template>
      <template slot-scope="{row}" slot="companyName">
        <span>{{row.company.name}}</span>
      </template>
      <template slot-scope="{row}" slot="auditStatus">
        <el-tag :type="auditStatusType[row.auditStatus]">{{auditStatusObj[row.auditStatus]}}</el-tag>
      </template>
      <template slot="auditStatusForm">
        <el-tag :type="auditStatusType[form.auditStatus]">{{auditStatusObj[form.auditStatus]}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { postPageUrl, postAuditBatchUrl } from '@/api'

export default {
  data() {
    return {
      auditStatus: '0',
      auditStatusObj: { 0: '全部', 1: '未审核', 2: '审核通过', 3: '审核不通过' },
      auditStatusType: { 1: 'warning', 2: 'success', 3: 'danger' },
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
        labelWidth: 140,
        index: true,
        columnBtn: false,
        dialogClickModal: false,
        refreshBtn: false,
        viewBtn: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        selection: true,
        tip: false,
        column: [
          { label: '公司名称', prop: 'companyName', search: true },
          { label: '岗位名称', prop: 'postName', search: true },
          { label: '招聘人数', prop: 'requireCount' },
          { label: '性别要求', prop: 'requireMaleCountName' },
          { label: '文化程度', prop: 'educationCodeName' },
          { label: '工作年限', prop: 'workYearsName' },
          { label: '薪资待遇', prop: 'salaryExpectationMinName' },
          { label: '福利', prop: 'welfareName', overHidden: true },
          { label: '年龄要求', prop: 'ageMaxName', hide: true },
          { label: '专业', prop: 'majorCodeName', hide: true },
          { label: '人员类别', prop: 'staffCategoryCodeName', hide: true },
          { label: '人员来源', prop: 'staffSourceCodeName', hide: true },
          { label: '用工方式', prop: 'employmentModeCodeName', hide: true },
          { label: '工作地点', prop: 'workAddressCodeName', hide: true },
          { label: '预期到岗截止时间', prop: 'arrivalEndTime', hide: true },
          { label: '预期到岗起始时间', prop: 'arrivalStartTime', hide: true },
          { label: '到岗时间', prop: 'arrivalTime', hide: true },
          { label: '截止时间', prop: 'endTime', hide: true },
          { label: '其他要求', prop: 'postDescribe', span: 24, hide: true },
          { label: '联系人', prop: 'contacts' },
          { label: '联系方式', prop: 'phone' },
          { label: '联系邮箱', prop: 'email', hide: true },
          { label: '归档时间', prop: 'filingDate', hide: true },
          { label: '审核状态', prop: 'auditStatus', slot: true, formslot: true },
          { label: '审核理由', prop: 'reason', hide: true }
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
        auditStatus: this.auditStatus === '0' ? '' : this.auditStatus
      })
      const { data } = await this.$post(postPageUrl, paramsReq)
      this.data = data.records
      data.records.forEach(item => {
        item.companyName = item.company && item.company.name
        item.postName = item.name
        item.requireMaleCountName = this.initRequireSex(item)
        item.educationCodeName = item.educationCode && item.educationCode.dictValue
        item.workYearsName = item.workYears ? `${item.workYears}年` : '不限'
        item.salaryExpectationMinName = this.initSalaryExpectationMin(item)
        item.welfareName = item.welfare.map(w => w.dictValue).join(',')
        item.ageMaxName = this.initAgeMax(item)
        item.majorCodeName = item.majorCode && item.majorCode.dictValue
        item.staffCategoryCodeName = item.staffCategoryCode && item.staffCategoryCode.dictValue
        item.staffSourceCodeName = item.staffSourceCode && item.staffSourceCode.dictValue
        item.employmentModeCodeName = item.employmentModeCode && item.employmentModeCode.dictValue
        item.workAddressCodeName = item.workAddressCode.map(w => w.dictValue).join(',')
      })
      this.page.total = data.total
      this.selectionClear()
      this.loading = false
    },
    rowAudit(item, auditStatus) {
      this.handleAudit(item.id, auditStatus)
    },
    rowMulAudit(auditStatus) {
      if (!this.ids) {
        this.$message.warning('至少选中一条数据')
        return
      }
      this.handleAudit(this.ids, auditStatus)
    },
    handleAudit(ids, auditStatus) {
      const title = this.auditStatusObj[auditStatus]
      const pt = { confirmButtonText: '确定', cancelButtonText: '取消' }
      if (auditStatus === 3) {
        Object.assign(pt, { inputPattern: /\S/, inputErrorMessage: `请填写${title}理由` })
      }
      this.$prompt(`请填写${title}理由`, '提示', pt).then(async ({ value: reason }) => {
        await this.$post(postAuditBatchUrl, { ids, auditStatus, reason })
        this.onLoad(this.page)
        this.$message({ type: 'success', message: '操作成功!' })
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
    },
    initRequireSex(row) {
      if (!row.requireMaleCount && !row.requireFemaleCount) {
        return '不限'
      }
      if (row.requireMaleCount && !row.requireFemaleCount) {
        return `男${row.requireMaleCount}`
      }
      if (!row.requireMaleCount && row.requireFemaleCount) {
        return `女${row.requireFemaleCount}`
      }
      return `男${row.requireMaleCount},女${row.requireFemaleCount}`
    },
    initSalaryExpectationMin(row) {
      if (row.salaryExpectationMin && row.salaryExpectationMax) {
        return `${row.salaryExpectationMin}-${row.salaryExpectationMax}元/月`
      }
      if (row.salaryExpectationMin) {
        return `${row.salaryExpectationMin}元以上/月`
      }
      if (row.salaryExpectationMax) {
        return `${row.salaryExpectationMax}元以下/月`
      }
      return '不限'
    },
    initAgeMax(row) {
      if (row.ageMin && row.ageMax) {
        return `${row.ageMin}-${row.ageMax}岁`
      }
      if (row.ageMin) {
        return `${row.ageMin}岁以上`
      }
      if (row.ageMax) {
        return `${row.ageMax}岁以下`
      }
      return '不限'
    }
  }
}
</script>
