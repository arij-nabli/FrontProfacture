import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Snackbar,
  Paper
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Navbarsimple from "components/Navbars/Navbarsimple";
import SimpleFooter from "components/Footers/SimpleFooter.js";

const SignIn = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields correctly");
      return;
    }
  
    const userData = {
      email,
      password,
    };
  
    try {
      setIsLoading(true);
  
      // Effectuer la requête d'authentification
      const response = await axios.post(
        'https://localhost:7174/api/Account/login',
        userData
      );
  
      // Vérifier la réponse
      if (response.status === 200) {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        // Appeler la fonction onLogin si nécessaire
        if (onLogin) {
          onLogin();
        }
        
        // Rediriger vers /dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // Traiter les réponses autres que 200 si nécessaire
        setErrorMessage("An unexpected response was received.");
      }
  
    } catch (error) {
      setIsLoading(false);
  
      // Afficher le message d'erreur pour le débogage
      console.error("Error details:", error);
  
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            setErrorMessage("Incorrect Password");
            break;
          case 404:
            setErrorMessage("User Not Found");
            break;
          case 403:
            setErrorMessage(data.message || "Access Denied");
            break;
          case 405:
            setErrorMessage("User is banned. Please contact the administrator.");
            break;
          default:
            setErrorMessage("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        setErrorMessage("No response from the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };
  const handleCloseError = () => setErrorMessage('');

  return (
    <React.Fragment>
      <Navbarsimple />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <Typography variant="h4">Sign In</Typography>
            <Typography variant="body2" component={Link} to="/register-page" sx={{ mt: 1, mb: 3 }}>
              Don't have an account? Sign Up
            </Typography>
            <TextField
              fullWidth
              label="Email address"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errorMessage}
              helperText={errorMessage}
            />
            <TextField
              fullWidth
              label="Password"
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={!!errorMessage}
              helperText={errorMessage}
            />
            <Typography variant="body2" component={Link} to="/reset-password" sx={{ mt: 1, mb: 3 }}>
              Forgot password?
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                backgroundColor: '#5e72e4',
                '&:hover': {
                  backgroundColor: '#4e63d0',
                }
              }}
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Snackbar
              open={!!errorMessage}
              autoHideDuration={6000}
              onClose={handleCloseError}
              message={errorMessage}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
          </Paper>
        </Box>
      </Container>
      <SimpleFooter />
    </React.Fragment>
  );
};

export default SignIn;
