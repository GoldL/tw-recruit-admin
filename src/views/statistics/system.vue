<template>
  <basic-container>
    <div class="page-title">旧系统报表统计</div>
    <avue-form :option="searchOption" v-model="searchForm"></avue-form>
    <div class="line"></div>
    <avue-crud :data="data" :table-loading="loading" :option="option" :summary-method="summaryMethod">
      <template slot="menuLeft">
        <div class="rdx-m-t-10 font-bold">{{title}}</div>
      </template>
      <template slot="menuRight">
        <el-button type="text" icon="el-icon-download" @click="handleDown">导出</el-button>
      </template>
      <template slot-scope="{row}" slot="networkName">
        <span>{{row.networkName || row.platformName}}</span>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  recruitRegistListUrl,
  stallCountListUrl,
  entranceRecruitListUrl,
  recruitRegistExportUrl,
  stallCountExportUrl,
  entranceRecruitExportUrl,
  dictUrl
} from '@/api'
import { pickerOptions } from '@/util'
import { dateFormat } from '@/util/date'

export default {
  data() {
    return {
      data: [],
      loading: false,
      searchForm: { date: [], includeList: [], type: '0' },
      searchOption: {
        labelWidth: 80,
        menuBtn: false,
        column: [
          {
            label: '统计时间',
            prop: 'date',
            type: 'daterange',
            clearable: false,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions,
            span: 8,
            change: () => {
              this.$nextTick(() => {
                this.searchChange()
              })
            }
          },
          {
            label: '',
            labelWidth: 0,
            prop: 'includeList',
            multiple: false,
            span: 24,
            type: 'checkbox',
            dicData: [{ label: '包括下属网点', value: 'true' }],
            change: () => {
              this.$nextTick(() => {
                this.searchChange()
              })
            }
          },
          {
            label: '统计范围',
            prop: 'serviceNetworkCode',
            type: 'select',
            props: { label: 'dictValue', value: 'dictKey' },
            dicData: [],
            span: 8,
            change: () => {
              this.$nextTick(() => {
                this.searchChange()
              })
            }
          },
          {
            label: '',
            prop: 'type',
            labelWidth: 0,
            span: 24,
            type: 'radio',
            value: '0',
            dicData: [
              { label: '用人单位招聘登记数', value: '0' },
              { label: '摊位数', value: '1' },
              { label: '入场求职人数', value: '2' }
            ],
            change: () => {
              this.$nextTick(() => {
                this.searchChange()
              })
            }
          }
        ]
      },
      option: {
        align: 'center',
        calcHeight: 30,
        searchShow: false,
        border: true,
        index: true,
        columnBtn: false,
        dialogClickModal: false,
        addBtn: false,
        menu: false,
        refreshBtn: false,
        showSummary: true,
        column: [
          { label: '网点名称', prop: 'networkName', slot: true },
          { label: '人次', prop: 'count' }
        ]
      }
    }
  },
  computed: {
    urlObj() {
      return { 0: recruitRegistListUrl, 1: stallCountListUrl, 2: entranceRecruitListUrl }
    },
    downObj() {
      return { 0: recruitRegistExportUrl, 1: stallCountExportUrl, 2: entranceRecruitExportUrl }
    },
    title() {
      const { startDate, endDate, type } = this.searchForm
      const titleObj = { 0: '用人单位招聘登记数', 1: '单位数', 2: '入场求职人数' }
      return `${startDate} 至 ${endDate} ${titleObj[type]}统计`
    }
  },
  methods: {
    async loadServiceNetwork() {
      const url = `${dictUrl}SERVICE_NETWORK`
      const { data } = await this.$get(url)
      console.log(data)
      if (data && data.length && data[0].children && data[0].children.length) {
        const networkDom = this.findObject(this.searchOption.column, 'serviceNetworkCode')
        networkDom.dicData = data[0].children
        this.searchForm.serviceNetworkCode = data[0].children[0].dictKey
        this.searchReset()
      }
    },
    async loadData() {
      this.loading = true
      const { type = '0', startDate, endDate, include, serviceNetworkCode } = this.searchForm
      const url = this.urlObj[type]
      if (!startDate) {
        return
      }
      const { data } = await this.$post(url, { startDate, endDate, include, serviceNetworkCode })
      this.data = data
      this.loading = false
    },
    searchReset() {
      const start = new Date()
      start.setTime(new Date().getTime() - 3600 * 1000 * 24 * 30)
      const startDate = dateFormat(start, 'yyyy-MM-dd')
      const endDate = dateFormat(new Date(), 'yyyy-MM-dd')
      this.searchForm.date = [startDate, endDate]
      this.searchForm.startDate = startDate
      this.searchForm.endDate = endDate
      this.loadData()
    },
    searchChange() {
      const { date, includeList } = this.searchForm
      this.searchForm.startDate = date[0]
      this.searchForm.endDate = date[1]
      this.searchForm.include = !!includeList.length
      this.loadData()
    },
    summaryMethod({ columns, data }) {
      const sums = []
      if (columns.length > 0) {
        columns.forEach((column, index) => {
          if ([0, 1].includes(index)) {
            sums[0] = '合计'
            sums[1] = '-'
          } else {
            const values = this.data.reduce((total, item) => total + Number(item[column.property]), 0)
            sums[index] = values
          }
        })
      }
      return sums
    },
    handleDown() {
      const { type = '0', startDate, endDate, include, serviceNetworkCode } = this.searchForm
      const url = this.downObj[type]
      this.$downloadFile(
        url,
        { startDate, endDate, include, serviceNetworkCode },
        'application/vnd.ms-excel',
        `${startDate}至${endDate}用工需求统计.xlsx`
      )
    }
  },
  mounted() {
    this.loadServiceNetwork()
  }
}
</script>
