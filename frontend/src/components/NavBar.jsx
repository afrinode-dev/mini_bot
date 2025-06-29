import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          WhatsApp Bot Deployer
        </Typography>
        <Button 
          color="inherit" 
          component={Link} 
          to="/"
          sx={{ mr: 2 }}
        >
          Home
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/deploy"
        >
          Deploy
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
