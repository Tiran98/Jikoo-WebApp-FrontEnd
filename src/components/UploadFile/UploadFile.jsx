import * as dayjs from 'dayjs';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Container, Drawer, Grid, Stack, TextField, Typography } from '@mui/material/';
import { alpha, styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';

import DashboardIcon from '@mui/icons-material/Dashboard';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MailIcon from '@mui/icons-material/Mail';
import NavSection from '../nav-section';
import axios from 'axios';
import logo from '../../assets/LogoConceptCROP.png';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import { withStyles } from 'tss-react/mui';

const NAV_WIDTH = 280;

const navConfig = [
  {
    title: 'dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    title: 'send message',
    icon: <MailIcon />,
    path: '/send-message'
  },
  {
    title: 'upload file',
    icon: <FileUploadIcon />,
    path: '/file-upload'
  }
];

const navConfigEm = [
  {
    title: 'dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    title: 'send message',
    icon: <MailIcon />,
    path: '/send-message'
  }
];

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  backgroundColor: '#f9fafb'
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '95vh',
  backgroundColor: '#f9fafb',
  paddingTop: 50,
  //   paddingBottom: theme.spacing(10),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2)
}));

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12)
}));

const CssTextField = withStyles(TextField, () => ({
  root: {
    '& .MuiInputLabel-root': {
      color: '#6e6e6e'
    },
    '& .MuiTextField-root': {
      color: '#181818'
    },
    '& .MuiFormHelperText-root': {
      color: '#6e6e6e'
    },
    '& label.Mui-focused': {
      color: '#6e6e6e'
    },
    '& .MuiInputBase-input': {
      color: '#181818'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#6e6e6e'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#6e6e6e'
      },
      '&:hover fieldset': {
        borderColor: '#CF6BFF'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#CF6BFF'
      }
    }
  },
  input: {
    color: '#181818'
  }
}));

export const UploadFile = () => {
  const { classes } = useStyles();
  let navigate = useNavigate();
  var now = dayjs().format('MMMM D, YYYY h:mm A');
  const isFirstRender = useRef(true);
  const [user, setUser] = useState();
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [userID, setUserID] = useState('');
  const [token, setToken] = useState('');
  const [success, setSuccess] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  // const [success, setSuccess] = useState(false);
  // const [alertOpen, setAlertOpen] = useState(false);
  const { getRootProps, acceptedFiles, getInputProps, isDragActive, isDragAccept, isDragReject } =
    useDropzone();
  const { handleSubmit } = useForm();

  const files = acceptedFiles.map((file) => (
    <Typography variant="caption" key={file.path}>
      {file.path} - {(file.size / 1024 / 1024).toFixed(2)} MB
    </Typography>
  ));

  console.log(userID + token);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setUserName(user.userEmail);
    setUserType(user.userType);
    setUserID(user.userId);
    setToken(user.token);
  }, [user]);

  const onSubmitHandler = () => {
    console.log(acceptedFiles);
    var bodyFormData = new FormData();
    bodyFormData.append('uploadedBy', userID);
    bodyFormData.append('fileName', acceptedFiles[0].name);
    bodyFormData.append('file', acceptedFiles);
    bodyFormData.append('uploadDate', now);

    axios({
      method: 'post',
      url: 'https://jikoo-webapp-backend.herokuapp.com/api/v1/file/addFile',
      data: bodyFormData,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        console.log('response: ' + response);
        setSuccess(true);
        navigate('/file-upload');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setAlertOpen(success);
  }, [success]);

  const renderContent = (
    <>
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <img src={logo} className={classes.logo} />
      </Box>

      <Box sx={{ mb: 3, mx: 2 }}>
        <StyledAccount>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: '600' }}>
              {userName}
            </Typography>

            <Typography variant="caption" sx={{ color: '#cd6afd', fontWeight: '600' }}>
              {userType}
            </Typography>
          </Box>
        </StyledAccount>
      </Box>

      <NavSection data={userType == 'Manager' ? navConfig : navConfigEm} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10, textAlign: 'center' }}>
        <Typography
          align="center"
          variant="caption"
          marginTop={5}
          className={classes.copyrightText}>
          © Jikoo.com. All rights reserved.
        </Typography>
      </Box>
    </>
  );

  const onLogout = () => {
    localStorage.clear();
    console.log('Logging out.');
    navigate('/');
  };

  return (
    <StyledRoot>
      <Box
        component="nav"
        sx={{
          flexShrink: { lg: 0 },
          width: { lg: NAV_WIDTH }
        }}>
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: '#181818',
              borderRightStyle: 'dashed',
              borderColor: '#CCCCCC'
            }
          }}>
          {renderContent}
        </Drawer>
      </Box>
      <Main>
        <Container maxWidth="xl">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={4}>
            <Typography
              variant="h4"
              sx={{ fontSize: '1.5rem', fontWeight: '700', color: 'rgb(33, 43, 54)' }}>
              Upload File
            </Typography>
            <Button variant="contained" color="error" sx={{ fontWeight: '600' }} onClick={onLogout}>
              Logout
            </Button>
          </Stack>
          <Collapse in={alertOpen}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlertOpen(false);
                  }}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 3, width: '35%' }}>
              File Uploaded Successfully!
            </Alert>
          </Collapse>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={6}
                sx={{
                  bgcolor: '#FFFFFF',
                  padding: '20px',
                  mt: 3,
                  borderRadius: '5px',
                  boxShadow: '1px 1px 5px #a8a8a8'
                }}>
                <Grid item xs={12}>
                  <CssTextField
                    fullWidth
                    disabled
                    id="date"
                    label="Date"
                    defaultValue={now}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* <Button variant="contained" component="label">
                  <Input type="file" hidden />
                </Button> */}
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 3,
                      mt: 3,
                      mb: 2,
                      color: '#6e6e6e',
                      outline: 'none',
                      borderWidth: '2px',
                      borderStyle: 'dashed',
                      borderColor: '#6e6e6e',
                      borderRadius: '3px',
                      backgroundColor: '#ededed',
                      transition: 'border .24s ease-in-out'
                    }}
                    {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
                    gutterBottom>
                    <input {...getInputProps()} />
                    <p>Drag & drop the file here</p>
                  </Box>
                  <aside>
                    <Typography variant="caption">File : </Typography> {files}
                  </aside>
                </Grid>
                <Grid item xs={12} mt={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    sx={{
                      backgroundColor: '#371A45',
                      padding: '10px',
                      fontWeight: '600',
                      '&:hover': { backgroundColor: '#CF6BFF' }
                    }}>
                    Upload
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Main>
    </StyledRoot>
  );
};
