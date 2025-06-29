import { Box, Typography } from '@mui/material';
import QRCode from 'qrcode.react';

const QRCodeDisplay = ({ qrCode }) => {
  return (
    <Box sx={{ mt: 3, textAlign: 'center' }}>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Scan this QR code with your phone:
      </Typography>
      <Box sx={{ 
        display: 'inline-block',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}>
        <QRCode 
          value={qrCode} 
          size={200} 
          level="H" 
          includeMargin 
        />
      </Box>
    </Box>
  );
};

export default QRCodeDisplay;
