import React, { useState, useEffect } from 'react';
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Dashboard as DashboardIcon, Settings as SettingsIcon, Error as ErrorIcon } from '@mui/icons-material';
import FolderIcon from '@mui/icons-material/Folder';
import axios from 'axios';

const Sidebar = ({ onClientSelect, refreshRepertoires, selectedClientId }) => {
  const [repertoires, setRepertoires] = useState([]);

  useEffect(() => {
    const utilisateurId = localStorage.getItem("userId");
    const fetchRepertoires = async () => {
      try {
        const response = await axios.get('https://localhost:44380/api/Repertoire/user/' + utilisateurId);
        setRepertoires(response.data.$values || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des répertoires:', error);
        setRepertoires([]);
      }
    };

    fetchRepertoires();
  }, [refreshRepertoires]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          bgcolor: '#1E1E2D',
          color: 'white',
          paddingTop: 2,
        },
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" noWrap>
          Pro-Facture
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/dashboard" aria-label="Dashboard">
          <ListItemIcon><DashboardIcon sx={{ color: 'white' }} /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/repertoire" aria-label="Répertoire">
          <ListItemIcon><FolderIcon sx={{ color: 'white' }} /></ListItemIcon>
          <ListItemText primary="Répertoire" />
        </ListItem>

        {repertoires.length > 0 ? (
          repertoires.map(repertoire => (
            <ListItem
              button
              key={repertoire.idRepertoire}
              onClick={() => onClientSelect(repertoire)}
              selected={selectedClientId === repertoire.idRepertoire}
              aria-label={`Répertoire ${repertoire.nomRepertoire}`}
            >
              <ListItemText primary={repertoire.nomRepertoire} />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="Aucun répertoire disponible" />
          </ListItem>
        )}

        <ListItem button component={Link} to="/dashboard/settings" aria-label="Paramètres">
          <ListItemIcon><SettingsIcon sx={{ color: 'white' }} /></ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/error" aria-label="Erreur">
          <ListItemIcon><ErrorIcon sx={{ color: 'white' }} /></ListItemIcon>
          <ListItemText primary="Erreur" />
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ padding: 2 }}>
        <Typography variant="caption" display="block" gutterBottom>
          Besoin de plus de fonctionnalités ?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard/gestion-abonnement"
        >
          Version Pro
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
