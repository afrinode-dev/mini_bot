import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './pages/HomePage';
import DeployPage from './pages/DeployPage';
import NotFoundPage from './pages/NotFoundPage';
import NavBar from './components/NavBar';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#25D366',
    },
    secondary: {
      main: '#128C7E',
    },
    background: {
      default: '#111B21',
      paper: '#202C33',
    },
    text: {
      primary: '#E9EDEF',
      secondary: '#8696A0',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
});

function App() {
  const [activeSession, setActiveSession] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route 
              path="/" 
              element={<HomePage setActiveSession={setActiveSession} />} 
            />
            <Route 
              path="/deploy" 
              element={<DeployPage activeSession={activeSession} />} 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
