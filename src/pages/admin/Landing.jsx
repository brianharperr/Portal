import * as React from 'react';
import PropTypes from 'prop-types';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from '../../components/landing/AppAppBar';
import Hero from '../../components/landing/Hero';
import LogoCollection from '../../components/landing/LogoCollection';
import Highlights from '../../components/landing/Highlights';
import Pricing from '../../components/landing/Pricing';
import Features from '../../components/landing/Features';
import Testimonials from '../../components/landing/Testimonials';
import FAQ from '../../components/landing/FAQ';
import Footer from '../../components/landing/Footer';
import getLPTheme from './getLPTheme';
import { Snackbar } from '@mui/joy';
import { axiosWithoutCredentials } from '../../configs/axios';

const defaultTheme = createTheme({});

export default function LandingPage() {
  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    localStorage.setItem('joy-mode', mode === 'dark' ? 'light' : 'dark');
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [open, setOpen] = React.useState(false);
  const [notification, setNotification] = React.useState({
    message: '',
    options: {
      color:'neutral',
      autoHideDuration: 6000,
    },
  });

  const handleNewsletterSubscription = (emailStr) => {

    var payload = {
      Email: emailStr
    }
    axiosWithoutCredentials.post('/email/newsletter', payload)
    .then(res => {
      setNotification({
        message: 'Successfully subscribed to our newsletter!',
        options: {
          color:'success',
          autoHideDuration: 6000,
        },
      });
    })
    .catch(err => {
      setNotification({
        message: 'Something went wrong. Please try again.',
        options: {
          color: 'danger',
          autoHideDuration: null,
        },
      });
    })
    .finally(() => {
       setOpen(true);
     });
  }

  return (
    <>
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero />
      <Box sx={{ bgcolor: 'background.default' }}>

        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer subscribeToNewsletter={handleNewsletterSubscription} />
      </Box>
    </ThemeProvider>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        {...notification.options}
        onClose={() => setOpen(false)}
      >
        {notification.message}
      </Snackbar>
    </>
  );
}