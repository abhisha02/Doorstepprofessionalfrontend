import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, Button, Badge, Menu, MenuItem } from '@mui/material';
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
  width: 'auto',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
  },
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

const ProHeaderBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_basic_details = useSelector(state => state.user_basic_details);
  const currentUserId = user_basic_details.userId;
  const hasNewMessages = useSelector(state => state.newMessages.hasNewMessages);
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
      console.log("Connecting WebSocket for professional:", currentUserId);
      WebSocketService.connect(currentUserId);
      WebSocketService.addListener('proHeaderBar', handleWebSocketMessage);

      return () => {
        console.log("Disconnecting WebSocket");
        WebSocketService.removeListener('proHeaderBar');
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
        // Fallback to HTML5 Audio
        playNotification();
      }
    } catch (error) {
      console.error('Error playing beep sound:', error);
    }
  }, [playNotification]);

  const handleWebSocketMessage = useCallback((data) => {
    console.log('Received WebSocket message in ProHeaderBar:', data);
    if (data.type === 'new_message_notification' || data.type === 'service_request_update') {
      console.log('New message or service request update received');
      dispatch(updateNewMessageIndicator(data.booking_id));
      playDoubleBeep();
    }
  }, [dispatch, playDoubleBeep]);

  const logout = () => {
    console.log('Logging out');
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

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(clearNewMessageIndicator());
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  return (
    <Header position="static">
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        <DoorstepProBox>
          <Typography 
            variant="h6" 
            noWrap 
            onClick={() => navigate('/professional/home')}
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
        <Badge 
          color="secondary" 
          variant="dot" 
          invisible={!hasNewMessages}
          sx={{ 
            '& .MuiBadge-dot': {
              backgroundColor: 'white',
              border: '1px solid grey'
            }
          }}
        >
          <Button color="inherit" onClick={handleNotificationClick}>
            <NotificationsIcon />
          </Button>
        </Badge>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleNotificationClose}
        >
          <MenuItem onClick={() => {
            handleNotificationClose();
            navigate('/professional/service-requests');
          }}>
            View Service Requests
          </MenuItem>
        </Menu>
        <Button color="inherit" onClick={() => navigate('/professional/activetasks')}>Active Tasks</Button>
        <Button color="inherit" onClick={() => navigate('/professional/profile')}>Profile</Button>
        <Button color="inherit" onClick={logout}>Logout</Button>
      </Toolbar>
    </Header>
  );
};

export default ProHeaderBar;