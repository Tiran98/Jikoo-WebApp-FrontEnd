import * as yup from 'yup';

import { Button, Grid, Paper, TextField, Typography } from '@mui/material/';
import React, { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import logo from '../../assets/LogoConceptCROP.png';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import { withStyles } from 'tss-react/mui';
import { yupResolver } from '@hookform/resolvers/yup';

let validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(32).required()
});

const CssTextField = withStyles(TextField, () => ({
  root: {
    '& .MuiInputLabel-root': {
      color: '#cccccc'
    },
    '& .MuiTextField-root': {
      color: '#ffffff'
    },
    '& .MuiFormHelperText-root': {
      color: '#ff6161'
    },
    '& label.Mui-focused': {
      color: '#cccccc'
    },
    '& .MuiInputBase-input': {
      color: '#ffffff'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#6e6e6e'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#cccccc'
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
    color: '#1a1a1a'
  }
}));

export const UserLogin = () => {
  const { classes } = useStyles();
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmitHandler = (data) => {
    console.log({ data });

    axios
      .post('https://localhost:3000/api/v1/user/signin', {
        userEmail: data.email,
        password: data.password
      })
      .then((response) => {
        console.log('response: ' + response);
        reset();
        navigate('/dashboard');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Grid container spacing={0} direction="column" alignItems="center" marginTop={6}>
        <img src={logo} className={classes.logo} />
        <Paper className={classes.paper}>
          <Typography variant="h5" className={classes.titleText}>
            LOGIN
          </Typography>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Grid container spacing={2} marginTop={2}>
              <Grid item xs={12}>
                <CssTextField
                  fullWidth
                  {...register('email')}
                  id="email"
                  name="email"
                  label="Email"
                  value={email}
                  onInput={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <CssTextField
                  fullWidth
                  {...register('password')}
                  id="password"
                  name="password"
                  label="Password"
                  value={password}
                  onInput={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  helperText={errors.password?.message}
                  type={showPassword ? 'text' : 'password'}
                  // type="password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ color: '#ffffff' }}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              {/* <Typography variant="caption">{errorMsg}</Typography> */}
            </Grid>
            <Button type="submit" fullWidth variant="contained" className={classes.btn}>
              Submit
            </Button>
          </form>
        </Paper>
      </Grid>
      {/* <Typography align="center" variant="caption" marginTop={5} className={classes.copyrightText}>
        © Jikoo.com. All rights reserved.
      </Typography> */}
    </div>
  );
};
