import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, Button } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const Header = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'grey',
  height: '80px', // Set the height of the header to 120px
}));

const DoorstepProBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'black',
  padding: theme.spacing(1),
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
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
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
    marginBottom: theme.spacing(1),
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

const HeaderBar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <Header position="static">
      <Toolbar sx={{ 
        flexWrap: 'wrap',
        height: '100%', // Ensure the Toolbar takes full height of the Header
        display: 'flex',
        alignItems: 'center',
      }}>
        <DoorstepProBox>
          <Typography variant="h6" noWrap>
            DoorstepPro
          </Typography>
        </DoorstepProBox>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <Button color="inherit" onClick={() => navigate('/customer/login')}>Customer</Button>
          <Button color="inherit" onClick={() => navigate('/admin/login')}>Admin</Button>
          <Button color="inherit" onClick={() => navigate('/professional/login')}>Professional</Button>
        </Box>
      </Toolbar>
    </Header>
  );
};

export default HeaderBar;
