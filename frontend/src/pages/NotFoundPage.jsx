import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        textAlign: 'center'
      }}
    >
      <Typography variant="h1" sx={{ mb: 2, fontSize: '4rem', fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
        size="large"
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
