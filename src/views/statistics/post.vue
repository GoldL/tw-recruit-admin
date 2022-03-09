<template>
  <basic-container>
    <div class="page-title">用工需求统计</div>
    <avue-crud
      :data="data"
      :page.sync="page"
      :search.sync="search"
      :table-loading="loading"
      :option="option"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
    >
      <template slot="menuLeft">
        <div class="rdx-m-l-10 font-bold">{{`${search.startDate} 至 ${search.endDate} 用工需求统计`}}</div>
      </template>
      <!-- <template slot="menuRight">
        <el-button type="text" icon="el-icon-download" @click="handleDown">下载表格</el-button>
      </template>-->
    </avue-crud>
  </basic-container>
</template>

<script>
import { filingPageUrl } from '@/api'
import { pickerOptions } from '@/util'
import { dateFormat } from '@/util/date'

export default {
  data() {
    return {
      page: { pageSize: 10, currentPage: 1, total: 0 },
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
          { label: '统计日期', prop: 'statisticsDate' },
          { label: '归档岗位需求数', prop: 'postRequireCount' },
          { label: '归档岗位数', prop: 'postCount' }
        ]
      }
    }
  },
  methods: {
    async onLoad(page) {
      const values = {}
      this.loading = true
      const paramsReq = Object.assign(values, this.search, {
        current: page.currentPage,
        size: page.pageSize
      })
      const { data } = await this.$post(filingPageUrl, paramsReq)
      this.data = data.records
      this.page.total = data.total
      this.loading = false
    },
    searchReset() {
      const start = new Date()
      start.setTime(new Date().getTime() - 3600 * 1000 * 24 * 30)
      const startDate = dateFormat(start, 'yyyy-MM-dd')
      const endDate = dateFormat(new Date(), 'yyyy-MM-dd')
      this.search = { date: [startDate, endDate], startDate, endDate }
      this.onLoad(this.page)
    },
    searchChange(params, done) {
      this.search.startDate = params.date[0]
      this.search.endDate = params.date[1]
      this.page.currentPage = 1
      this.onLoad(this.page)
      done()
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage
      this.onLoad(this.page)
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.onLoad(this.page)
    }
    // handleDown() {
    //   const { startDate, endDate } = this.search
    //   this.$downloadFile(postListExportUrl, this.search, 'application/vnd.ms-excel', `${startDate}至${endDate}用工需求统计.xlsx`)
    // }
  },
  created() {
    this.searchReset()
  }
}
</script>
