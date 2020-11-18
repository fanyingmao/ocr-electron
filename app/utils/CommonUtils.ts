import { execSync } from 'child_process';

const WinUtilsPath = '.\\resources\\windowUtils.exe';
/**
 * 对命令调用promis封装
 * @param cmd 调用命令
 */
export default class CommonUtils {
  public static async findWindowPHandle(windowPTitle: string){
    const res = await execSync(`${WinUtilsPath} 1 ${windowPTitle}`);
    if (!res) {
      throw new Error('未找到对应标题窗口');
    }
    return res.toString();
  }

  public static async getAllchildHandle(windowPHandle: number) {
    const resJson = await execSync(`${WinUtilsPath} 1 ${windowPHandle}`);
    const res = JSON.parse(resJson.toString());
    return res;
  }

  public static async inputByHandle(handle: number) {
    const resJson = await execSync(`${WinUtilsPath} 1 ${handle}`);
    const res = JSON.parse(resJson.toString());
    return res;
  }
}
