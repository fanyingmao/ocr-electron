/* eslint-disable no-await-in-loop */
import { exec } from 'child_process';
import fs from 'fs';
import axios from 'axios';
import iconv from 'iconv-lite';
import IConfig, { IOutRule } from '../../resources/config/IConfig';

const url = require('url');

const gerOcrUrl = 'http://www.devfan.cn:45712/getOcrText';

/**
 * 对命令调用promis封装
 * @param cmd 调用命令
 */
const asyncExec = async (cmd: string): Promise<string> => {
  // if (process.env.NODE_ENV !== 'development') {
  //   cmd = iconv.encode(cmd,'gbk').toString();
  // }
  return new Promise((resolve, reject) => {
    if (cmd) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exec(cmd, { encoding: 'buffer' }, (err, stdout, stderr) => {
        if (err) {
          reject(new Error(iconv.decode(Buffer.from(stderr), 'gbk')));
          return;
        }
        resolve(iconv.decode(Buffer.from(stdout), 'gbk'));
      });
    }
  });
};

export default class CommonUtils {
  private static readonly WinUtilsPath = CommonUtils.getResourcesPath(
    'windowUtils.exe'
  );

  public static config: IConfig[];

  public static async findWindowPHandle(windowPTitle: string) {
    const res = await asyncExec(
      `${CommonUtils.WinUtilsPath} 1 "${windowPTitle}"`
    );

    if (!res) {
      throw new Error('未找到对应标题窗口');
    }
    return res.toString();
  }

  public static async getAllchildHandle(windowPHandle: string) {
    const resJson = await asyncExec(
      `${CommonUtils.WinUtilsPath} 2 ${windowPHandle}`
    );
    console.log(`getAllchildHandle:${resJson}`);
    const res = JSON.parse(resJson.toString());
    return res;
  }

  public static async inputByHandle(handle: number, content: string) {
    if (content.replace(/(^s*)|(s*$)/g, '').length === 0) {
      return;
    }
    if (!handle) {
      throw new Error('未找到对应序号的输入框句柄');
    }
    console.log(`handle:${handle} content:${content}`);
    await asyncExec(`${CommonUtils.WinUtilsPath} 3 ${handle} "${content}"`);
  }

  public static getResourcesPath(fileName: string) {
    let name = '';
    if (process.env.NODE_ENV !== 'development') {
      name = fileName.replace(new RegExp('/', 'g'), '\\');
    } else {
      name = fileName;
    }
    return process.env.NODE_ENV === 'development'
      ? `./resources/${name}`
      : `.\\resources\\resources\\${name}`;
  }

  public static async initConfig() {
    const configPath = CommonUtils.getResourcesPath('config/config.json');
    const configStr = fs.readFileSync(configPath).toString();
    this.config = JSON.parse(configStr);
  }

  public static async openResPath() {
    if (process.env.NODE_ENV === 'development') {
      asyncExec(`open ${CommonUtils.getResourcesPath('config/')}`);
    } else {
      asyncExec(`start ${CommonUtils.getResourcesPath('config/')}`);
    }
  }

  public static parsingOcr(ocrRes: string, item: IOutRule) {
    const matchRes = ocrRes.match(new RegExp(item.findRegEx || ''));
    if (matchRes && matchRes.length > 0) {
      let res = matchRes[0];
      if (item.removeRegEx) {
        res = res.replace(new RegExp(item.removeRegEx, 'g'), '');
      }
      return res;
    }
    return '';
  }

  public static async getOcrRes(imgPath: string) {
    const bitmap = fs.readFileSync(imgPath);
    const base64str = bitmap.toString('base64'); // base64编码
    const params = new url.URLSearchParams({
      image: base64str,
    });
    const response = await axios.post(gerOcrUrl, params.toString());
    if (response.data.code === 0) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  }

  public static async dalyAction(time: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  public static async startInput(templetConfig: IConfig) {
    templetConfig.inRule.forEach((itemIn) => {
      itemIn.content = itemIn.inputTemplate;
      templetConfig.outRule.forEach((itemOut) => {
        itemIn.content = itemIn.content.replace(
          new RegExp(`<${itemOut.title}>`, 'g'),
          itemOut.content
        );
      });
    });

    const handleP = await CommonUtils.findWindowPHandle(
      templetConfig.windowTitle
    );
    console.log(`handleP:${handleP}`);

    const handleChildArr = await CommonUtils.getAllchildHandle(handleP);

    for (let i = 0; i < templetConfig.inRule.length; i += 1) {
      const item = templetConfig.inRule[i];
      await CommonUtils.dalyAction(templetConfig.delayTime);
      await CommonUtils.inputByHandle(
        handleChildArr[item.inputIndex],
        item.content
      );
    }
  }

  public static async backWindow() {
    await CommonUtils.findWindowPHandle('OCR自动填表');
  }
}
