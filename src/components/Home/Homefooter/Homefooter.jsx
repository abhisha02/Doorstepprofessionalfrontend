import React from 'react';
import { styled, IconButton, Typography, Box } from '@mui/material';
import socialmedia from '../HomeWrapper/images/socialmedia.jpg'; // Import your social media image

const Footer = styled('footer')(({ theme }) => ({
  backgroundColor: 'black',
  padding: theme.spacing(3),
  color: 'white',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const FooterSection = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap', // Allow items to wrap on smaller screens
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const FooterLinks = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    alignItems: 'center',
  },
}));

const SocialMediaSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
  },
}));

const SocialMediaIcons = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
  },
}));

const FooterBar = () => {
  return (
    <Footer>
      <FooterSection>
        <FooterLinks>
          <Typography variant="subtitle1">Company</Typography>
          <Typography variant="body2">About Us</Typography>
          <Typography variant="body2">Terms and Conditions</Typography>
          <Typography variant="body2">Privacy Policy</Typography>
          <Typography variant="body2">Impact</Typography>
          <Typography variant="body2">Careers</Typography>
        </FooterLinks>
        <FooterLinks>
          <Typography variant="subtitle1">Customers</Typography>
          <Typography variant="body2">Categories Near You</Typography>
          <Typography variant="body2">Blog</Typography>
        </FooterLinks>
        <SocialMediaSection>
          <Typography variant="subtitle1">Follow Us</Typography>
          <Box display="flex" justifyContent="center" alignItems="center" marginTop={1}>
            <img src={socialmedia} alt="Social Media" style={{ width: '80px', height: 'auto', borderRadius: '50%' }} />
          </Box>
          <SocialMediaIcons>
            <IconButton color="inherit">
              <i className="fab fa-facebook-f"></i>
            </IconButton>
            <IconButton color="inherit">
              <i className="fab fa-instagram"></i>
            </IconButton>
            <IconButton color="inherit">
              <i className="fab fa-youtube"></i>
            </IconButton>
          </SocialMediaIcons>
        </SocialMediaSection>
      </FooterSection>
    </Footer>
  );
};

export default FooterBar;
