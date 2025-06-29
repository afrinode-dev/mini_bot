import { useState } from 'react';
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
import QRCodeDisplay from '../components/QRCodeDisplay';
import { startNewSession } from '../services/api';

const HomePage = ({ setActiveSession }) => {
  const [adminNumber, setAdminNumber] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleStartSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await startNewSession(adminNumber);
      
      setSessionId(response.sessionId);
      setQrCode(response.qrCodeData);
      setActiveSession(response.sessionId);
      
      setSuccess('Session created successfully! Check your WhatsApp for the session ID.');
    } catch (err) {
      console.error('Session creation error:', err);
      setError(err.response?.data?.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        WhatsApp Bot Admin Panel
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Start New Session
          </Typography>
          
          <TextField
            label="Admin WhatsApp Number"
            variant="outlined"
            fullWidth
            value={adminNumber}
            onChange={(e) => setAdminNumber(e.target.value)}
            placeholder="e.g., 94712345678"
            sx={{ mb: 2 }}
            helperText="Include country code without + or 00"
          />
          
          <Button 
            variant="contained" 
            onClick={handleStartSession}
            disabled={loading || !adminNumber}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Starting...' : 'Start Session'}
          </Button>
          
          {sessionId && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Session ID:</strong> {sessionId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This ID has been sent to your WhatsApp. Use it to deploy the bot.
              </Typography>
            </Box>
          )}
          
          {qrCode && <QRCodeDisplay qrCode={qrCode} />}
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

export default HomePage;
