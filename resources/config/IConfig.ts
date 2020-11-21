/**
 * 这是图片文字识别然后将需要的文字提取填入其他应用程序的对应的输入框中
 * 可以根据自己的情况灵活配置来实现图片文字自动填表功能
 * 字体图片要清晰，如果是手写字体要工整识别准确度才高
 * 下面是 config.json 的字段的定义说明，修改config.json后重启程序生效
 * 还有目前只支持windows原生程序输入，不支持输入换行符，还有一些特殊的输入框无法自动填入
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
  delayTime: number; // 输入延迟
  outRule: IOutRule[]; // 提取文字结果的规则
  inRule: IInRule[]; // 将提取文字输入窗口的规则
}
