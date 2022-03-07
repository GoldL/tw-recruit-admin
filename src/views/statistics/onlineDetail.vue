<template>
  <div>
    <Crumb :breakCrumb="breakCrumb" />
    <basic-container>
      <div class="page-title">{{ name }}</div>
      <avue-crud
        class="rdx-m-t-30"
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
        <template slot="menuRight">
          <el-button type="text" icon="el-icon-download" @click="handleDown">下载表格</el-button>
        </template>
        <template slot-scope="{ row }" slot="requireMaleCount">
          <span v-if="!row.requireMaleCount && !row.requireFemaleCount">不限</span>
          <span v-else-if="row.requireMaleCount && !row.requireFemaleCount">男{{row.requireMaleCount}}</span>
          <span v-else-if="!row.requireMaleCount && row.requireFemaleCount">女{{row.requireFemaleCount}}</span>
          <span v-else>男{{ row.requireMaleCount }},女{{ row.requireFemaleCount }}</span>
        </template>
        <template slot-scope="{ row }" slot="educationCode">
          <span>{{ row.educationCode.dictValue ? row.educationCode.dictValue : '-' }}</span>
        </template>
        <template slot-scope="{ row }" slot="workYears">
          <span>{{ row.workYears ? `${row.workYears}年` : '不限' }}</span>
        </template>
        <template slot-scope="{ row }" slot="salaryExpectationMin">
          <span v-if="row.salaryExpectationMin && row.salaryExpectationMax">{{ row.salaryExpectationMin }}-{{ row.salaryExpectationMax }}元/月</span>
          <span v-else-if="row.salaryExpectationMin">{{ row.salaryExpectationMin }}元以上/月</span>
          <span v-else-if="row.salaryExpectationMax">{{ row.salaryExpectationMax }}元以下/月</span>
          <span v-else>不限</span>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { onLineResisterPostPageUrl, onLineResisterPostExportUrl } from '@/api'
import Crumb from '@/components/Crumb'

export default {
  components: { Crumb },
  data() {
    return {
      breakCrumb: [{ path: '/statistics/index', name: '招聘会统计' }, { name: '招聘会统计详情' }],
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
        addBtn: false,
        menu: false,
        refreshBtn: false,
        columnBtn: false,
        dialogClickModal: false,
        column: [
          { label: '公司名称', prop: 'companyName' },
          { label: '公司地址', prop: 'address' },
          { label: '岗位', prop: 'postName' },
          { label: '招聘人数', prop: 'requireCount' },
          { label: '性别要求', prop: 'requireMaleCount', slot: true },
          { label: '文化程度', prop: 'educationCode', slot: true },
          { label: '工作年限', prop: 'workYears' },
          { label: '薪资待遇', prop: 'salaryExpectationMin', slot: true },
          { label: '福利', prop: 'welfare' },
          { label: '其他要求', prop: 'postDescribe' },
          { label: '联系人', prop: 'contacts' },
          { label: '联系方式', prop: 'phone' }
        ]
      }
    }
  },
  methods: {
    async onLoad(page, params = {}) {
      const values = { ...params }
      this.loading = true
      const paramsReq = Object.assign(values, this.query, {
        current: page.currentPage,
        size: page.pageSize,
        jobFairId: this.$route.params.id
      })
      const { data } = await this.$post(onLineResisterPostPageUrl, paramsReq)
      this.data = data.records
      this.page.total = data.total
      this.loading = false
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
    handleDown() {
      this.$downloadFile(
        onLineResisterPostExportUrl,
        { jobFairId: this.$route.params.id },
        'application/vnd.ms-excel',
        `${this.name}统计.xlsx`,
        false
      )
    }
  },
  created() {
    this.name = this.$route.query.name
  }
}
</script>

<style lang="scss" scoped>
.rdx-m-t-30 {
  margin-top: 30px;
}
</style>
