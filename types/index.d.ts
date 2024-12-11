export type Plugin = (app: CallAppInstance, ...options: any[]) => any
export interface DownloadConfig {
  // 苹果市场
  ios: string
  // 安卓市场
  android: string
  android_api?: string
  // 应用宝
  android_yyb: string
  // api
  api?: string
}

export interface WechatConfig {
  appId: string
  timestamp: string
  nonceStr: string
  signature: string
  debug?: boolean
  // 所需跳转的移动应用的AppID
  launchAppId: string
  [key: string]: any
}

export interface CallAppOptions {
  // url-scheme 地址，必选
  schemeUrl: string
  // universal-link 地址，可选，ios 优先采用 universal-link
  universalLink?: string
  // 下载中间页 url
  middleWareUrl?: string
  // 触发下载 延迟检测时间, 默认 2500
  delay?: number
  // 下载配置， 可选，不传则采用 landingPage
  downloadConfig?: {
    // app-store 链接
    ios: string
    // apk 下载链接
    android: string
    // 应用宝 下载链接
    android_yyb: string
  }
  // 唤起失败落地页，一般是下载页面，可选，与 downloadConfig 二选一，都不指定时使用 middleWareUrl
  landingPage?: string
  // 微信 js sdk 配置，用于在微信中通过 launchApplication 的方式唤起 app
  wechatConfig?: WechatConfig | (() => Promise<WechatConfig>)
  // 微信端初始化检测安装后的回调函数
  onWechatReady?: (...arg: any[]) => void
  // 失败 hook
  callFailed?: () => void
  // 成功 hook
  callSuccess?: () => void
  // 开始唤起 hook
  callStart?: (ctx: CallAppInstance) => void
  // 开始下载 hook
  callDownload?: () => void
  // 出错 hook
  callError?: () => void
}

export interface CallAppInstance {
  options: CallAppOptions
  start: () => void
  download: () => void
  downloadLink?: string
  urlScheme?: string
  universalLink?: string
}
