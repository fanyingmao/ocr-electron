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
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import styles from './Home.css';
import CommonUtils from '../utils/CommonUtils';
// isPackage
const AppConfig =
  process.env.NODE_ENV === 'development'
    ? require('../../resources/config')
    : require('../../resources/resources/config');

export default function Home(): JSX.Element {
  const [age, setAge] = React.useState(10);
  const [img, setImg] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [ocrRes, setOcrRes] = React.useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    const res = await CommonUtils.findWindowPHandle('云票助手');
    setOcrRes(res);
    setOpen(false);
  };

  const handleChange = (event: any) => {
    console.log('Received files: ', event.target.value);
    setAge(event.target.value);
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setImg(acceptedFiles[0].path);
    console.log('Received files: ', acceptedFiles[0].path);
  }, []);

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
        />
      </div>

      <div className={styles.div2}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p className={styles.imageTxt}>拖拽图片到这里或点击选择图片上传</p>
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
              value={age}
              onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <div className={styles.div6}>
            <div className={styles.inputItem}>
              <TextField label="Outlined" variant="outlined" />
            </div>
          </div>
        </div>

        <div className={styles.div5}>
          <Button
            className={styles.btn}
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
          >
            解析
          </Button>
          <Button className={styles.btn} variant="contained" color="secondary">
            填入
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Use Google location service?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
            {AppConfig.mogodbUri}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
