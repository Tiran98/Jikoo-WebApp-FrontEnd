import React, { useState, useEffect, useRef } from 'react';
import { Box, Drawer, Typography, Container, Grid, Stack, Button } from '@mui/material/';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import useStyles from './styles';
import { styled, alpha } from '@mui/material/styles';
import NavSection from '../nav-section';
import logo from '../../assets/LogoConceptCROP.png';

const NAV_WIDTH = 280;

const navConfig = [
  {
    title: 'dashboard',
    icon: <DashboardIcon />,
    path: '/admin'
  },
  {
    title: 'add users',
    icon: <GroupAddIcon />,
    path: '/add-user'
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

const columns = [
  { field: '_id', renderHeader: () => <strong>{'ID'}</strong>, width: 200 },
  {
    field: 'userName',
    renderHeader: () => <strong>{'Full Name'}</strong>,
    width: 200
  },
  { field: 'userEmail', renderHeader: () => <strong>{'Email'}</strong>, width: 250 },
  {
    field: 'userPhone',
    renderHeader: () => <strong>{'Phone'}</strong>,
    width: 150
  },
  {
    field: 'userType',
    renderHeader: () => <strong>{'User Type'}</strong>,
    width: 150
  }
];

export const AdminDashboards = () => {
  const { classes } = useStyles();
  let navigate = useNavigate();
  const isFirstRender = useRef(true);
  const [user, setUser] = useState();
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([]);

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
  }, [user]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // const requestOptions = {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // };

    fetch('https://jikoo-webapp-backend.herokuapp.com/api/v1/user/allUsers')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((jsonRes) => setUsers(jsonRes));
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (users != undefined) {
      console.log(users);
      setRows(users);
    }
  }, [users]);

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

      <NavSection data={navConfig} />

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
        {/* <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        /> */}
        <Container maxWidth="xl">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={4}>
            <Typography
              variant="h4"
              sx={{ fontSize: '1.5rem', fontWeight: '700', color: 'rgb(33, 43, 54)' }}>
              Hi, Welcome back! 👋
            </Typography>
            <Button variant="contained" color="error" sx={{ fontWeight: '600' }} onClick={onLogout}>
              Logout
            </Button>
          </Stack>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              sx={{
                bgcolor: '#FFFFFF',
                padding: '20px',
                mt: 3,
                borderRadius: '5px',
                boxShadow: '1px 1px 5px #a8a8a8'
              }}>
              <DataGrid
                autoHeight="true"
                rows={rows}
                getRowId={(row) => row._id}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
              />
            </Grid>
          </Grid>
        </Container>
      </Main>
      {/* <Box sx={{ bgcolor: '#f9fafb', width: '100%' }}>sadsd</Box> */}
    </StyledRoot>
  );
};
