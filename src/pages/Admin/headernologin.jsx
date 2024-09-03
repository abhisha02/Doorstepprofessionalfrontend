import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, Button } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const Header = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'grey',
  height:'80px'
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  paddingTop: theme.spacing(3), // Adjust top padding for gap (32px in this case)
  paddingBottom: theme.spacing(1), // Optionally adjust bottom padding if needed
  display: 'flex',
  alignItems: 'center',
}));

const DoorstepProBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'black',
  padding: theme.spacing(1),
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  marginLeft: theme.spacing(10), // 80px gap from left
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
  },
}));

const HeaderBar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNavigateHome = () => {
    navigate('/'); // Navigate to root URL on click
  };

  return (
    <Header position="static">
      <ToolbarStyled>
        <Button onClick={handleNavigateHome}>
          <DoorstepProBox>
            <Typography variant="h6" noWrap>
              DoorstepPro
            </Typography>
          </DoorstepProBox>
        </Button>
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button color="inherit" onClick={() => navigate('/customer/login')}>Customer</Button>
          <Button color="inherit" onClick={() => navigate('/admin/login')}>Admin</Button>
          <Button color="inherit" onClick={() => navigate('/professional/login')}>Professional</Button>
        </Box>
      </ToolbarStyled>
    </Header>
  );
};

export default HeaderBar;
