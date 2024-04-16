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
import { Container, Link, Stack, Typography } from '@mui/joy';

const defaultTheme = createTheme({});

function ToggleCustomTheme({ showCustomTheme, toggleCustomTheme }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
    </Box>
  );
}

ToggleCustomTheme.propTypes = {
  showCustomTheme: PropTypes.shape({
    valueOf: PropTypes.func.isRequired,
  }).isRequired,
  toggleCustomTheme: PropTypes.func.isRequired,
};

export default function AboutUs() {
  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    localStorage.setItem('joy-mode', mode === 'dark' ? 'light' : 'dark');
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar navigate={false} mode={mode} toggleColorMode={toggleColorMode} />
      <Box
      sx={{
        pt: 14,
        px: 5,
        maxWidth: 1024,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
      >
        <Box>
            <Typography level='h2'>About Us</Typography>
        </Box>
        <br/>
        <Divider/>
        <br/>
        <Box>
            <Typography level="body-lg">
        At FamilyLynk, we understand the importance of honoring loved ones with dignity and respect during life's most challenging moments. We are dedicated to providing innovative funeral home management software solutions that streamline operations, enhance customer experiences, and empower funeral professionals to focus on what matters most: supporting families with compassion and care.

Our journey began with a simple yet profound realization – that the funeral industry needed modern, efficient tools to navigate the complexities of managing funeral arrangements and services. With this vision in mind, we embarked on a mission to revolutionize the way funeral homes operate, offering intuitive software solutions tailored to meet the unique needs of today's funeral directors and staff.

Driven by a passion for excellence and guided by our core values of integrity, empathy, and innovation, we strive to deliver cutting-edge technology that transforms the funeral home experience. Our team of dedicated developers, designers, and support staff work tirelessly to create software products that are not only user-friendly and reliable but also adaptable to the evolving needs of the industry.

At FamilyLynk, we believe that every family deserves a personalized and meaningful farewell for their loved ones. By equipping funeral professionals with the tools they need to provide exceptional service, we aim to make a positive impact on the lives of grieving families and communities around the world.
</Typography>
        </Box>
      </Box>
      <Footer/>
      <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      />
    </ThemeProvider>
  );
}