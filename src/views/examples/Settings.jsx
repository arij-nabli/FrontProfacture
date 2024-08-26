import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, Grid, Paper, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Settings = ({ onProfilePictureChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onProfilePictureChange(selectedFile);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUpdatePassword = () => {
    const savedPassword = localStorage.getItem('userPassword');

    if (currentPassword !== savedPassword) {
      setError('Current password is incorrect.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    localStorage.setItem('userPassword', newPassword);
    setError(''); // Clear any existing errors
    alert('Password updated successfully!');
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', bgcolor: '#f0f2f5' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h5" gutterBottom align="center">Settings</Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Change Password</Typography>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <TextField
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, width: '100%' }}
              onClick={handleUpdatePassword}
            >
              Update Password
            </Button>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="h6">Update Profile Picture</Typography>
            {preview ? (
              <Avatar src={preview} sx={{ width: 128, height: 128, mt: 2 }} />
            ) : (
              <Avatar sx={{ width: 128, height: 128, mt: 2 }}>U</Avatar>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginRight: '8px' }} />
              <Button variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Settings;
