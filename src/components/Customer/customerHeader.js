import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, Button, Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import WebSocketService from '../../services/WebSocketService';
import { updateNewMessageIndicator, clearNewMessageIndicator } from '../../Redux/chatSlice';

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
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
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
  [theme.breakpoints.down('sm')]: {
    display: 'none',
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
    [theme.breakpoints.down('md')]: {
      width: '12ch',
    },
  },
}));

const HeaderBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_basic_details = useSelector(state => state.user_basic_details);
  const currentUserId = user_basic_details.userId;
  const hasNewMessages = useSelector(state => state.newMessages.hasNewMessages);
  const [notificationCount, setNotificationCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const audioContextRef = useRef(null);
  const audioRef = useRef(new Audio(`${process.env.PUBLIC_URL}/notification.mp3`));

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (currentUserId) {
      WebSocketService.connect(currentUserId);
      WebSocketService.addListener('headerBar', handleWebSocketMessage);
      return () => {
        WebSocketService.removeListener('headerBar');
        WebSocketService.disconnect();
      };
    }
  }, [currentUserId, dispatch]);

  const playNotification = useCallback(() => {
    console.log('Attempting to play notification');
    audioRef.current.play().then(() => {
      console.log('Notification sound played successfully');
    }).catch(error => {
      console.error('Error playing notification sound:', error);
    });
  }, []);

  const playDoubleBeep = useCallback(() => {
    try {
      const context = audioContextRef.current;
      if (context) {
        const playBeep = (time) => {
          const oscillator = context.createOscillator();
          const gainNode = context.createGain();
  
          oscillator.connect(gainNode);
          gainNode.connect(context.destination);
  
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, time);
  
          gainNode.gain.setValueAtTime(0, time);
          gainNode.gain.linearRampToValueAtTime(1, time + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
  
          oscillator.start(time);
          oscillator.stop(time + 0.1);
        };
  
        const now = context.currentTime;
        playBeep(now);
        playBeep(now + 0.15);
      } else {
        console.warn('AudioContext not available');
        playNotification();
      }
    } catch (error) {
      console.error('Error playing beep sound:', error);
    }
  }, [playNotification]);

  const handleWebSocketMessage = useCallback((data) => {
    console.log('Received WebSocket message in HeaderBar:', data);
    if (data.type === 'new_message_notification' || data.type === 'booking_update') {
      console.log('New message or booking update received');
      dispatch(updateNewMessageIndicator(data.booking_id));
      setNotificationCount(prev => prev + 1);
      playDoubleBeep();
    }
  }, [dispatch, playDoubleBeep]);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
    dispatch(clearNewMessageIndicator());
    setNotificationCount(0);
  };

  const logout = () => {
    WebSocketService.disconnect();
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
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        <DoorstepProBox>
          <Typography
            variant="h6"
            noWrap
            onClick={() => navigate('/customer/home')}
            sx={{ cursor: 'pointer' }}
          >
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
        <Button color="inherit" onClick={() => navigate('/customer/cart')}>Cart</Button>
        <Badge 
          color="secondary" 
          badgeContent={notificationCount}
          sx={{ 
            '& .MuiBadge-badge': {
              backgroundColor: 'red',
              color: 'white'
            }
          }}
        >
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <NotificationsIcon />
          </IconButton>
        </Badge>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleNotificationClose}
        >
          <MenuItem onClick={() => {
            handleNotificationClose();
            navigate('/customer/account');
          }}>
            View Notifications
          </MenuItem>
        </Menu>
        <Button color="inherit" onClick={() => navigate('/customer/account')}>My Account</Button>
        <Button color="inherit" onClick={logout}>Logout</Button>
      </Toolbar>
    </Header>
  );
};

export default HeaderBar;