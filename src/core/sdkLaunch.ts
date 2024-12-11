/* eslint-disable import/prefer-default-export */
import { isWechat } from '../libs/platform'
import { CallAppInstance } from '../index'
import { openAppInWX } from '../libs/sdk/index'
import { logError, logInfo } from '../libs/utils'

/**
 * native-sdk 方式 唤起, 根据不同运行时环境和目标app, 加载对应的 sdk
 * @param {Object} instance
 */
export const sdkLaunch = (instance: CallAppInstance) => {
  const { options } = instance
  const { callFailed = () => {}, callError = () => {} } = options
  try {
    if (isWechat) {
      // wx-js-sdk
      logInfo('isWXSDK', isWechat)
      openAppInWX(instance)
    } else {
      callError()
      logError('your platform do not support, please contact developer')
    }
  } catch (error) {
    callFailed()
  }
}
