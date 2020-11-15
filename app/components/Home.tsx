import React,{useCallback}  from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'material-ui-image'
import styles from './Home.css';
import { Button,TextField,CircularProgress,Select,MenuItem } from '@material-ui/core';
import {useDropzone} from 'react-dropzone';

export default function Home(): JSX.Element {
   const [age, setAge] = React.useState('');
   const [img, setImg] = React.useState('');
  const handleChange = (event:any) => {
    console.log('Received files: ', event.target.value);
    setAge(event.target.value);
  };
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setImg(acceptedFiles[0].path);
    console.log('Received files: ', acceptedFiles[0].path);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  return (
    <div className={styles.container} data-tid="container">
        <TextField
          id="outlined-multiline-static"
          label="识别结果"
          multiline
          rows={4}
          defaultValue="Default Value"
          variant="outlined"
        />
      <Button variant="contained" color="primary">
      填入数据
      </Button>
      <CircularProgress />
        <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={age}
        onChange={handleChange}
        label="填表模版">
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>图片放置在这里 ...</p> :
            <p>拖拽图片到这理或点击图片上传</p>
        }
      </div>
      <Image
      src={img}
      />
    </div>
  );
}
