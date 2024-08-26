import React, { useState, useEffect } from 'react';
import { 
  Box, Button, IconButton, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle, 
  List, ListItem, ListItemText, ListItemSecondaryAction, 
  TextField, Typography, Snackbar 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Repertoire = ({ selectedClientIndex, setClients, clients }) => {
  const [open, setOpen] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [clientName, setClientName] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (selectedClientIndex !== null) {
        try {
          const clientId = clients[selectedClientIndex]?.idRepertoire;
          if (clientId) {
            const response = await axios.get(`https://localhost:44380/api/Repertoire/${clientId}`);
            if (response.status === 200) {
              setSelectedClient(response.data);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des détails du répertoire:', error);
          setSnackbarMessage('Erreur lors de la récupération des détails du répertoire');
          setSnackbarOpen(true);
        }
      }
    };

    fetchClientDetails();
  }, [selectedClientIndex, clients]);

  const handleOpen = (fileIndex) => {
    setSelectedFileIndex(fileIndex);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFileIndex(null);
    setNewFiles([]);
  };

  const handleFileChange = (e) => {
    setNewFiles(e.target.files);
  };

  const handleSave = async () => {
    if (newFiles.length > 0 && selectedClient && selectedFileIndex !== null) {
      const updatedClient = { ...selectedClient };
      const fileToUpdate = updatedClient.fichiers?.$values[selectedFileIndex];
      if (fileToUpdate) {
        const formData = new FormData();
        Array.from(newFiles).forEach((file) => {
          formData.append('files', file);
        });

        try {
          const response = await axios.put(
            `https://localhost:44380/api/Files/${fileToUpdate.idFichier}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );

          if (response.status === 200) {
            updatedClient.fichiers.$values[selectedFileIndex] = {
              ...fileToUpdate,
              nomFichier: newFiles[0].name,
              dateImportation: new Date().toISOString(),
            };
            setSelectedClient(updatedClient);
            setSnackbarMessage('Fichier mis à jour avec succès');
            setSnackbarOpen(true);
          } else {
            console.error('Erreur lors de la sauvegarde du fichier:', response.status);
            setSnackbarMessage('Erreur lors de la sauvegarde du fichier');
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error('Erreur lors de la sauvegarde du fichier:', error);
          setSnackbarMessage('Erreur lors de la sauvegarde du fichier');
          setSnackbarOpen(true);
        }
      }
    }
    handleClose();
  };

  const handleDelete = async (fileIndex) => {
    if (selectedClient) {
      const fileToDelete = selectedClient.fichiers?.$values[fileIndex];
      if (fileToDelete) {
        try {
          await axios.delete(`https://localhost:44380/api/Files/${fileToDelete.idFichier}`);
          const updatedFiles = selectedClient.fichiers.$values.filter((_, i) => i !== fileIndex);
          setSelectedClient({ 
            ...selectedClient, 
            fichiers: { ...selectedClient.fichiers, $values: updatedFiles } 
          });
          setSnackbarMessage('Fichier supprimé avec succès');
          setSnackbarOpen(true);
        } catch (error) {
          console.error('Erreur lors de la suppression du fichier:', error);
          setSnackbarMessage('Erreur lors de la suppression du fichier');
          setSnackbarOpen(true);
        }
      }
    }
  };

  const handleAddClient = async () => {
    const utilisateurId = localStorage.getItem("userId");
    if (clientName) {
      try {
        const response = await axios.post('https://localhost:44380/api/Repertoire', {
          nomRepertoire: clientName, 
          utilisateurId: utilisateurId,
          fichiers: [],
        });

        if (response.status === 201) {
          const newClient = response.data;
          setClients([...clients, newClient]);
          setClientName('');
          setSnackbarMessage('Répertoire ajouté avec succès');
          setSnackbarOpen(true);
        } else {
          console.error('Erreur lors de l\'ajout du répertoire. Statut:', response.status);
          setSnackbarMessage('Erreur lors de l\'ajout du répertoire');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout du répertoire:', error);
        setSnackbarMessage('Erreur lors de l\'ajout du répertoire');
        setSnackbarOpen(true);
      }
    }
  };

  const handleAddFiles = async (e) => {
    const files = e.target.files;
    if (files.length === 0 || !selectedClient) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });
    formData.append('repertoireId', selectedClient.idRepertoire);

    try {
      const response = await axios.post(
        `https://localhost:44380/api/Files/UploadFiles?repertoireId=${selectedClient.idRepertoire}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 200) {
        const newFiles = response.data.$values.map((file) => ({
          idFichier: file.idFichier,
          nomFichier: file.nomFichier,
          type: file.type,
          dateImportation: file.dateImportation,
        }));

        setSelectedClient({
          ...selectedClient,
          fichiers: {
            ...selectedClient.fichiers,
            $values: [...(selectedClient.fichiers.$values || []), ...newFiles],
          },
        });
        setSnackbarMessage('Fichiers ajoutés avec succès');
        setSnackbarOpen(true);
      } else {
        console.error('Erreur lors du téléchargement des fichiers:', response.status);
        setSnackbarMessage('Erreur lors du téléchargement des fichiers');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement des fichiers:', error);
      setSnackbarMessage('Erreur lors du téléchargement des fichiers');
      setSnackbarOpen(true);
    }
  };

  const handleEditClientName = async () => {
    const client = clients[selectedClientIndex];
  
    if (client && client.idRepertoire && editClientName) {
      try {
        const response = await axios.put(
          `https://localhost:44380/api/Repertoire/${client.idRepertoire}`,
          editClientName, // Envoi direct de la chaîne
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 204) {
          // Mettre à jour l'état avec le nouveau nom du répertoire
          const updatedClients = clients.map((cl, index) =>
            index === selectedClientIndex ? { ...cl, nomRepertoire: editClientName } : cl
          );
        
          setClients(updatedClients);
          setEditClientName('');  // Réinitialiser le champ d'édition
          setSnackbarMessage('Nom du répertoire modifié avec succès');
          setSnackbarOpen(true);
        } else {
          console.error('Erreur lors de la modification du répertoire. Statut:', response.status);
          setSnackbarMessage('Erreur lors de la modification du répertoire');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Erreur lors de la modification du répertoire:', error.response?.data || error.message);
        setSnackbarMessage('Erreur lors de la modification du répertoire');
        setSnackbarOpen(true);
      }
    } else {
      console.error('Client ou ID de client non défini ou nom de répertoire manquant.');
      setSnackbarMessage('Client ou ID de client non défini ou nom de répertoire manquant.');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteClient = async () => {
    if (selectedClient) {
      try {
        await axios.delete(`https://localhost:44380/api/Repertoire/${selectedClient.idRepertoire}`);
        const updatedClients = clients.filter((_, i) => i !== selectedClientIndex);
        setClients(updatedClients);
        setSelectedClient(null);
        setSnackbarMessage('Répertoire supprimé avec succès');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Erreur lors de la suppression du répertoire:', error);
        setSnackbarMessage('Erreur lors de la suppression du répertoire');
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Box sx={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <TextField
        label="Nom du Répertoire"
        variant="outlined"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        sx={{ mb: 2, width: '100%', maxWidth: 600 }}
      />
      <Button
        variant="contained"
        onClick={handleAddClient}
        sx={{ mb: 4 }}
      >
        Ajouter Répertoire
      </Button>
      {selectedClient && (
        <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedClient.nomRepertoire}
          </Typography>
          <TextField
            label="Modifier Répertoire"
            variant="outlined"
            value={editClientName}
            onChange={(e) => setEditClientName(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleEditClientName}
            >
              Modifier nom Répertoire
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteClient}
            >
              Supprimer Répertoire
            </Button>
            <input
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              id="upload-button"
              type="file"
              multiple
              onChange={handleAddFiles}
            />
            <label htmlFor="upload-button">
              <Button
                variant="contained"
                component="span"
              >
                Ajouter des fichiers
              </Button>
            </label>
          </Box>
          {selectedClient.fichiers && selectedClient.fichiers.$values && selectedClient.fichiers.$values.length > 0 ? (
            <List>
              {selectedClient.fichiers.$values.map((file, index) => (
                <ListItem key={file.idFichier} sx={{ mb: 1 }}>
                  <ListItemText
                    primary={file.nomFichier || 'Nom de fichier non disponible'}
                    secondary={file.dateImportation ? new Date(file.dateImportation).toLocaleString() : 'Date non disponible'}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpen(index)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">Aucun fichier disponible</Typography>
          )}
        </Box>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Modifier le Fichier</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sélectionnez un nouveau fichier pour remplacer le fichier actuel.
          </DialogContentText>
          <input
            type="file"
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSave} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Repertoire;
