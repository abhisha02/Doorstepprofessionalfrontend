import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, Button } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../Redux/userauthenticationSlice';

const Header = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'grey',
  height: '80px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const DoorstepProBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'black',
  padding: theme.spacing(1),
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    flex: 1,
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: 'auto',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1, 0),
    width: '100%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

const AdHeaderBar = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleProfileClick = () => {
    navigate('/admin/home');
  };

  const logout = () => {
    localStorage.clear();
    dispatch(
      set_Authentication({
        name: null,
        isAuthenticated: false,
        isAdmin: false,
        isProfessional: false
      })
    );
    navigate('/');
  };

  return (
    <Header position="static">
      <Toolbar sx={{ flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px' }}>
        <DoorstepProBox onClick={handleProfileClick}>
          <Typography variant="h6" noWrap>
            DoorstepPro
          </Typography>
        </DoorstepProBox>
        <Box sx={{ flexGrow: 1 }} />
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('profile')}>Profile</Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Box>
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 1 }}>
          <Button color="inherit" onClick={() => navigate('profile')}>Profile</Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Box>
      </Toolbar>
    </Header>
  );
};

export default AdHeaderBar;
