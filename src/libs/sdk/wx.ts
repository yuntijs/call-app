import { CallAppInstance } from 'types';
import { dependencies } from '../config'
import { loadJSArr, logError, logInfo } from '../utils'

export const loadWXSDK = () => {
  return new Promise(resolve => loadJSArr([dependencies.WX_JWEIXIN.link], () => resolve({})));
}

export const prepareWXSdk = async (instance: CallAppInstance) => {
  const { options } = instance
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
      jsApiList: conf?.jsApiList || [],
      openTagList: conf?.openTagList || ['wx-open-launch-app'],
    }
    if (window.wx) {
      window.wx.config(wxconfig)
    }
    window.wx.ready(() => {
      logInfo('WXSDK ready')
      onWechatReady(window.WeixinJSBridge)
    })
    window.wx.error((res: unknown) => {
      logError('wx js sdk error =>', res);
    });
  } catch (e) {
    logInfo('WXSDK error', e)
    callFailed()
  }
}
