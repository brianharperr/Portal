import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Switch from '@mui/material/Switch';
const tiers = [
  {
    title: 'Basic',
    monthly: '200',
    yearly: '2,160',
    description: [
      '10 users included',
      '2 GB of storage',
      'Help center access',
      'Email support',
    ],
    buttonText: 'Start now',
    buttonVariant: 'outlined',
  },
  {
    title: 'Professional',
    subheader: 'Recommended',
    monthly: '600',
    yearly: '6,480',
    description: [
      '20 users included',
      '10 GB of storage',
      'Help center access',
      'Priority email support',
      'Dedicated team',
      'Best deals',
    ],
    buttonText: 'Start now',
    buttonVariant: 'contained',
  },
  {
    title: 'Enterprise',
    monthly: '1,500',
    yearly: '16,200',
    description: [
      '50 users included',
      '30 GB of storage',
      'Help center access',
      'Phone & email support',
    ],
    buttonText: 'Contact us',
    buttonVariant: 'outlined',
  },
];

export default function Pricing() {

    const [period, setPeriod] = React.useState('month');

  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography component="h2" variant="h4" color="text.primary">
          Pricing
        </Typography>
        {/* <Typography variant="body1" color="text.secondary">
          Quickly build an effective pricing table for your potential customers with
          this layout. <br />
          It&apos;s built with default Material UI components with little
          customization.
        </Typography> */}
        <Box sx={{ display: 'flex', mt: 2, gap: 1, alignItems: 'center', textAlign: 'center', justifyContent: {xs: 'left', md: 'center'} }}>
        <Typography>Monthly</Typography>
        <Switch checked={period ==='year'} onChange={() => setPeriod(period === 'month'? 'year' : 'month')} />
        <Typography>Yearly</Typography>
        </Box>
      </Box>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        {tiers.map((tier) => (
          <Grid
            item
            key={tier.title}
            xs={12}
            sm={tier.title === 'Enterprise' ? 12 : 6}
            md={4}
          >
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                border: tier.title === 'Professional' ? '1px solid' : undefined,
                borderColor:
                  tier.title === 'Professional' ? 'primary.main' : undefined,
                background:
                  tier.title === 'Professional'
                    ? 'linear-gradient(#033363, #021F3B)'
                    : undefined,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color:
                      tier.title === 'Professional' ? 'primary.contrastText' : '',
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.title === 'Professional' && (
                    <Chip
                      icon={<AutoAwesomeIcon />}
                      label={tier.subheader}
                      size="small"
                      sx={{
                        background: (theme) =>
                          theme.palette.mode === 'light' ? '' : 'none',
                        backgroundColor: 'primary.contrastText',
                        '& .MuiChip-label': {
                          color: 'primary.dark',
                        },
                        '& .MuiChip-icon': {
                          color: 'primary.dark',
                        },
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    color:
                      tier.title === 'Professional'
                        ? 'primary.contrastText'
                        : undefined,
                  }}
                >
                  <Typography component="h3" variant="h2">
                    ${period === 'month' ?  tier.monthly : tier.yearly}
                  </Typography>
                  <Typography component="h3" variant="h6">
                    &nbsp; per {period}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    my: 2,
                    opacity: 0.2,
                    borderColor: 'grey.500',
                  }}
                />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{
                      py: 1,
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        color:
                          tier.title === 'Professional'
                            ? 'primary.light'
                            : 'primary.main',
                      }}
                    />
                    <Typography
                      component="text"
                      variant="subtitle2"
                      sx={{
                        color:
                          tier.title === 'Professional'
                            ? 'primary.contrastText'
                            : undefined,
                      }}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  component="a"
                  href="/material-ui/getting-started/templates/checkout/"
                  target="_blank"
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}