# OCR 自动填表工具

## 背景

有很多需要我们根据图片文字录入电脑中其他软件的场景，我这里遇到的是开发票需要根据合格证和身份证录入电脑的场景。之前想到用第三方工具像 qq 自带 OCR 等。但是这类产品感觉还是不够自动化，我想要一个可以自动提取出图片文字内容并自动填写的工具来进一步提高效率所以开发了这个项目，项目用到的技术有：electron+pyton+react+ts。

后端接口由于有百度的 key，而且只有做了一个简单的图片文字识别接口所以不开源。

## 使用说明

使用视频：https://www.bilibili.com/video/BV1Vy4y1J7c6/

安装文件下载地址：https://pan.baidu.com/s/1yHv14kLeu7z4Rp3bdr7-cg 提取码：939k

使用流程：

1、 配置文件可打开软件后通过点击“打开配置“,配置规则在 config.json 文件中，可以通过 IConfig.ts 来获得每个字段的的用途。如果了解 typescript，就知道 IConfig 是对 config 的约束。config.json 中有之前的配置可以参照填写。

IConfig.ts 文件内容：

```ts
/**
 * 这是图片文字识别然后将需要的文字提取填入其他应用程序的对应的输入框中
 * 可以根据自己的情况灵活配置来实现图片文字自动填表功能
 * 字体图片要清晰，如果是手写字体要工整识别准确度才高
 * 还有目前只支持windows原生程序输入，不支持输入换行符，还有一些特殊的输入框无法自动填入
 * 下面是 config.json 的字段的定义说明，修改config.json后重启程序生效
 */
export enum OutRuleType {
  OCR = 1, // 通过识别图片文字得到结果
  STORE = 2, // 通过记录上次保存值来保存结果
}

export interface IOutRule {
  title: string; // 输入框标题
  type: OutRuleType; // 输入框结果获取类型
  findRegEx?: string; // OCR类型生效 通过正则表达式查找文字，如果有多个则只取第一个
  removeRegEx?: string; // OCR类型生效 对查找出来的结果的多余部分通过正则匹配去除
  relyTitle?: string; // STOR类型生效 保存的依赖属性标题，例如 同一型号的产品就会有同样的价格等参数 所以这里就是依赖产品型号来记录价格

  content: string; // 这个不用配
}

export interface IInRule {
  inputIndex: number; // 输入窗口中输入框的句柄排序编号，通过 allInputTest.exe <窗口标题> 可以得到编号
  inputTemplate: string; // 输入文本的模版 会将OutRuleType的title替换为对应值例如   “车架号：<车架号>" 尖括号中的内容会被替换为对应值

  content: string; // 这个不用配
}

export default interface IConfig {
  templateTitle: string; // 模版名称
  windowTitle: string; // 输入窗口标题
  outRule: IOutRule[]; // 提取文字结果的规则
  inRule: IInRule[]; // 将提取文字输入窗口的规则
}
```

2、 选择或拖拽入需要识别的图片，完成后软件会自动对文字识别，可以看到识别成功后的结果。由于内容较多，还需要转掉第三方接口和第三方处理时间。所以这步有些慢。

3、得到结果后，选择对应的配置模版，点击“解析”通过配置的正则表达式规则到对应内容，如果获取的内容不对，需要根据结果返回步骤 1 完善配置中的解析规则，或者修改输入框中的内容。

4、确认输入框的内容无误后，点击“填入”软件会激活填入目标软件窗口。然后按配置规则填入输入框，完成后激活回到本软件窗口。这一步采用 node 调用 exe 的方式实现，存在执行时间过长的问题。同时需要检查下结果有没正确填入，否则回到步骤 1 重新配置。

## 代码运行

先将 resources/windowUtils.py 和 resources/config/allInputTest.py 在对于源码目录下打包出 exe。打包命令：

```bash
pyinstaller -F xxx.py
```

导入依赖

```bash
yarn
```

开发模式运行

```bash
yarn start
```

打生产环境包

```bash
yarn package-win
```

## 待处理问题

1. 无法输入换行符。
2. 一些特殊的软件输入框，无法输入配置内容。
3. 调用执行 exe 耗时过长。
