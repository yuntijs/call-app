import { CallAppInstance, WechatConfig } from 'types';
import { dependencies } from '../config'
import { evokeByLocation } from '../evoke'
import { loadJSArr, logError, logInfo } from '../utils'

export const loadWXSDK = () => {
  return new Promise(resolve => loadJSArr([dependencies.WX_JWEIXIN.link], () => resolve({})));
}

// 调用微信 sdk api 回调
export const invokeInWX = (
  name: string,
  options: Record<string, any>,
  app: Record<string, any>
) => {
  return new Promise((resolve, reject) => {
    app.invoke(name, options, (data: any) => {
      logInfo('invokeInWX', data)
      const { err_msg } = data
      const Regex = /(:ok)|(:yes)/g
      if (Regex.test(err_msg)) {
        resolve({
          code: 0,
        })
      } else {
        reject({ code: -1 })
      }
    })
  })
}

const _openAppInWX = (
  schemeURL: string,
  instance: CallAppInstance,
  app: Record<string, any>,
  conf: WechatConfig,
) => {
  const { options, downloadLink = '', universalLink = '' } = instance
  const { callFailed = () => {}, callSuccess = () => {} } = options
  const appID = conf.launchAppId;
  const parameter = schemeURL
  const extInfo = schemeURL

  const handleByuLink = (cb: () => void, delay = 2000) => {
    universalLink && evokeByLocation(universalLink)
    setTimeout(() => {
      cb()
    }, delay)
  }

  invokeInWX('launchApplication', { appID, parameter, extInfo }, app)
    .then((res) => {
      logInfo('launchApplication', res)
      callSuccess()
    })
    .catch((err) => {
      // sdk 失败则降级采用 uLink 尝试唤起
      handleByuLink(() => {
        logError('launchApplication', err)
        callFailed()
        downloadLink && evokeByLocation(downloadLink)
      })
    })
}

export const openAppInWX = async (instance: CallAppInstance) => {
  const { options, urlScheme = '' } = instance
  const { callFailed = () => {}, onWechatReady = () => {} } = options
  try {
    await loadWXSDK()
    const { wechatConfig } = instance.options;
    const conf = typeof wechatConfig === 'function'
      ? (await wechatConfig())
      : wechatConfig;
    const wxconfig = {
      debug: conf?.debug,
      appId: conf?.appId,
      timestamp: conf?.timestamp,
      nonceStr: conf?.nonceStr,
      signature: conf?.signature,
      // jsApiList: ['launchApplication', 'getInstallState'],
      jsApiList: ['launchApplication'],
      openTagList: ['wx-open-launch-app'],
    }
    if (window.wx) {
      window.wx.config(wxconfig)
    }
    window.wx.ready(() => {
      logInfo('WXSDK ready')
      onWechatReady(window.WeixinJSBridge)
      // 实例化APP对象
      let app = window.WeixinJSBridge
      _openAppInWX(urlScheme, instance, app, conf)
    })
  } catch (e) {
    logInfo('WXSDK error', e)
    callFailed()
  }
}
