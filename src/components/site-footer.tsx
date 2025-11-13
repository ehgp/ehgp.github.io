'use client';

import { Box, Button, Stack, Typography } from '@mui/material';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="body2" color="text.secondary">
          © EHGP {year}
        </Typography>
        <Button variant="text" onClick={handleBackToTop} size="small">
          Back to top ↑
        </Button>
      </Stack>
    </Box>
  );
}
