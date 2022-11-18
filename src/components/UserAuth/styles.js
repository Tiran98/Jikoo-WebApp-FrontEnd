import { makeStyles } from 'tss-react/mui';

export default makeStyles()((theme) => ({
  paper: {
    backgroundColor: '#371A45',
    padding: theme.spacing(5),
    marginBottom: theme.spacing(2),
    width: 500,
    textAlign: 'center',
    color: '#ffffff'
  },
  logo: {
    marginBottom: '15px',
    height: '130px'
  },
  titleText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 600
  },
  textBox: {
    color: '#FFFFFF'
  },
  btn: {
    marginTop: 30,
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#CF6BFF',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#FFFFFF',
      color: '#371A45'
    }
  },
  copyrightText: {
    color: '#545454',
    textAlign: 'center'
  }
}));
