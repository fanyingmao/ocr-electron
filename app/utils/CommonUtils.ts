/* eslint-disable no-await-in-loop */
import { execSync } from 'child_process';
import fs from 'fs';
import axios from 'axios';
import IConfig, { IOutRule } from '../../resources/config/IConfig';

const url = require('url');

const gerOcrUrl = 'http://www.devfan.cn:45712/getOcrText';
/**
 * 对命令调用promis封装
 * @param cmd 调用命令
 */
export default class CommonUtils {
  private static readonly WinUtilsPath = CommonUtils.getResourcesPath(
    'windowUtils.exe'
  );

  public static config: IConfig[];

  public static async findWindowPHandle(windowPTitle: string) {
    const res = await execSync(`${CommonUtils.WinUtilsPath} 1 ${windowPTitle}`);
    if (!res) {
      throw new Error('未找到对应标题窗口');
    }
    return res.toString();
  }

  public static async getAllchildHandle(windowPHandle: string) {
    const resJson = await execSync(
      `${CommonUtils.WinUtilsPath} 2 ${windowPHandle}`
    );
    const res = JSON.parse(resJson.toString());
    return res;
  }

  public static async inputByHandle(handle: number, content: string) {
    const resJson = await execSync(
      `${CommonUtils.WinUtilsPath} 3 ${handle} ${content}`
    );
    const res = JSON.parse(resJson.toString());
    return res;
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
      await execSync(`open ${CommonUtils.getResourcesPath('config/')}`);
    } else {
      await execSync(`start ${CommonUtils.getResourcesPath('config/')}`);
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
    const handleChildArr = await CommonUtils.getAllchildHandle(handleP);

    for (let i = 0; i < templetConfig.inRule.length; i += 1) {
      const item = templetConfig.inRule[i];
      await CommonUtils.dalyAction(1000);
      CommonUtils.inputByHandle(handleChildArr[item.inputIndex], item.content);
    }
  }

  public static async backWindow() {
    await CommonUtils.findWindowPHandle('OCR自动填表');
  }
}
