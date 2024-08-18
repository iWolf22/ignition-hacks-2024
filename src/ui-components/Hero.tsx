import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { signIn, useSession } from 'next-auth/react';

export default function Hero() {
  const { data: session } = useSession();

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #C5E6D5, #FFF)'
            : `linear-gradient(#12482A, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
            }}
          >
            Physio&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(3rem, 10vw, 4rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >
              Mobility+
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            Discover a new, efficient physiotherapy.
          </Typography>
          {!session ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            onClick={() => signIn(undefined, { callbackUrl: '/physiotherapy' })}
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button variant="contained" color="primary">
              Start Here: Physiotherapy Unlocked
            </Button>
          </Stack>
          ) : (
            <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button variant="contained" color="primary" href="/physiotherapy">
              Physiotherapy Page
            </Button>
          </Stack>
          )}
        </Stack>
        <Box
          id="image"
          sx={(theme) => ({
            mt: { xs: 8, sm: 10 },
            alignSelf: 'center',
            height: { xs: 200, sm: 700 },
            width: '100%',
            backgroundImage:
              theme.palette.mode === 'light'
                ? 'url("https://cdn.discordapp.com/attachments/1274426077795844176/1274443562959896658/image.png?ex=66c2458f&is=66c0f40f&hm=8e3fb36fa77e556e8ae11587540ee285716211baccb8caca6c61f8668a0ccdad&")'
                : 'url("https://cdn.discordapp.com/attachments/1274426077795844176/1274443562959896658/image.png?ex=66c2458f&is=66c0f40f&hm=8e3fb36fa77e556e8ae11587540ee285716211baccb8caca6c61f8668a0ccdad&")',
            backgroundSize: 'cover',
            borderRadius: '10px',
            outline: '1px solid',
            outlineColor:
              theme.palette.mode === 'light'
                ? alpha('#A8DABF', 0.5)
                : alpha('#6CCB91', 0.1),
            boxShadow:
              theme.palette.mode === 'light'
                ? `0 0 12px 8px ${alpha('#6CCB91', 0.2)}`
                : `0 0 24px 12px ${alpha('#12482A', 0.2)}`,
          })}
        />
      </Container>
    </Box>
  );
}
