# 简介

> 基于转转 call-app 改造，去除内置的转转系 app，支持在微信中通过 launchApplication 唤起 app

`call-app` 是一个通用的唤起 app 的 sdk, 支持唤起多个 app, 兼容主流浏览器、webview，并支持用户自定义唤起配置。

## 快速上手

### Step1：安装依赖

```
npm i @yuntijs/call-app
```

### Step2：引入

```js
import CallApp from '@yuntijs/call-app'
```

如果是通过外链 js 引入，那么可以使用 `window.CallApp` 得到 `CallApp` 类

### Step3：使用

实例化 `CallApp` 后，即可使用 `start` 和 `download` 方法.

```javascript
// 实例化
const callApp = new CallApp({
  schemeUrl: '', // 要唤起目标 app 的 scheme url
})
// 执行 唤起方法
callApp.start()
// 执行 下载
callApp.download()
```
或者
```javascript
// 实例化
const callApp = new CallApp()
// 执行 唤起方法
callApp.start({
  schemeUrl: '', // 要唤起目标 app 的 path ，默认目标app是转转
})
// 执行 下载
callApp.download()
```
#### 参数配置项

- **schemeUrl** `String`  scheme uri 地址
- **universalLink** `String` universal-link链接，可选，ios 会优先采用 universal-link
- **middleWareUrl** `String` 中转 url，如为空则默认跳转下载安装包或 appstore
- **downloadConfig** `Object`  下载配置，可选，不传则采用 landingPage
  - **ios**  `String`  app-store 链接
  - **android** `String`  apk下载链接
  - **android_yyb** `String` 应用宝 下载链接
- **landingPage** `String` 唤起失败落地页，一般是下载中间页，优先级高于 `downloadConfig`
- **delay** `Number` 调起app失败后触发下载延迟, 默认 2500（毫秒）
- **wechatConfig** `Object` 微信 js sdk 配置，用于在微信中通过 launchApplication 的方式唤起 app, 详见 https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#1
  - **debug** `String` 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  - **appId** `String` 必填，公众号的唯一标识
  - **timestamp** `String` 必填，生成签名的时间戳
  - **nonceStr** `String` 必填，生成签名的随机串
  - **signature** `String` 必填，签名
- **callStart** `Function` 开始执行调起时的hook
- **callSuccess** `Function` 执行调起成功时的hook
- **callFailed** `Function` 执行调起失败时的hook
- **callDownload** `Function` 执行下载时的hook
- **callError** `Function` 内部异常时的hook
- **onWechatReady** `Function` 微信端sdk初始化成功后的回调

#### api 方法

- **start** `Function` 唤起功能

```js
// 挂在CallApp实例上的方法
// options 可选 配置同上
const callApp = new CallApp()
callApp.start(options)
```

- **download** `Function`  下载功能

```js
// 挂在CallApp实例上的方法
// options 可选 配置同上
const callApp = new CallApp()
callApp.download(options)
```

## 示例用法

##### 1. 基础使用

```javascript
// 唤起支付宝
const callApp = new CallApp({
  schemeUrl: 'alipay://platformapi/startapp?appId=20000056', // 支付宝转账
  landingPage: 'https://render.alipay.com/p/s/i', // 支付宝落地页（下载页）
  callStart: () => {
    console.log('触发 开始唤起钩子')
  },
  callSuccess: () => {
    console.log('触发 唤起成功钩子')
  },
  callFailed: () => {
    console.log('触发 唤起失败钩子')
  },
})

callApp.start()
```

##### 2. 插件配置（高阶）
提供 use 方法, 方便用户插入 js 或者 自定义 CallApp 实例内部方法。并支持链式调用。

使用示例：
```javascript
const callApp = new CallApp(options)

callApp.use(function PluginA(app, optsA) {
  const old = app.start

  app.start = function() {
    //
    old.call(app) // 或者 old.call(app, options)
  }
}).use(function PluginB(app, optsB) {
  //

})
```

## 兼容性 😈

### H5
#### ios: [iphoneXR]


| 环境          | 下载          | scheme/ulink 唤起(已装 app) | 失败回调(已装 app) | 成功回调(已装 app)       | 失败回调(未装 app) |
| ------------- | ------------- | --------------------------- | ------------------ | ------------------------ | ------------------ |
| safari        | 支持 location | ulink 支持                  | 不支持             | 支持                     | ulink不支持        |
| qq 浏览器     | 支持 location | ulink 支持                  | 支持               | 支持                     | ulink不支持        |
| uc 浏览器     | 支持 location | ulink 支持                  | 支持               | ulink支持, scheme 不支持 | ulink不支持        |
| 百度浏览器    | 支持 location | ulink 支持, scheme 不支持   | 支持               | ulink支持 scheme 不支持  | ulink不支持        |
| 夸克浏览器    | 支持 iFrame   | 不支持 ulink，支持 scheme   | 支持               | 支持                     | 支持               |
| 谷歌浏览器    | 支持 location | ulink 支持                  | 支持               | 支持                     | ulink不支持        |
| sougou 浏览器 | 不支持        | ulink 支持                  | 支持               | 支持                     | ulink不支持        |
| wx            | 支持，应用宝  | ulink 支持, scheme 不支持   | 支持               | 支持                     | ulink不支持        |
| weibo         | 不支持        | ulink 支持, scheme 不支持   | 支持               | ulink支持,scheme 不支持  | ulink不支持        |
| qq            | 支持, 应用宝  | ulink 支持                  | 支持               | 支持                     | 支持               |

#### android: [huawei-p30]


| 环境          | 下载          | scheme 唤起(已装 app) | 失败回调(已装 app) | 成功回调(已装 app) | 失败回调(未装 app) |
| ------------- | ------------- | --------------------- | ------------------ | ------------------ | ------------------ |
| qq 浏览器     | 支持 location | 支持                  | 支持               | 支持               | 支持               |
| uc 浏览器     | 支持 tagA     | 支持                  | 支持               | 支持               | 支持               |
| 百度浏览器    | 支持 location | 不支持                | 支持               | 不支持             | 支持               |
| 夸克浏览器    | 支持 location | 支持                  | 支持               | 支持               | 支持               |
| sougou 浏览器 | 支持 location | 支持                  | 支持               | 支持               | 支持               |
| 360 浏览器    | 支持 location | 支持                  | 支持               | 支持               | 支持               |
| 华为浏览器    | 支持 location | 支持                  | 支持               | 支持               | 支持               |
| wx            | 支持，应用宝  | 不支持                | 支持               | 不支持             | 支持               |
| weibo         | 不支持        | 不支持                | 支持               | 不支持             | 支持               |
| qq            | 支持, 应用宝  | 支持                  | 支持               | 支持               | 支持               |

#### android: [mi-9]


| 环境       | 下载          | scheme 唤起(已装 app) | 失败回调(已装 app) | 成功回调(已装 app) | 失败回调(未装 app) |
| ---------- | ------------- | --------------------- | ------------------ | ------------------ | ------------------ |
| qq 浏览器  | 支持 location | 支持                  | 支持               | 支持               | 支持               |
| uc 浏览器  | 支持 tagA     | 支持                  | 支持               | 支持               | 支持               |
| 百度浏览器 | 支持 location | 不支持                | 支持               | 不支持             | 支持               |
| 夸克浏览器 | 支持 location | 支持                  | 支持               | 支持               | 支持               |
| 360 浏览器 | 支持 location | 支持                  | 支持               | 支持               | 支持               |
| 小米浏览器 | 支持 location | 支持                  | 支持               | 支持               | 支持               |
| wx         | 支持，应用宝  | 不支持                | 支持               | 不支持             | 支持               |
| weibo      | 不支持        | 不支持                | 支持               | 不支持             | 支持               |
| qq         | 支持，应用宝  | 支持                  | 支持               | 支持               | 支持               |

### native sdk

#### ios / android


|                         | 转转 | 采货侠 | 找靓机 | 卖家版 | 58app | 微信 |
| ----------------------- | ---- | ------ | ------ | ------ | ----- | ---- |
| 目标app: 转转           | x    | ✅      | ✅      | ✅      | ✅     | ✅    |
| 目标app: 采货侠         | ✅    | x      | x      | x      | x     | x    |
| 目标app: 找靓机         | ✅    | x      | x      | x      | x     | x    |
| 目标app: 卖家版(已下架) | ✅    | x      | x      | x      | x     | x    |


---


### 公开文章
[唤起 App 在转转的实践](https://mp.weixin.qq.com/s?__biz=MzU0OTExNzYwNg==&mid=2247486327&idx=1&sn=a4ed8b1b012638a60bd4065a6e5ee309)
[复杂场景下唤起App实践](https://mp.weixin.qq.com/s?__biz=MzU0OTExNzYwNg==&mid=2247492140&idx=1&sn=9857ecdf80285020dd90fd3d26fb717d)
