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
      <div class="rdx-m-l-10 font-bold">{{`${search.startDate} 至 ${search.endDate} 线下招聘会统计`}}</div>
    </template>
    <template slot="menuRight">
      <el-button type="text" icon="el-icon-download" @click="handleDown">下载表格</el-button>
    </template>
    <template slot="menu" slot-scope="{row,type,size}">
      <el-button :size="size" :type="type" @click="handleIntention(row)">修改意向人数</el-button>
    </template>
    <template slot-scope="{ row }" slot="holdNumbers">
      <el-button type="text" @click="handleDetail(row)">{{`${row.offlineJobFairTypeCode.dictValue}第${row.holdNumbers}期`}}</el-button>
    </template>
    <template slot-scope="{ row }" slot="offlineJobFairTypeCode">
      <span>{{row.offlineJobFairTypeCode && row.offlineJobFairTypeCode.dictValue}}</span>
    </template>
  </avue-crud>
</template>

<script>
import { statisticsOfflineListUrl, statisticsOfflineListExportUrl, offlineUpdateIntentionNumUrl } from '@/api'
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
        editBtn: false,
        delBtn: false,
        refreshBtn: false,
        emptyBtn: false,
        searchShowBtn: false,
        searchBtnText: '查询',
        showSummary: true,
        column: [
          {
            label: '招聘时间',
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
          { label: '交流会期数', prop: 'holdNumbers', slot: true },
          { label: '招聘时间', prop: 'startDate' },
          { label: '单位', prop: 'companyCount' },
          { label: '职位数', prop: 'postCount' },
          { label: '招聘人数', prop: 'requireRecruitNum' },
          { label: '招聘毕业生人数', prop: 'requireRecruitGraduateNum' },
          { label: '招聘会类型', prop: 'offlineJobFairTypeCode', slot: true },
          // { label: '入场人数', prop: 'entranceNum' },
          { label: '意向人数', prop: 'intentionNum' }
        ]
      }
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      const { data } = await this.$post(statisticsOfflineListUrl, this.search)
      this.data = data
      this.loading = false
    },
    handleIntention({ id }) {
      this.$prompt('请填写意向人数', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\+?[1-9][0-9]*$/,
        inputErrorMessage: '请填写正整数'
      }).then(async ({ value }) => {
        await this.$post(offlineUpdateIntentionNumUrl, { jobFairId: id, intentionNum: value }, true)
        this.loadData()
      })
    },
    handleDetail({ id, offlineJobFairTypeCode, holdNumbers }) {
      this.$router.push({
        path: `/statistics/offline/${id}`,
        query: { name: `${offlineJobFairTypeCode.dictValue}第${holdNumbers}期详情` }
      })
    },
    summaryMethod({ columns, data }) {
      const sums = []
      if (columns.length > 0) {
        columns.forEach((column, index) => {
          if ([0, 1, 2, 7, 10, 11].includes(index)) {
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
        statisticsOfflineListExportUrl,
        this.search,
        'application/vnd.ms-excel',
        `${startDate}至${endDate}线下招聘会统计.xlsx`
      )
    }
  },
  created() {
    this.searchReset()
  }
}
</script>
