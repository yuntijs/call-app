import CallApp from '../src'

window.__callAppDev__ = true

try {
  // 检测 m 端是否支持 vue/es6 // 后面考虑 升级脚手架支持vue/react
  // throw Error('')
  initVuePage()
} catch (error) {
  console.error(error)
}

function initVuePage() {
  const { createApp, onMounted, reactive, watch } = Vue || window.Vue

  createApp({
    template: `
      <div class="wrap">
        <section class="config">
          <div class="display-info">
            <h3 style="height: 10px;font-size: 14px;">参数配置项</h3>
            <div class="config-item">
              <span>schemeUrl:</span>
              <input type="text" v-model="state.schemeUrl"/>
            </div>
            <div class="config-item">
              <span>universalLink:</span>
              <input type="text" v-model="state.universalLink"/>
            </div>
            <div class="config-item">
              <span>middleWareUrl:</span>
              <input type="text" v-model="state.middleWareUrl"/>
            </div>
            <div class="config-item">
              <span>downloadConfig:</span>
              <textarea rows="12" v-model="state.downloadConfig"/>
            </div>
            <div class="config-item">
              <span>landingPage:</span>
              <input type="text" v-model="state.landingPage"/>
            </div>
            <div class="config-item">
              <span>wechatConfig:</span>
              <textarea rows="8" v-model="state.wechatConfig"/>
            </div>
          </div>
        </section>
        <section class="start">
          <button @click="openApp" >唤起app</button>
          <div class="display-info">
            <span>urlScheme:</span>
            <textarea type="textarea" v-model="state.urlScheme"></textarea>
            <span>universalLink:</span>
            <textarea rows="3" cols="20" wrap="hard" type="textarea" v-model="state.universalLink"></textarea>
          </div>
        </section>
        <section class="download">
          <button @click="handleDownload" >下载app</button>
          <div class="display-info">
            <span>downloadLink:</span>
            <textarea type="textarea" rows="3" cols="20" wrap="hard" v-model="state.downloadLink"></textarea>
          </div>
        </section>
      </div>
    `,
    setup() {
      let callApp

      const hooks = {
        callStart: function () {
          console.log('--- trigger --- hook:callStart ')
        },
        callFailed: function () {
          console.log('--- trigger --- hook:callFailed ')
        },
        callSuccess: function () {
          console.log('--- trigger --- hook:callSuccess ')
        },
        callDownload: function () {
          console.log('--- trigger --- hook:callDownload ')
        },
        callError: function () {
          console.log('--- trigger --- hook:callError ')
        },
      }
      const { callStart, callSuccess, callFailed, callDownload, callError } = hooks

      onMounted(() => {
        console.log('demo onMounted')
      })
      //
      var state = reactive({
        schemeUrl: 'banya://art.botnow.cn/activity_details?id=9a884657-1393-4d4c-820a-8aeb68f9efea',
        universalLinkInput: 'https://art.botnow.cn/apple-app-site-association/activity_details?id=9a884657-1393-4d4c-820a-8aeb68f9efea',
        middleWareUrl: 'https://banya.art/m/download',
        downloadConfig: JSON.stringify({
          "ios": "https://apps.apple.com/cn/app/%E4%BC%B4%E5%91%80/id6737547648",
          "android": "https://cdn.botnow.cn/banya/packages/android/banya.0.8.6.apk",
          "android_yyb": "https://a.app.qq.com/o/simple.jsp?pkgname=com.botnow.banya"
        }, null, 2),
        landingPage: '',
        urlScheme: '',
        downloadLink: '',
        universalLink: '',
        wechatConfig: JSON.stringify({
          debug: true,
          "appId": "wx2ec224cec46d662a",
          "nonceStr": "rUjIqs0I3my41ayM",
          "timestamp": 1733899081,
          "signature": "effe4c834f44a38edf3e010bb52d2c2c5407f1a1"
        }, null, 2),
      })

      watch(
        function () {
          return state
        },
        function (opts) {
          var downloadConfig = {}
          var wechatConfig = {}
          try {
            downloadConfig = JSON.parse(opts.downloadConfig)
            wechatConfig = JSON.parse(opts.wechatConfig)
          } catch (error) {
            console.error('parse downloadConfig failed', error)
          }
          callApp = window.callApp = new CallApp({
            schemeUrl: opts.schemeUrl,
            universalLink: opts.universalLinkInput,
            middleWareUrl: opts.middleWareUrl,
            downloadConfig: downloadConfig,
            landingPage: opts.landingPage,
            wechatConfig: wechatConfig,
            callStart,
            callSuccess,
            callFailed,
            callDownload,
            callError,
          })

          console.log('callApp', callApp)
          //
          state.downloadLink = callApp.downloadLink || ''
          state.urlScheme = callApp.urlScheme || ''
          state.universalLink = callApp.universalLink || ''
        },
        {
          deep: true,
          immediate: true,
        }
      )

      const openApp = function () {
        console.log(
          window.navigator.userAgent,
          '\n',
          window.navigator.appVersion,
          '\n',
          window.navigator.appName
        )

        console.log('trigger start')
        console.log('state =>', JSON.stringify(state, null, 2))
        callApp.start()
        state.downloadLink = callApp.downloadLink || ''
        state.urlScheme = callApp.urlScheme || ''
        state.universalLink = callApp.universalLink || ''
      }
      //
      const handleDownload = function () {
        console.log('trigger download')

        callApp.download()

        state.downloadLink = callApp.downloadLink || ''
        state.urlScheme = callApp.urlScheme || ''
        state.universalLink = callApp.universalLink || ''
      }

      return {
        openApp,
        handleDownload,
        state,
      }
    },
  }).mount('#app')
}
