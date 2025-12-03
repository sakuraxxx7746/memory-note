'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1da1f2',  // X風のブルー
    },
    background: {
      default: '#ffffff',
      paper: '#f7f9f9',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
})

export default theme
