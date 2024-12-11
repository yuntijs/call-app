/**
 *
 * CallApp 类
 *
 */
import { generateDownloadUrl } from './core/download'
import { launch } from './core/launch'
import { sdkLaunch } from './core/sdkLaunch'
import {
  isAndroid,
  isIos,
  isQQBrowser,
  isQuark,
  isSougou,
  isUC,
  isWechat,
  isWeibo,
} from './libs/platform'
import { evokeByIFrame, evokeByLocation, evokeByTagA } from './libs/evoke'
import { copy, logError, logInfo, showMask } from './libs/utils'
import { Plugin, WechatConfig, CallAppOptions } from '../types';

const version = __VERSION__

export default class CallApp {
  options: CallAppOptions = {
    schemeUrl: '',
  }

  downloadLink?: string

  urlScheme?: string

  universalLink?: string

  wechatConfig?: WechatConfig | (() => Promise<WechatConfig>)

  version?: string

  installedPlugins?: any

  // Create an instance of CallApp
  constructor(options?: CallAppOptions) {
    options && this.init(options)
  }

  init(options: CallAppOptions) {
    this.version = version
    this.options = options
    this.downloadLink = generateDownloadUrl(this)
    this.urlScheme = options.schemeUrl
    this.universalLink = options.universalLink
    this.wechatConfig = options.wechatConfig
  }

  /**
   * 触发唤起
   */
  start(options?: CallAppOptions) {
    options && this.init(options)

    const { callStart } = this.options
    callStart && callStart(this)

    if (isWechat && this.options.wechatConfig) {
      // by native-app js-sdk launch
      sdkLaunch(this)
    } else {
      // by deepLinks/appLinks launch
      launch(this)
    }
  }

  /**
   * 触发下载
   */
  download(options?: CallAppOptions) {
    options && this.init(options)

    const { callDownload } = this.options

    callDownload && callDownload()

    logInfo('downloadLink', this.downloadLink)

    copy(`1.0$$${this.urlScheme}`)

    if (this.downloadLink) {
      // 个别浏览器 evoke方式 需要单独处理, 防止页面跳转到下载链接 展示异常
      if (isAndroid && isUC && isQQBrowser) {
        return evokeByTagA(this.downloadLink)
      }

      if (isIos && isQuark) {
        return evokeByIFrame(this.downloadLink)
      }

      if (isWeibo || (isIos && isSougou)) {
        return showMask()
      }

      return evokeByLocation(this.downloadLink)
    }

    logError('please check downloadConfig, middleWareUrl or landingPage in options')
  }

  /**
   * plugins
   */
  use(plugin: Plugin, options: any[]): this {
    if (!this.installedPlugins) this.installedPlugins = new Set()

    const { installedPlugins } = this

    if (installedPlugins.has(plugin)) {
      logError(`Plugin has already been applied`)
    } else if (typeof plugin === 'function') {
      installedPlugins.add(plugin)
      plugin(this, ...options)
    }

    return this
  }
}

export * as utils from './libs/platform'
