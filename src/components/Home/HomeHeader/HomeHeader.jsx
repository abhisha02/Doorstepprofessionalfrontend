import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, InputBase, Box, Button, Menu, MenuItem, IconButton, useMediaQuery } from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

const Header = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'grey',
  height: '80px',
}));

const DoorstepProBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'black',
  padding: theme.spacing(1),
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
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
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const menuItems = [
    { label: 'Customer', path: '/customer/login' },
    { label: 'Admin', path: '/admin/login' },
    { label: 'Professional', path: '/professional/login' },
  ];

  return (
    <Header position="static">
      <Toolbar sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <DoorstepProBox>
          <Typography variant="h6" noWrap>
            DoorstepPro
          </Typography>
        </DoorstepProBox>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <Box>
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem key={item.label} onClick={() => handleNavigation(item.path)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            menuItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </Button>
            ))
          )}
        </Box>
      </Toolbar>
    </Header>
  );
};

export default HeaderBar;