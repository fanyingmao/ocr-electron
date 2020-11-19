/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback } from 'react';
import Image from 'material-ui-image';
import {
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Snackbar,
} from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useDropzone } from 'react-dropzone';
import Store from 'electron-store';
import styles from './Home.css';
import CommonUtils from '../utils/CommonUtils';
import IConfig, { OutRuleType } from '../../resources/config/IConfig';

const store = new Store();
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Home(): JSX.Element {
  const [templetIndex, setTempletIndex] = React.useState(0);
  const [img, setImg] = React.useState('');
  const [openS, setOpenS] = React.useState(false);
  const [openI, setOpenI] = React.useState(false);
  const [openE, setOpenE] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  // const [ocrRes, setOcrRes] = React.useState(
  //   '13489498653|1.合格证编号|MT972ABM0170908|2.发证日期|2020年06月04日|3.车辆制造企业名称广州市华烨电瓶车科技有限公司|4.车辆品牌/车辆名称|飞狐牌|两轮摩托车|5.车辆型号|FH125-3B|6.车辆识别代号/车架号LE8PCJL33L2005972|7.车身颜色|黑色|底盘型号/底盘TD|姓名张大发|9.底盘合格证编号|20B12446|性别男民族汉|11.发动机号|出生1971年2月17日|12.燃料种类|汽油|14.排放标准|GB14622-2016(国四)住址福建省大田县均溪镇许思|坑村7号|15.油耗|1.86|16.外廓尺寸(mm)200083510公民身份号码35042519710217031X|18.钢板弹簧片数(片)|20.轮胎规格|2.75-18/110/90-16|21.轮距(前/后)(mm|22.轴距(mm)|1300|23.轴荷(kg)|24.轴数|2|25.转向形式|方向把|26.总质量(kg)270|27.整备质量(kg)120|29.载质量利用系数|28.额定载质量(kg)|31.半挂车鞍座最大允|30.准牵引总质量(kg)|许总质量(kg)|32.驾驶室准乘人数(人|33.额定载客(人)2|34.最高设计车速(km/h)85|35.车辆制造日期|2020年06月04日|36.二维条码|备注:一|车辆制造企业信息:|本产品经过检验,符合Q/HMT3-2018《两轮摩托车产品企业标准》的要求,准予出厂,特此证明。|车辆生产单位名称:广州市华烨电瓶车科技有限公司|车辆生产单位地址:广东省广州市南沙区榄核镇蔡新路351号|车辆制造企业其它信息:|联系电话:020-22867801'
  // );
  const [ocrRes, setOcrRes] = React.useState('');
  const { config } = CommonUtils;
  const [tfItem, setTfItem] = React.useState('');
  const listMenuItem = config.map((item: IConfig, index) => (
    <MenuItem value={index} key={item.templateTitle}>
      {item.templateTitle}
    </MenuItem>
  ));
  const storeOutRule = config[templetIndex].outRule.filter(
    (item) => item.type === OutRuleType.STORE
  );
  const getRelyItem = (relyTitle: string) => {
    const list = config[templetIndex].outRule;
    let res = null;
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];
      if (item.title === relyTitle) {
        res = item;
        break;
      }
    }
    return res;
  };

  const listInputItem = config[templetIndex].outRule.map((item, index) => (
    <div key={item.title} className={styles.inputItem}>
      <TextField
        label={item.type === OutRuleType.OCR ? item.title : `*${item.title}`}
        variant="outlined"
        value={item.content || ''}
        onChange={(event: any) => {
          item.content = event.target.value;
          storeOutRule.forEach((storeItem) => {
            if (storeItem.relyTitle === item.title) {
              storeItem.content = String(
                store.get(
                  `input.store${templetIndex}.${item.title}.${item.content}.${storeItem.title}`,
                  ''
                )
              );
            }
          });
          setTfItem(`${Date.now()}`);
        }}
      />
    </div>
  ));

  const openAlert = (type: number, msgt: string) => {
    setOpenS(false);
    setOpenI(false);
    setOpenE(false);
    setMsg(msgt);
    switch (type) {
      case 1:
        setOpenS(true);
        break;
      case 2:
        setOpenI(true);
        break;
      case 3:
        setOpenE(true);
        break;
      default:
        setOpenE(true);
        break;
    }
  };

  const handleClose = () => {
    setOpenS(false);
    setOpenI(false);
    setOpenE(false);
  };

  const handleParsing = () => {
    config[templetIndex].outRule.forEach((item) => {
      if (item.type === OutRuleType.OCR) {
        item.content = CommonUtils.parsingOcr(ocrRes, item);
      } else {
        const relyItem = getRelyItem(item.relyTitle || '');
        if (relyItem) {
          item.content = String(
            store.get(
              `input.store${templetIndex}.${relyItem.title}.${relyItem.content}.${item.title}`,
              ''
            )
          );
        }
      }
    });

    setTfItem(`${Date.now()}`);
  };

  const handleInput = () => {
    storeOutRule.forEach((item) => {
      const relyItem = getRelyItem(item.relyTitle || '');
      if (relyItem) {
        item.content = String(
          store.set(
            `input.store${templetIndex}.${relyItem.title}.${relyItem.content}.${item.title}`,
            item.content
          )
        );
      }
    });
  };

  const handleOpenPath = () => {
    CommonUtils.openResPath();
  };

  const handleChange = (event: any) => {
    config[templetIndex].outRule.forEach((item) => {
      item.content = '';
    });
    setTempletIndex(event.target.value);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    const imagePath = acceptedFiles[0].path;
    setImg(imagePath);
    console.log('Received files: ', acceptedFiles[0].path);
    openAlert(2, '图片文字识别中请稍后。。。');
    try {
      const res = await CommonUtils.getOcrRes(imagePath);
      openAlert(1, '图片文字识别成功。');
      setOcrRes(res);
    } catch (error) {
      openAlert(3, `错误：${error.message}`);
    }
  }, []);

  const ocrResChange = (event: any) => {
    setOcrRes(event.target.value);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={styles.container} data-tid="container">
      <div className={styles.div1}>
        <TextField
          className={styles.tf}
          label="识别结果"
          multiline
          rows={30}
          value={ocrRes}
          variant="outlined"
          onChange={ocrResChange}
        />
      </div>

      <div className={styles.div2}>
        <div className={styles.div7}>
          <input {...getInputProps()} />
          <p className={styles.imageTxt} {...getRootProps()}>
            拖拽图片到这里或点击选择图片识别
          </p>
        </div>
        {img ? <Image src={img} /> : <div />}
      </div>

      <div className={styles.div3}>
        <div className={styles.div4}>
          <FormControl variant="filled" className={styles.formControl}>
            <InputLabel id="demo-simple-select-filled-label">
              模版配置选择
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={templetIndex}
              onChange={handleChange}
            >
              {listMenuItem}
            </Select>
          </FormControl>
          <div className={styles.div6}>{listInputItem}</div>
        </div>

        <div className={styles.div5}>
          <Button
            className={styles.btn}
            variant="contained"
            color="primary"
            onClick={handleParsing}
          >
            解析
          </Button>
          <Button
            className={styles.btn}
            variant="contained"
            color="secondary"
            onClick={handleInput}
          >
            填入
          </Button>
          <Button
            className={styles.btn}
            variant="contained"
            color="primary"
            onClick={handleOpenPath}
          >
            打开配置
          </Button>
        </div>
      </div>
      <Snackbar open={openS} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {msg}
        </Alert>
      </Snackbar>
      <Snackbar open={openI} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info">
          {msg}
        </Alert>
      </Snackbar>
      <Snackbar open={openE} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}
