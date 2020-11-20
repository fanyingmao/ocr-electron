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
    try {
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
    } catch (error) {
      openAlert(3, `错误：${error.message}`);
    }
  };

  const handleInput = async () => {
    try {
      storeOutRule.forEach((item) => {
        const relyItem = getRelyItem(item.relyTitle || '');
        if (relyItem) {
          item.content = String(
            store.set(
              `input.store${templetIndex}.${relyItem.title}.${relyItem.content}.${item.title}`,
              item.content || ''
            )
          );
        }
      });
      openAlert(2, '自动填入数据中。。。');
      await CommonUtils.startInput(config[templetIndex]);
      await CommonUtils.backWindow();
      openAlert(1, '填入数据完成');
    } catch (error) {
      openAlert(3, `错误：${error.message}`);
      try {
        await CommonUtils.backWindow();
      } catch (error2) {
        openAlert(3, `错误：${error2.message}`);
      }
    }
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
      <Snackbar open={openI} autoHideDuration={10000} onClose={handleClose}>
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
