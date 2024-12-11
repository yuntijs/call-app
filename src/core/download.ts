/**
 * 下载处理中心
 * download-config-center && generate download-url
 */
import { isAndroid, isIos, isWechat } from '../libs/platform'
import { CallAppOptions } from '../index'

export interface CallAppInstance {
  options: CallAppOptions
  start: () => void
  download: () => void
  downloadLink?: string
  urlScheme?: string
  universalLink?: string
  intentLink?: string
}


// 构造 下载链接 (不同平台环境  需要兼容处理)
export const generateDownloadUrl = (instance: CallAppInstance): string => {
  // 第三方配置
  const {
    options: { downloadConfig, landingPage, middleWareUrl},
  } = instance

  if (landingPage) return landingPage;
  if (downloadConfig) {
    if (isIos) {
      return downloadConfig?.ios || ''
    }
    if (isWechat && isAndroid) {
      return downloadConfig?.android_yyb || ''
    }
    return downloadConfig?.android || ''
  }
  return middleWareUrl || ''
}
