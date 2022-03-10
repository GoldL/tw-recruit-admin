<template>
  <editor :id="id" :init="editorConfig" v-model="obj[keyName]" :disabled="disabled" class="my-editor"></editor>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import tinymce from 'tinymce/tinymce' // 要引入，但在vue中使用可以不去调用初始化的方法，即tinymce.init({})
import Editor from '@tinymce/tinymce-vue'

// 引入插件
import 'tinymce/plugins/image' // 图片上传
import 'tinymce/plugins/lists' // advlist插件扩展默认的list插件(要使用advlist必须也引入lists)
import 'tinymce/plugins/advlist' // 高级列表(即ul和ol)
import 'tinymce/plugins/code' // 编辑源码
import 'tinymce/plugins/fullscreen' // 全屏
import 'tinymce/plugins/paste' // 粘贴
import 'tinymce/plugins/preview' // 预览
import 'tinymce/plugins/wordcount' // 字数统计
import 'tinymce/plugins/nonbreaking' // 插入不间断的空格(解决按tab键后，光标会退出编辑器的问题)
import 'tinymce/plugins/autolink' // 自动链接，当用户输入完整有效的url时，会自动创建超链接
import 'tinymce/plugins/link' // 为选中内容添加超链接
import 'tinymce/plugins/table' // 表格
import './lineheight/plugin' // 行高
import './letterspacing/plugin' // 字间距
import './indent2em/plugin' // 首行缩进
import './ax_wordlimit/plugin' // 字数限制
import './media/plugin' // 视频上传
import { uploadUrl } from '@/api'

export default {
  props: {
    id: {
      // 如果同一个页面有多个富文本剪辑器，则需要传id
      type: String,
      default: 'tinymce'
    },
    obj: {
      // 编辑的对象(v-mode绑定的是obj[keyName])
      type: Object,
      required: true
    },
    keyName: {
      // 编辑的内容的键名(v-mode绑定的是obj[keyName])
      type: String,
      required: true
    },
    height: {
      // 富文本编辑器的高度
      type: String,
      default: '500px'
    },
    disabled: {
      // 是否禁止编辑
      type: Boolean,
      default: false
    },
    customConfig: {
      // 自定义配置参数
      type: Object,
      default: () => ({}) // 默认值: 空对象
    }
  },
  data() {
    return {
      init: {
        // 配置参数
        language_url: process.env.BASE_URL + 'cdn/zh_CN.js', // 中文包地址
        language: 'zh_CN',
        invalid_elements: 'section,aside,article', // 将这些标签设为无效元素，因为在这些标签里回车换行的话，预览或者发布后，换行都是不生效的
        skin_url: process.env.BASE_URL + 'tinymce/oxide', // 注意，oxide是一个文件夹，文件夹里必须包含skin.min.css和content.min.css，不能只有skin.min.css
        content_css: process.env.BASE_URL + 'tinymce/oxide/content.min.css', // 即使oxide文件夹里已经有content.min.css了，但是content_css属性仍然需要声明，指向content.min.css文件，否则打包上线后会报404错误
        theme_url: process.env.BASE_URL + 'tinymce/theme.min.js', // 主题，注意是js文件，theme.min.js
        content_style:
          'p { margin: 0; } p, h1, h2, h3, h4, h5, h6, td, th, div, ul, ol, li, table { line-height: 2; } img { max-width: 100%; }', // 直接为编辑区编写css
        height: this.height,
        plugins:
          'image lists advlist code fullscreen paste preview wordcount nonbreaking link autolink table lineheight letterspacing ax_wordlimit media indent2em', // 插件列表
        toolbar: [
          'fullscreen image media undo link | table bullist numlist | formatselect | fontsizeselect | bold italic underline strikethrough',
          'forecolor lineheight letterspacing | indent2em alignleft aligncenter alignright | code preview wordcount'
        ],
        paste_data_images: true, // 粘贴data格式的图像(支持ctrl+v粘贴图片)
        paste_auto_cleanup_on_paste: true, // 自动清理复制粘贴过来的文本样式
        nonbreaking_force_tab: true, // 插入不间断空格的额外配置(解决按tab键后，光标会退出编辑器的问题)
        branding: false, // 隐藏右下角技术支持文字
        fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px', // 字体大小选择
        menubar: false, // false: 隐藏顶部菜单栏
        convert_urls: false, // 配置不自动转换url(如果不配置的话，在域名相同的情况下，传入的url会自动将域名转为../)
        images_upload_handler: (blobInfo, success, failure, progress) => {
          // 上传图片处理函数
          this.uploadImg(blobInfo, success, failure, progress) // 自定义图片上传处理函数
        },
        file_picker_callback: (callback, value, meta) => {
          // 自定义文件上传处理函数
          this.uploadFile(callback, value, meta)
        },
        ax_wordlimit_num: 10000, // 限制字数
        ax_wordlimit_callback: this.showError, // 字数超出限制时的回调函数
        ax_wordlimit_delay: 3000 // 让超出字数限制时，执行回调函数的频率不那么快，3s执行一次
      }
    }
  },
  computed: {
    // 实际配置参数
    editorConfig() {
      return Object.assign(this.init, this.customConfig)
    }
  },
  methods: {
    /**
     * 自定义图片上传处理函数
     * blobInfo: 一个对象，对象里包含上传的文件的信息，blobInfo.blob()方法，得到的是File对象
     * success: 处理函数，如果图片上传成功，则向success方法里传入图片地址
     * failure: 处理函数，如果图片上传失败，则向failure方法里传入错误信息
     * progress: 上传进度条，progress(0)开始上传，progress(100)上传完成
     */
    async uploadImg(blobInfo, success, failure, progress) {
      if (blobInfo.blob().size >= 0) {
        progress(0)
        const formData = new FormData()
        formData.append('file', blobInfo.blob())
        const res = await this.$post(uploadUrl, formData)
        success(res.data.link)
        progress(100)
      } else {
        failure('图片上传失败')
      }
    },
    // 自定义文件上传函数
    uploadFile(callback, value, meta) {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      if (meta.filetype === 'image') {
        input.setAttribute('accept', 'image/png, image/jpg, image/jpeg, image/webp, image/bmp, image/gif')
      } else if (meta.filetype === 'media') {
        input.setAttribute(
          'accept',
          'video/x-ms-wmv, video/mpeg4, video/avi, video/wma, video/mp4, video/quicktime, video/x-flv, video/mpg, video/x-matroska'
        )
      }
      document.body.appendChild(input)
      input.onchange = async () => {
        const file = input.files[0]
        if (!file) {
          return
        }
        if (meta.filetype === 'image' && !this.isImage(file.type)) {
          this.$message.warning('您上传的图片格式不正确，请重新上传！')
          return
        }
        if (meta.filetype === 'media' && !this.isMedia(file.type)) {
          this.$message.warning('您上传的视频文件格式不正确，请重新上传！')
          return
        }
        const loading = this.$loading({
          lock: true,
          text: '正在上传中，请稍候...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.9)'
        })
        try {
          const formData = new FormData()
          formData.append('file', file)
          const res = await this.$post(uploadUrl, formData)
          loading.close()
          callback(res.data.link, { title: file.name })
          document.body.removeChild(input)
        } catch {
          loading.close()
        }
      }
      input.click()
    },
    // 是否是图片
    isImage(type) {
      return (
        type === 'image/png' ||
        type === 'image/jpg' ||
        type === 'image/jpeg' ||
        type === 'image/bmp' ||
        type === 'image/webp' ||
        type === 'image/gif'
      )
    },
    // 是否是媒体文件(视频文件这类)
    isMedia(type) {
      return (
        type === 'video/x-ms-wmv' ||
        type === 'video/mpeg4' ||
        type === 'video/avi' ||
        type === 'video/wma' ||
        type === 'video/mp4' ||
        type === 'video/quicktime' ||
        type === 'video/x-flv' ||
        type === 'video/mpg' ||
        type === 'video/x-matroska'
      )
    },
    // 字数超出限制提示函数
    showError(editor, txt, num) {
      this.$message.error('您已超出字数限制10000字，该文章将无法发布！')
    }
  },
  components: {
    Editor
  }
}
</script>

<style lang="scss">
/* 设置当编辑器开启全屏时的z-index */
body.tox-fullscreen .tox.tox-tinymce.tox-fullscreen {
  z-index: 5000;
}
/* 设置预览内容弹窗的宽高 */
.tox .tox-dialog-wrap {
  .tox-dialog--width-lg {
    width: 1250px;
    max-width: 1250px;
    height: 100vh;
  }
  .tox-dialog__body-content {
    max-height: 100%;
  }
}

.tox-tinymce-aux {
  z-index: 999999 !important;
}
</style>
