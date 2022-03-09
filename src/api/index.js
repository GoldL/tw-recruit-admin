const baseUrl = '/tw-recruit-api/blade-tw-recruit/administrator/'

// 字典
export const dictUrl = '/tw-recruit-api/blade-system/dict-biz/list?code='
// 上传附件
export const uploadUrl = '/tw-recruit-api/blade-resource/oss/endpoint/put-file'

/** 岗位 */
// 岗位 - 列表
export const postPageUrl = `${baseUrl}post/page`
// 岗位 - 批量审核
export const postAuditBatchUrl = `${baseUrl}post/auditBatch`
// 岗位 - 详情
export const postDetailUrl = `${baseUrl}post/detail`

/** 招聘管理 */
// 招聘会管理 - 列表
export const jobFairPageUrl = `${baseUrl}jobFair/page`
// 招聘会管理 - 提交
export const jobFairSubmitUrl = `${baseUrl}jobFair/submit`
// 招聘会管理 - 暂存
export const jobFairTemporaryUrl = `${baseUrl}jobFair/temporary`
// 招聘会管理 - 发布
export const jobFairPublishUrl = `${baseUrl}jobFair/publish`
// 招聘会管理 - 撤销
export const jobFairCancelUrl = `${baseUrl}jobFair/cancel`
// 招聘会管理 - 详情
export const jobFairDetailUrl = `${baseUrl}jobFair/detail`
// 招聘会管理 - 删除
export const jobFairRemoveUrl = `${baseUrl}jobFair/remove`
// 招聘会管理 - 修改名称
export const jobFairUpdateNameUrl = `${baseUrl}jobFair/updateName`
// 招聘会管理 - 获取招聘会进行中状态数量
export const jobFairCountUrl = `${baseUrl}jobFair/getConductStatusCount`
// 招聘会管理 - 修改招聘会是否显示
export const updateDisplayUrl = `${baseUrl}jobFair/updateDisplay`
// 招聘会管理 - 修改招聘会是否置顶
export const updateTopUrl = `${baseUrl}jobFair/updateTop`

// 招聘会审核 - 列表
export const jobFairApprovalPageUrl = `${baseUrl}jobFair/approval/page`
// 招聘会审核 - 提交
export const jobFairApprovalSubmitUrl = `${baseUrl}jobFair/approval/submit`
// 招聘会审核 - 详情
export const jobFairApprovalDetailUrl = `${baseUrl}jobFair/approval/detail`
// 招聘会审核 - 待审核数量
export const jobFairApprovalCountUrl = `${baseUrl}jobFair/approval/getAuditCount`

// 招聘会线上统计列表
export const statisticsOnlineListUrl = `${baseUrl}jobFair/statistics/onlineList`
// 招聘会线上统计登记明细列表
export const onLineResisterPostPageUrl = `${baseUrl}jobFair/statistics/onlineResisterPostPage`
// 招聘会线下统计列表
export const statisticsOfflineListUrl = `${baseUrl}jobFair/statistics/offlineList`
// 招聘会线下统计登记明细列表
export const offLineResisterPostPageUrl = `${baseUrl}jobFair/statistics/offlineResisterPostPage`
// 线下招聘会更新意向人数
export const offlineUpdateIntentionNumUrl = `${baseUrl}jobFair/statistics/offlineUpdateIntentionNum`

// 线下招聘会更新意向人数
export const postStatListUrl = `${baseUrl}post/statistics/list`

// 导出招聘会线上统计列表
export const statisticsOnlineListExportUrl = `${baseUrl}export/jobFair/statistics/onlineList`
// 导出招聘会线上统计登记明细列表
export const onLineResisterPostExportUrl = `${baseUrl}export/jobFair/statistics/onlineResisterPostList`
// 导出招聘会线下统计列表
export const statisticsOfflineListExportUrl = `${baseUrl}export/jobFair/statistics/offlineList`
// 导出招聘会线下统计登记明细列表
export const offLineResisterPostExportUrl = `${baseUrl}export/jobFair/statistics/offlineResisterPostList`
// 导出用工需求统计列表
export const postListExportUrl = `${baseUrl}export/post/statistics/list`

// 归档统计列表
export const filingPageUrl = `${baseUrl}post/statistics/filingPage`
// 获取单位招聘登记数统计
export const recruitRegistListUrl = `${baseUrl}post/statistics/listCompanyRecruitRegister`
// 获取摊位统计
export const stallCountListUrl = `${baseUrl}post/statistics/listStallCount`
// 获取入场求职人数统计
export const entranceRecruitListUrl = `${baseUrl}post/statistics/listEntranceRecruit`
// 导出单位招聘登记数明细
export const recruitRegistExportUrl = `${baseUrl}export/system/listCompanyRecruitRegisterDetail`
// 导出摊位明细
export const stallCountExportUrl = `${baseUrl}export/system/listStallDetail`
// 导出入场求职人数明细
export const entranceRecruitExportUrl = `${baseUrl}export/system/listEntranceRecruitDetail`

/** 门户-内容管理 */
// 咨询中心 - 分页列表
export const informationPageUrl = `${baseUrl}portal/information/page`
// 咨询中心 - 保存或更新
export const informationSaveUrl = `${baseUrl}portal/information/save`
// 咨询中心 - 详情
export const informationDetailUrl = `${baseUrl}portal/information/detail`
// 咨询中心 - 删除
export const informationDelUrl = `${baseUrl}portal/information/remote`

// 轮播图 - 分页列表
export const slideshowPageUrl = `${baseUrl}portal/slideshow/page`
// 轮播图 - 保存或更新
export const slideshowSaveUrl = `${baseUrl}portal/slideshow/save`
// 轮播图 - 详情
export const slideshowDetailUrl = `${baseUrl}portal/slideshow/detail`
// 轮播图 - 删除
export const slideshowDelUrl = `${baseUrl}portal/slideshow/remote`

// 主管单位管理 - 保存或更新
export const orgSaveUrl = `${baseUrl}portal/competentOrganization/save`
// 主管单位管理 - 详情
export const orgDetailUrl = `${baseUrl}portal/competentOrganization/detail`

// 友情链接 - 分页列表
export const linkPageUrl = `${baseUrl}portal/link/list`
// 友情链接 - 保存或更新
export const linkSaveUrl = `${baseUrl}portal/link/save`
// 友情链接 - 详情
export const linkDetailUrl = `${baseUrl}portal/link/detail`
// 友情链接 - 删除
export const linkDelUrl = `${baseUrl}portal/link/remote`

// 联系我们 - 保存或更新
export const contactUsSaveUrl = `${baseUrl}portal/contactUs/save`
// 联系我们 - 详情
export const contactUsDetailUrl = `${baseUrl}portal/contactUs/detail`
