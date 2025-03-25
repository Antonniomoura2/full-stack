import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => handleNavigation('/')}
        >
          Commece
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Button color="inherit" onClick={() => handleNavigation('/')} sx={{ mr: 1 }}>
            Home
          </Button>
          <Button color="inherit" onClick={() => handleNavigation('/products')}  sx={{ mr: 1 }}>
            Products
          </Button>
          <Button color="inherit" onClick={() => handleNavigation('/categories')} sx={{ mr: 1 }}>
            Categories
          </Button>
          <Button color="inherit" onClick={() => handleNavigation('/orders')} sx={{ mr: 1 }}>
            Orders
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
