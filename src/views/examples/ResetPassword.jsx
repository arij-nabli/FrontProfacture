import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();

  // Extraction du token à partir des paramètres de l'URL
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (token) {
      setResetSuccess(true); // Le token est présent, donc l'utilisateur peut réinitialiser son mot de passe
    }
  }, [token]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(inputEmail);
    setEmailValid(emailRegex.test(inputEmail));
  };

  const handleResetPasswordRequest = async () => {
    if (!emailValid) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    try {
      await axios.post('https://localhost:7174/api/Account/forgot-password', { email });
      setErrorMessage('Lien de réinitialisation du mot de passe envoyé à votre adresse e-mail.');
      setResetSuccess(false); // Réinitialisation de l'état après envoi du lien
    } catch (error) {
      console.error("Détails de l'erreur:", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Une erreur s'est produite. Veuillez réessayer.");
      } else if (error.request) {
        setErrorMessage("Pas de réponse du serveur. Veuillez réessayer plus tard.");
      } else {
        setErrorMessage("Une erreur inattendue s'est produite. Veuillez réessayer.");
      }
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!token) {
      setErrorMessage("Token invalide ou manquant.");
      return;
    }

    try {
      await axios.post('https://localhost:7174/api/Account/reset-password', {
        token,
        newPassword
      });
      setResetSuccess(false);
      setErrorMessage('');
      alert("Mot de passe réinitialisé avec succès.");
    } catch (error) {
      console.error("Détails de l'erreur:", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Une erreur s'est produite. Veuillez réessayer.");
      } else if (error.request) {
        setErrorMessage("Pas de réponse du serveur. Veuillez réessayer plus tard.");
      } else {
        setErrorMessage("Une erreur inattendue s'est produite. Veuillez réessayer.");
      }
    }
  };

  return (
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
        <Typography variant="h4">Réinitialiser le mot de passe</Typography>
        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
        {!resetSuccess ? (
          <>
            <TextField
              fullWidth
              label="Adresse e-mail"
              margin="normal"
              value={email}
              onChange={handleEmailChange}
              error={!emailValid && email.length > 0}
              helperText={!emailValid && email.length > 0 ? "Adresse e-mail invalide" : ""}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleResetPasswordRequest}
              disabled={!emailValid}
            >
              Envoyer le lien de réinitialisation
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1">Veuillez entrer votre nouveau mot de passe.</Typography>
            <TextField
              fullWidth
              label="Nouveau mot de passe"
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleResetPasswordSubmit}>
              Réinitialiser le mot de passe
            </Button>
          </>
        )}
        <Typography variant="body2" component={Link} to="/login-page" sx={{ mt: 2 }}>
          Retour à la connexion
        </Typography>
      </Box>
    </Container>
  );
};

export default ResetPassword;
