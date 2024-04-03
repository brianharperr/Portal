import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Masonry from '@mui/lab/Masonry';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';

const userTestimonials = [
  {
    avatar: <Avatar alt="Emily Thompson" src="/static/images/avatar/1.jpg" />,
    name: 'Emily Thompson',
    occupation: 'Manager',
    testimonial:
    "Eternal Peace Funerals has seen remarkable efficiency since adopting FamilyLynk. It's simplified our administrative tasks, allowing us to focus more on supporting grieving families during their time of need.",
  },
  {
    avatar: <Avatar alt="Jessica Carter" src="/static/images/avatar/2.jpg" />,
    name: 'Jessica Carter',
    occupation: 'Home Director',
    testimonial:
      "I can't imagine managing our homes without it. It has streamlined our workflow, improved communication among staff members, and ultimately enhanced the overall experience for our clients during a difficult time.",
  },
  {
    avatar: <Avatar alt="David Brown" src="/static/images/avatar/3.jpg" />,
    name: 'David Brown',
    occupation: 'Funeral Counselor',
    testimonial:
      'Peaceful Farewells Mortuary has found this SaaS to be incredibly user-friendly and efficient. It has simplified our administrative processes, allowing us to provide more personalized attention to our clients and their families.',
  },
  {
    avatar: <Avatar alt="Danielle DeRosa" src="/static/images/avatar/4.jpg" />,
    name: 'Danielle DeRosa',
    occupation: 'Administrator',
    testimonial:
      "I appreciate the attention to detail in the design of this product. It's nice to have a modern option for funeral homes.",
  },
  {
    avatar: <Avatar alt="Travis Howard" src="/static/images/avatar/5.jpg" />,
    name: 'Travis Howard',
    occupation: 'Director',
    testimonial:
      "I've tried other similar products, but this one stands out for its ease-of-use. It's clear that the makers put a lot of thought into creating a solution that truly addresses user needs.",
  },
  {
    avatar: <Avatar alt="Daniel Wolf" src="/static/images/avatar/6.jpg" />,
    name: 'Daniel Wolf',
    occupation: 'CDO',
    testimonial:
      "The quality of this product exceeded my expectations. It's durable, well-designed, and built to last. Definitely worth the investment!",
  },
];

const whiteLogos = [
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628e8573c43893fe0ace_Sydney-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg',
];

const darkLogos = [
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg',
];

const logoStyle = {
  width: '64px',
  opacity: 0.3,
};

export default function Testimonials() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const columns = isSmallScreen ? 1 : 3;
  const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

  return (
    <Container
      id="testimonials"
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
          Testimonials
        </Typography>
        <Typography variant="body1" color="text.secondary">
          See what our customers love about our products. Discover how we excel in
          efficiency, durability, and satisfaction. Join us for quality, innovation,
          and reliable support.
        </Typography>
      </Box>
      <Masonry columns={columns} spacing={2}>
        {userTestimonials.map((testimonial, index) => (
          <Card key={index} sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {testimonial.testimonial}
              </Typography>
            </CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                pr: 2,
              }}
            >
              <CardHeader
                avatar={testimonial.avatar}
                title={testimonial.name}
                subheader={testimonial.occupation}
              />
              {/* <img src={logos[index]} alt={`Logo ${index + 1}`} style={logoStyle} /> */}
            </Box>
          </Card>
        ))}
      </Masonry>
    </Container>
  );
}