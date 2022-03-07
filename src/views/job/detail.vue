<template>
  <div>
    <Crumb :breakCrumb="breakCrumb" />
    <basic-container>
      <div class="page-title">招聘会详情</div>
      <section class="top">
        <div>
          <img :src="detail.photoUrl" alt width="200" height="110" />
          <div class="right">
            <div class="title">
              {{ detail.name }}
              <el-tag type="primary" class="type-tag type-tag1">{{ detail.type === '1' ? '线上' : '线下' }}</el-tag>
            </div>
            <div>
              <i class="el-icon-date u-m-r-10"></i>
              招聘会起止时间：{{ detail.startDate }} 至 {{ detail.endDate }}
            </div>
            <div v-if="detail.enrollDeadline">
              <i class="el-icon-time text-color-secondary u-m-r-10"></i>
              报名截止时间：{{ detail.enrollDeadline }}
            </div>
            <div v-if="detail.phone">
              <i class="el-icon-phone-outline text-color-secondary u-m-r-10"></i>
              工作人员联系方式：{{ detail.phone }}
            </div>
          </div>
        </div>
        <div v-if="['2', '3', '4', '5', '2,4'].includes(detail.conductStatus)" class="tc">
          <vue-qr :text="qrCodeUrl" :size="110" class="rdx-fr" />
          <div class="tips">手机扫码进入招聘会详情页面</div>
        </div>
      </section>
      <section v-if="detail.organizer">
        <h3 class="page-title">主办单位</h3>
        <div class="content rdx-m-b-40">{{ detail.organizer }}</div>
      </section>
      <section v-if="detail.undertake">
        <h3 class="page-title">承办单位</h3>
        <div class="content rdx-m-b-40">{{ detail.undertake }}</div>
      </section>
      <section v-if="detail.assistance">
        <h3 class="page-title">协办单位</h3>
        <div class="content rdx-m-b-40">{{ detail.assistance }}</div>
      </section>
      <div class="page-title">活动介绍</div>
      <div class="content" v-html="detail.introduce"></div>
    </basic-container>
  </div>
</template>

<script>
import { jobFairDetailUrl } from '@/api'
import Crumb from '@/components/Crumb'
import VueQr from 'vue-qr'

export default {
  components: { Crumb, VueQr },
  data() {
    return {
      detail: {},
      breakCrumb: [{ path: '/job/fair', name: '招聘会管理' }, { name: '招聘会详情' }]
    }
  },
  computed: {
    qrCodeUrl() {
      return `${process.env.VUE_APP_FAIR}${this.detail.id}`
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
      this.detail = data
    },
    handleBack() {
      this.$router.$avueRouter.closeTag()
      this.$router.back()
    },
    init() {
      const { id } = this.$route.params
      if (id === '-1') {
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

<style lang="scss" scoped>
.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  font-size: 14px;
  border-bottom: 1px solid $border-color;
  .right {
    display: inline-block;
    padding-left: 20px;
    line-height: 28px;
    .title {
      font-size: 18px;
      font-weight: 700;
    }
  }
}
.type-tag {
  line-height: 22px;
  height: 24px;
  font-weight: 500;
  &1 {
    background-color: rgba(64, 119, 244, 0.15);
    border: 1px solid rgba(64, 119, 244, 0.3);
  }
  &2 {
    background-color: rgba(250, 126, 0, 0.15);
    border: 1px solid rgba(250, 126, 0, 0.3);
  }
}
.content {
  font-size: 14px;
  white-space: pre-wrap;
}
.rdx-m-b-40 {
  margin-bottom: 40px;
}

.tips {
  margin-top: -10px;
  color: #666;
  font-size: 12px;
}
</style>
