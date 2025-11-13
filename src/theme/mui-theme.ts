'use client';

import { createTheme } from '@mui/material/styles';

const basePalette = {
  primary: {
    main: '#d390d3',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#8ce6ff',
    contrastText: '#0a0a0a'
  },
  background: {
    default: '#000000',
    paper: '#0a0a0a'
  },
  text: {
    primary: '#f5f5f5',
    secondary: '#bdbdbd'
  },
  divider: '#333333'
};

const theme = createTheme({
  palette: basePalette,
  typography: {
    fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\'',
    h1: {
      fontFamily: 'var(--font-roboto-mono), Roboto Mono, monospace',
      textTransform: 'uppercase'
    },
    h2: {
      fontFamily: 'var(--font-roboto-mono), Roboto Mono, monospace',
      textTransform: 'uppercase'
    },
    h3: {
      fontFamily: 'var(--font-roboto-mono), Roboto Mono, monospace',
      textTransform: 'uppercase'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#0a0a0a',
          border: '1px solid #333333',
          borderRadius: 16,
          padding: '1.5rem',
          boxShadow: '-40px -22px 0 0 rgba(128, 0, 128, 0.35)'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'uppercase'
        }
      }
    }
  }
});

export default theme;
