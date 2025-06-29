import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { deployBot } from '../services/api';

const DeployPage = ({ activeSession }) => {
  const [sessionId, setSessionId] = useState(activeSession || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deployed, setDeployed] = useState(false);
  const navigate = useNavigate();

  const handleDeploy = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await deployBot(sessionId, phoneNumber);
      
      if (response.success) {
        setSuccess('Bot deployed successfully!');
        setDeployed(true);
      } else {
        setError(response.message || 'Deployment failed');
      }
    } catch (err) {
      console.error('Deployment error:', err);
      setError(err.response?.data?.message || 'Failed to deploy bot');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  if (deployed) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Deployment Successful!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The WhatsApp bot has been successfully deployed to {phoneNumber}.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Deploy WhatsApp Bot
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Enter Session Details
          </Typography>
          
          <TextField
            label="Session ID"
            variant="outlined"
            fullWidth
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Enter the session ID you received"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Target WhatsApp Number"
            variant="outlined"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g., 94712345678"
            sx={{ mb: 2 }}
            helperText="Include country code without + or 00"
          />
          
          <Button 
            variant="contained" 
            onClick={handleDeploy}
            disabled={loading || !sessionId || !phoneNumber}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Deploying...' : 'Deploy Now'}
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeployPage;
