'use client';

import { Box, Stack, Typography } from '@mui/material';

export default function ProfileBanner() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 6 },
        background: 'linear-gradient(135deg, rgba(211,144,211,0.35), rgba(8,97,123,0.35))'
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h3" component="p" fontFamily="var(--font-roboto-mono, monospace)">
          EHGP
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Master in Data Science and Cybersecurity
        </Typography>
      </Stack>
    </Box>
  );
}
