'use client';

import { Paper, Stack, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';
import { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  eyebrow?: string;
  eyebrowVariant?: TypographyProps['variant'];
  action?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({ title, eyebrow, eyebrowVariant = 'overline', action, children }: SectionCardProps) {
  return (
    <Paper>
      <Stack spacing={2}>
        {(title || eyebrow || action) && (
          <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
            <Stack spacing={0.5}>
              {eyebrow && (
                <Typography variant={eyebrowVariant} color="text.secondary">
                  {eyebrow}
                </Typography>
              )}
              {title && (
                <Typography variant="h4" component="h2">
                  {title}
                </Typography>
              )}
            </Stack>
            {action}
          </Stack>
        )}
        {children}
      </Stack>
    </Paper>
  );
}
