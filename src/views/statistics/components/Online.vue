<template>
  <avue-crud
    :data="data"
    :search.sync="search"
    :table-loading="loading"
    :option="option"
    :summary-method="summaryMethod"
    @search-change="searchChange"
    @search-reset="searchReset"
  >
    <template slot="menuLeft">
      <div class="rdx-m-l-10 font-bold">{{`${search.startDate} 至 ${search.endDate} 线上招聘会统计`}}</div>
    </template>
    <template slot="menuRight">
      <el-button type="text" icon="el-icon-download" @click="handleDown">下载表格</el-button>
    </template>
    <template slot-scope="{ row }" slot="name">
      <el-button type="text" @click="handleDetail(row)">{{row.name}}</el-button>
    </template>
  </avue-crud>
</template>

<script>
import { statisticsOnlineListUrl, statisticsOnlineListExportUrl } from '@/api'
import { pickerOptions } from '@/util'
import { dateFormat } from '@/util/date'

export default {
  data() {
    return {
      search: {},
      data: [],
      loading: false,
      option: {
        align: 'center',
        calcHeight: 30,
        searchShow: true,
        searchMenuSpan: 4,
        searchLabelWidth: 120,
        index: true,
        columnBtn: false,
        dialogClickModal: false,
        addBtn: false,
        menu: false,
        refreshBtn: false,
        emptyBtn: false,
        searchShowBtn: false,
        searchBtnText: '查询',
        showSummary: true,
        column: [
          {
            label: '招聘会开始时间',
            prop: 'date',
            search: true,
            searchRange: true,
            searchSpan: 12,
            hide: true,
            type: 'daterange',
            searchClearable: false,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions
          },
          { label: '招聘会名称', prop: 'name', slot: true },
          { label: '招聘会开始时间', prop: 'startDate' },
          { label: '企业数', prop: 'companyCount' },
          { label: '岗位数', prop: 'postCount' },
          { label: '岗位需求数', prop: 'postRequireCount' },
          { label: '投递简历人数', prop: 'sendResumeCount' },
          { label: '面试通过数', prop: 'interviewPassCount' },
          { label: '招聘会浏览量', prop: 'pv' },
          { label: '招聘会访客量', prop: 'uv' }
        ]
      }
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      const { data } = await this.$post(statisticsOnlineListUrl, this.search)
      this.data = data
      this.loading = false
    },
    handleDetail({ id, name }) {
      this.$router.push({ path: `/statistics/online/${id}`, query: { name: `${name}详情` } })
    },
    summaryMethod({ columns, data }) {
      const sums = []
      if (columns.length > 0) {
        columns.forEach((column, index) => {
          if ([0, 1, 2].includes(index)) {
            sums[1] = '合计'
          } else {
            const values = this.data.reduce((total, item) => total + Number(item[column.property]), 0)
            sums[index] = values
          }
        })
      }
      return sums
    },
    searchReset() {
      const start = new Date()
      start.setTime(new Date().getTime() - 3600 * 1000 * 24 * 30)
      const startDate = dateFormat(start, 'yyyy-MM-dd')
      const endDate = dateFormat(new Date(), 'yyyy-MM-dd')
      this.search = { date: [startDate, endDate], startDate, endDate }
      this.loadData()
    },
    searchChange(params, done) {
      this.search.startDate = params.date[0]
      this.search.endDate = params.date[1]
      this.loadData()
      done()
    },
    handleDown() {
      const { startDate, endDate } = this.search
      this.$downloadFile(
        statisticsOnlineListExportUrl,
        this.search,
        'application/vnd.ms-excel',
        `${startDate}至${endDate}线上招聘会统计.xlsx`
      )
    }
  },
  created() {
    this.searchReset()
  }
}
</script>
