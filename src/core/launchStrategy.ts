import { CallAppInstance } from 'types'
import {
  isQQ,
  isWeibo,
  isQzone,
  isAndroid,
  isIos,
  isQQBrowser,
  isBaidu,
  isOriginalChrome,
  isWechat,
  isQuark,
  isLow9Ios,
  isLow7WX,
  // isThan12Ios,
} from '../libs/platform'
import { evokeByTagA, evokeByIFrame, evokeByLocation, checkOpen } from '../libs/evoke'
import { logInfo, showMask } from '../libs/utils'

let tempIosPlatRegList: any = null
// 获取方法
export const getIosPlatRegList = (ctx: CallAppInstance) => {
  if (!tempIosPlatRegList) {
    tempIosPlatRegList = getDefaultIosPlatRegList(ctx);
  }
  return tempIosPlatRegList;
}

// 扩展方法
export const addIosPlatReg = (ctx: CallAppInstance, item: Record<string, any>) => {
  if (item) {
    const list = getDefaultIosPlatRegList(ctx)
    list.splice(-1, 0, item as any)
    tempIosPlatRegList = [...list]
  }
  return tempIosPlatRegList
}

export const getDefaultIosPlatRegList = (ctx: CallAppInstance) => {
  const { options, urlScheme: schemeURL, universalLink } = ctx
  const {
    callFailed = () => {},
    callSuccess = () => {},
    callError = () => {},
    delay = 2500,
  } = options
  const universal = !!options.universalLink;

  const handleCheck = (delay = 2500) =>
    checkOpen(
      () => {
        callFailed()
        ctx.download()
      },
      callSuccess,
      callError,
      delay
    )

  return [
    {
      name: 'wxSub',
      platReg: () => isWechat && isLow7WX,
      handler: (instance: CallAppInstance) => {
        console.log(instance)
        logInfo('isIos - isWechat < 7.0.5', isIos && isWechat && isLow7WX)
        showMask()
        callFailed()
      },
    },
    {
      name: 'low9',
      platReg: () => isLow9Ios,
      handler: () => {
        handleCheck(3000)
        schemeURL && evokeByIFrame(schemeURL)
      },
    },
    {
      name: 'bd',
      platReg: () => !universal && isBaidu,
      handler: () => {
        handleCheck(3000)
        showMask()
      },
    },
    {
      name: 'weibo',
      platReg: () => !universal && (isWeibo || isWechat),
      handler: () => {
        showMask()
        callFailed()
      },
    },
    {
      name: 'qq',
      platReg: () => !universal || isQQ || isQQBrowser || isQzone,
      handler: () => {
        handleCheck(3000)
        schemeURL && evokeByTagA(schemeURL)
      },
    },
    {
      name: 'quark',
      platReg: () => isQuark,
      handler: () => {
        handleCheck(3000)
        schemeURL && evokeByTagA(schemeURL)
      },
    },
    {
      name: 'ul',
      platReg: () => isIos,
      handler: () => {
        handleCheck(delay)
        universalLink && evokeByLocation(universalLink)
      },
    },
  ]
}

export const getDefaultAndroidPlatRegList = (ctx: CallAppInstance) => {
  const { options, urlScheme: schemeURL, downloadLink } = ctx
  const {
    callFailed = () => {},
    callSuccess = () => {},
    callError = () => {},
    delay = 2500,
  } = options

  const handleCheck = (delay = 2500) =>
    checkOpen(
      () => {
        callFailed()
        ctx.download()
      },
      callSuccess,
      callError,
      delay
    )

  return [
    {
      name: 'chrome',
      platReg: () => isOriginalChrome,
      handler: () => {
        handleCheck(delay)
        // app-links 无法处理 失败回调， 原因同 universal-link
        schemeURL && evokeByLocation(schemeURL)
      },
    },
    {
      name: 'wx',
      platReg: () => isWechat,
      handler: () => {
        const yyb = options.downloadConfig?.android_yyb;
        if (yyb) {
          evokeByLocation(yyb);
        } else {
          showMask()
          callFailed()
        }
      }
    },
    {
      name: 'browser',
      platReg: () => isBaidu || isWeibo || isQzone,
      handler: () => {
        // 不支持 scheme, 显示遮罩 请在浏览器打开
        showMask()
        callFailed()
      },
    },
    {
      name: 'android',
      platReg: () => isAndroid,
      handler: () => {
        handleCheck(delay)
        schemeURL && evokeByLocation(schemeURL)
      },
    },
  ]
}

let tempAndroidPlatRegList: any = null
// 获取方法
export const getAndroidPlatRegList = (ctx: CallAppInstance) => {
  if (!tempAndroidPlatRegList) {
    tempAndroidPlatRegList = getDefaultAndroidPlatRegList(ctx)
  }
  return tempAndroidPlatRegList;
}
