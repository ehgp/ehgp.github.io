'use client';

import { List, ListItemButton, ListItemText, Paper } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from '@/data/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <Paper component="nav" sx={{ position: { md: 'sticky' }, top: { md: 32 }, p: 2 }}>
      <List disablePadding>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&.Mui-selected': {
                  bgcolor: 'rgba(211, 144, 211, 0.2)'
                }
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontFamily: 'var(--font-roboto-mono), monospace',
                  textTransform: 'uppercase'
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
}
