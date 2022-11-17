import React, { useState, useEffect, useRef } from 'react';
import * as dayjs from 'dayjs';
import * as yup from 'yup';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { Box, Button, Container, Drawer, Grid, Stack, TextField, Typography } from '@mui/material/';
import { alpha, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import DashboardIcon from '@mui/icons-material/Dashboard';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MailIcon from '@mui/icons-material/Mail';
import NavSection from '../nav-section';
import axios from 'axios';
import logo from '../../assets/LogoConceptCROP.png';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import { withStyles } from 'tss-react/mui';
import { yupResolver } from '@hookform/resolvers/yup';

let validationSchema = yup.object().shape({
  message: yup.string().required(),
  date: yup.string()
});

const NAV_WIDTH = 280;

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
      color: '#ff6161'
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

export const SendMessage = () => {
  const { classes } = useStyles();
  let navigate = useNavigate();
  var now = dayjs().format('MMMM D, YYYY h:mm A');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });
  const isFirstRender = useRef(true);
  const [user, setUser] = useState();
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [userID, setUserID] = useState('');
  const [token, setToken] = useState('');
  const [success, setSuccess] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

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

  const onSubmitHandler = (data) => {
    console.log({ data });

    const requestOptions = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios
      .post(
        'https://jikoo-webapp-backend.herokuapp.com/api/v1/message/sendMessage',
        {
          sendBy: userID,
          msgContent: data.message,
          sendDate: now
        },
        requestOptions
      )
      .then((response) => {
        console.log('response: ' + response);
        setSuccess(true);
        reset();
      })
      .catch(() => {});
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
              Send Message
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
              Messaeg Sent Successfully!
            </Alert>
          </Collapse>
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
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <Grid item xs={12}>
                  <CssTextField
                    fullWidth
                    {...register('date')}
                    disabled
                    name="date"
                    id="date"
                    label="Date"
                    defaultValue={now}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <CssTextField
                    fullWidth
                    multiline
                    {...register('message')}
                    id="message"
                    name="message"
                    label="Message"
                    variant="outlined"
                    margin="normal"
                    rows={8}
                    helperText={errors.message?.message}
                  />
                </Grid>
                <Grid item xs={12} mt={3}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: '#371A45',
                      padding: '10px',
                      fontWeight: '600',
                      '&:hover': { backgroundColor: '#CF6BFF' }
                    }}>
                    Submit
                  </Button>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Container>
      </Main>
    </StyledRoot>
  );
};
