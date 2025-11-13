'use client';

import { Box } from '@mui/material';

interface DriveEmbedProps {
  src: string;
  title: string;
}

export default function DriveEmbed({ src, title }: DriveEmbedProps) {
  return (
    <Box
      component="iframe"
      src={src}
      title={title}
      loading="lazy"
      width="100%"
      height={500}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
