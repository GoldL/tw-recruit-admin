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
        <template slot-scope="{ row }" slot="ageMax">
          <span v-if="row.ageMin && row.ageMax">{{ row.ageMin }}-{{ row.ageMax }}岁</span>
          <span v-else-if="row.ageMin">{{ row.ageMin }}岁以上</span>
          <span v-else-if="row.ageMax && row.ageMax">{{ row.ageMax }}岁以下</span>
          <span v-else>不限</span>
        </template>
        <template slot-scope="{ row }" slot="educationCode">
          <span>{{ row.educationCode.dictValue ? row.educationCode.dictValue : '-' }}</span>
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
import { offLineResisterPostPageUrl, offLineResisterPostExportUrl } from '@/api'
import Crumb from '@/components/Crumb'

export default {
  components: { Crumb },
  data() {
    return {
      type: 'online',
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
        index: true,
        addBtn: false,
        menu: false,
        refreshBtn: false,
        columnBtn: false,
        dialogClickModal: false,
        column: [
          { label: '单位编号', prop: 'companyId' },
          { label: '单位名称', prop: 'companyName' },
          { label: '联系地址', prop: 'companyAddress' },
          { label: '工种描述', prop: 'postName' },
          { label: '招工人数', prop: 'requireCount' },
          { label: '年龄要求', prop: 'ageMax', slot: true },
          { label: '工资待遇', prop: 'salaryExpectationMin', slot: true },
          { label: '文化程度', prop: 'educationCode', slot: true },
          { label: '岗位需求', prop: 'postDescribe' },
          { label: '其他要求', prop: 'welfare' },
          { label: '窗口号', prop: 'recruitWindow' },
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
      const { data } = await this.$post(offLineResisterPostPageUrl, paramsReq)
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
        offLineResisterPostExportUrl,
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
