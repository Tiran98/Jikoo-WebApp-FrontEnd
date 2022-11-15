import { makeStyles } from 'tss-react/mui';

export default makeStyles()(() => ({
  logo: {
    width: 120
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
    color: '#545454'
  }
}));
