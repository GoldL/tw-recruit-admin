<template>
  <basic-container>
    <div class="page-title">{{`${form.id ? '编辑': '创建'}招聘会`}}</div>
    <avue-form ref="form" v-model="form" :option="option" :upload-after="uploadAfter">
      <template slot="introduce">
        <tinymce-editor id="editor1" :obj="form" keyName="introduce" height="400px"></tinymce-editor>
      </template>
      <template slot="menuForm">
        <el-button type="primary" size="medium" @click="handleSubmit">提交</el-button>
        <el-button type="primary" size="medium" @click="handleTemporary">暂存</el-button>
        <el-button @click="handleBack" size="medium">取消</el-button>
      </template>
    </avue-form>
  </basic-container>
</template>

<script>
import { jobFairSubmitUrl, jobFairTemporaryUrl, jobFairDetailUrl, uploadUrl } from '@/api'
import { dateFormat } from '@/util/date'
import TinymceEditor from '@/components/Tinymce/Tinymce'

export default {
  components: { TinymceEditor },
  data() {
    return {
      form: { organizer: '厦门市劳动就业中心', undertake: '厦门市职业介绍服务中心', phone: '0592-5205519,0592-6530625' },
      option: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 160,
        column: [
          {
            label: '招聘会名称',
            prop: 'name',
            row: true,
            span: 12,
            rules: [{ required: true, message: '请填写招聘会名称', trigger: 'blur' }]
          },
          {
            label: '招聘会宣传图',
            prop: 'photoUrl',
            span: 24,
            type: 'upload',
            listType: 'picture-img',
            dataType: 'string',
            propsHttp: { res: 'data', name: 'fileName', url: 'link' },
            canvasOption: { ratio: 0.5, text: ' ' },
            accept: 'image/*,.pdf',
            tip: '请上传 宽度200px 高度110px 的 jepg/png/gif/bmp 图片',
            action: uploadUrl,
            rules: [{ required: true, message: '请上传招聘会宣传图', trigger: 'blur' }]
          },
          {
            label: '招聘会类型',
            prop: 'type',
            type: 'checkbox',
            value: '1',
            row: true,
            span: 12,
            dicData: [
              { label: '线上招聘会', value: '1' }
              // { label: '线下招聘会', value: '2' }
            ],
            rules: [{ required: true, message: '请选择招聘会类型', trigger: 'blur' }]
          },
          {
            label: '招聘会开始时间',
            prop: 'startDate',
            type: 'datetime',
            disabled: false,
            format: 'yyyy-MM-dd HH:mm',
            defaultTime: '09:00:00',
            valueFormat: 'yyyy-MM-dd HH:mm',
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() < new Date(Date.now() - 24 * 60 * 1000 * 60).getTime()
              }
            },
            rules: [{ required: true, message: '请选择招聘会开始时间', trigger: 'blur' }],
            change: ({ value }) => {
              if (value) {
                // 当用户选择了某个日期时，默认显示当天上午9点（用户可修改，若用户选择的日期为今日且当前时间已经超过9点，则默认显示为当前时间
                if (value.split(' ')[0] === dateFormat(new Date(), 'yyyy-MM-dd') && !this.form.id) {
                  if (new Date().getHours() >= 9 && !this.hasDo) {
                    this.$nextTick(() => {
                      this.hasDo = true
                      this.form.startDate = dateFormat(new Date(), 'yyyy-MM-dd hh:mm')
                      value = dateFormat(new Date(), 'yyyy-MM-dd hh:mm')
                    })
                  }
                }
                if (!this.form.id) {
                  const endDate = this.findObject(this.option.column, 'endDate')
                  const endDateValue = new Date(value).getTime() + 2 * 60 * 1000 * 60
                  this.form.endDate = dateFormat(new Date(endDateValue), 'yyyy-MM-dd hh:mm')
                  endDate.pickerOptions = {
                    disabledDate(time) {
                      return time.getTime() < new Date(new Date(value).getTime() - 24 * 60 * 1000 * 60).getTime()
                    }
                  }
                }
              }
            }
          },
          {
            label: '招聘会结束时间',
            prop: 'endDate',
            type: 'datetime',
            disabled: false,
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm',
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() < Date.now()
              }
            },
            rules: [
              { required: true, message: '请选择招聘会结束时间', trigger: 'blur' },
              {
                validator: (rule, value, callback) => {
                  if (!value) {
                    callback(new Error('请选择招聘会结束时间'))
                  } else if (new Date(this.form.startDate).getTime() - new Date(value).getTime() >= 0) {
                    callback(new Error('招聘会结束时间不能早于招聘会开始时间'))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              }
            ]
          },
          {
            label: '报名截止时间',
            prop: 'enrollDeadline',
            row: true,
            span: 12,
            disabled: false,
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          },
          {
            label: '招聘会结束后是否持续展示：',
            prop: 'endContinueShow',
            row: true,
            span: 12,
            labelWidth: 260,
            type: 'radio',
            value: false,
            dicData: [
              { label: '是', value: true },
              { label: '否', value: false }
            ],
            rules: [{ required: true, message: '请选择招聘会结束后是否持续展示：', trigger: 'blur' }],
            change: ({ value }) => {
              const statisticsType = this.findObject(this.option.column, 'statisticsType')
              const yesDtic = [
                { label: '统计招聘会有效时间内数据', value: 1 },
                { label: '统计所有数据', value: 2 }
              ]
              const noDict = [{ label: '统计招聘会有效时间内数据', value: 1 }]
              statisticsType.dicData = value ? yesDtic : noDict
              this.form.statisticsType = ''
              this.form.$statisticsType = ''
            }
          },
          {
            label: '招聘会统计类型',
            prop: 'statisticsType',
            type: 'select',
            value: 1,
            row: true,
            span: 12,
            dicData: [
              { label: '统计招聘会有效时间内数据', value: 1 },
              { label: '统计所有数据', value: 2 }
            ],
            rules: [{ required: true, message: '请选择招聘会统计类型', trigger: 'blur' }]
          },
          {
            label: '招聘会介绍',
            prop: 'introduce',
            component: 'AvueUeditor',
            span: 24,
            formslot: true,
            rules: [{ required: true, message: '请填写招聘会介绍', trigger: 'blur' }]
          },
          { label: '主办单位', prop: 'organizer', type: 'array', dataType: 'string' },
          { label: '承办单位', prop: 'undertake', type: 'array', dataType: 'string' },
          { label: '协办单位', prop: 'assistance', type: 'array', dataType: 'string' },
          { label: '工作人员联系方式', prop: 'phone', type: 'array', dataType: 'string' },
          {
            label: '是否显示',
            prop: 'display',
            span: 12,
            type: 'radio',
            value: true,
            dicData: [
              { label: '是', value: true },
              { label: '否', value: false }
            ]
          },
          {
            label: '是否置顶',
            prop: 'top',
            span: 12,
            type: 'radio',
            value: false,
            dicData: [
              { label: '是', value: true },
              { label: '否', value: false }
            ]
          }
        ]
      }
    }
  },
  watch: {
    $route() {
      this.init()
    }
  },
  methods: {
    async loadDetail(id) {
      const { data } = await this.$get(jobFairDetailUrl, { id })
      data.photoUrl = data.photo && data.photo.link
      data.photo = data.photo && data.photo.id
      this.form = data
      // 特殊处理，因为赋值的时候会执行change方法，需重新赋值
      const { statisticsType, startDate } = data
      this.$nextTick(() => {
        Object.assign(this.form, { statisticsType, startDate })
      })
      if (['4', '2,4', '5'].includes(data.conductStatus)) {
        // 已上线和已结束不允许修改时间
        const startDate = this.findObject(this.option.column, 'startDate')
        startDate.disabled = true
        const endDate = this.findObject(this.option.column, 'endDate')
        endDate.disabled = true
        const enrollDeadline = this.findObject(this.option.column, 'enrollDeadline')
        enrollDeadline.disabled = true
      }
    },
    async handleSubmit() {
      this.$refs.form.validate(async (vaild, done) => {
        if (vaild) {
          try {
            const { msg: message } = await this.$post(jobFairSubmitUrl, this.form)
            this.handleBack()
            this.$message({ type: 'success', message })
            done()
          } catch (e) {
            done()
            console.log(e)
          }
        }
      })
    },
    async handleTemporary() {
      const { msg: message } = await this.$post(jobFairTemporaryUrl, this.form)
      this.handleBack()
      this.$message({ type: 'success', message })
    },
    uploadAfter(res, done) {
      this.form.photo = res.id
      done()
    },
    handleBack() {
      this.$router.$avueRouter.closeTag()
      this.$router.back()
    },
    init() {
      const { id } = this.$route.params
      if (id === '-1') {
        this.$refs.form.resetForm()
        return
      }
      this.loadDetail(id)
    }
  },
  mounted() {
    this.init()
  }
}
</script>
