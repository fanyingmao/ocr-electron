import { execSync } from 'child_process';

/**
 * 对命令调用promis封装
 * @param cmd 调用命令
 */
export default class CommonUtils {
  private static readonly WinUtilsPath = CommonUtils.getResourcesPath(
    'windowUtils.exe'
  );

  public static async findWindowPHandle(windowPTitle: string) {
    const res = await execSync(`${CommonUtils.WinUtilsPath} 1 ${windowPTitle}`);
    if (!res) {
      throw new Error('未找到对应标题窗口');
    }
    return res.toString();
  }

  public static async getAllchildHandle(windowPHandle: number) {
    const resJson = await execSync(
      `${CommonUtils.WinUtilsPath} 1 ${windowPHandle}`
    );
    const res = JSON.parse(resJson.toString());
    return res;
  }

  public static async inputByHandle(handle: number) {
    const resJson = await execSync(`${CommonUtils.WinUtilsPath} 1 ${handle}`);
    const res = JSON.parse(resJson.toString());
    return res;
  }

  public static getResourcesPath(fileName: string) {
    // isPackage
    return `.\\resources\\${fileName}`;
    // return `.\\resources\\resources\\${fileName}`;
  }
}
