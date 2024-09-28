import React, { useState, useEffect } from 'react';
import { 
  Box, Button, IconButton, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle, 
  List, ListItem, ListItemText, ListItemSecondaryAction, 
  TextField, Typography, Snackbar 
} from '@mui/material';
import {Select, MenuItem,FormControl, InputLabel} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Repertoire = ({ selectedClientIndex, setClients, clients }) => {
  const [open, setOpen] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [clientName, setClientName] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDateSelectors, setShowDateSelectors] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [offersTable, setOffersTable] = useState([]);
  const [files, setFiles] = useState([]);
  const [exportFilter, setExportFilter] = useState('');
  const [dateSelector, setDateSelector] = useState('');

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [errors, setErrors] = useState({ startDate: '', endDate: '' });

  

  const fetchClientDetails = async () => {
    if (selectedClientIndex !== null) {
      try {
        const clientId = clients[selectedClientIndex]?.idRepertoire;
        if (clientId) {
          const response = await axios.get(`https://localhost:44380/api/Repertoire/${clientId}`);
          if (response.status === 200) {
            const clientData = response.data;
            setSelectedClient(clientData);
            fetchFiles(clientData.idRepertoire); // Appel à fetchFiles avec l'ID du répertoire
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du répertoire:', error);
        setSnackbarMessage('Erreur lors de la récupération des détails du répertoire');
        setSnackbarOpen(true);
      }
    }
  
  };
  
  const fetchFiles = async (repertoireId) => {
    try {
      const response = await axios.get(`https://localhost:44380/api/Files?repertoireId=${repertoireId}`);
      if (response.status === 200) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error);
      setSnackbarMessage('Erreur lors de la récupération des fichiers');
      setSnackbarOpen(true);
    }
  };
 
  useEffect(() => {
    // Update endDate if startDate is set
    if (startDate) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + 7);
      setEndDate(newEndDate);
    }
  }, [startDate]);

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (selectedClientIndex !== null && clients.length > 0) {
        try {
          const clientId = clients[selectedClientIndex]?.idRepertoire;
          if (clientId) {
            const response = await axios.get(`https://localhost:44380/api/Repertoire/${clientId}`);
            if (response.status === 200) {
              setSelectedClient(response.data);
            } else {
              setSnackbarMessage('Détails du client introuvables.');
              setSnackbarOpen(true);
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
  const handleExportChange = (event) => {
    const selectedValue = event.target.value;
    setExportFilter(selectedValue);

    if (selectedValue === 'date') {
      setShowDateSelectors(true);
    } else {
      setShowDateSelectors(false);
      setDateSelector('');
    }
  };


  const handleDateSelectorChange = (event) => {
    setDateSelector(event.target.value);
    // Réinitialiser les dates si le sélecteur de date change
    if (event.target.value !== 'week') {
      setStartDate(null);
      setEndDate(null);
    }
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
              idFichier: file.idFichier || 0,
              nomFichier: file.nomFichier || '',
              type: file.type || '',
              dateImportation: file.dateImportation || null,
              nomFichierTraite: file.nomFichierTraite || '',
              nomClient: file.nomClient || '', 
              nomFournisseur: file.nomFournisseur || '', 
              dateFacture: file.dateFacture || null, 
              montantHT: file.montantHT || 0, 
              fraisImmatriculation: file.fraisImmatriculation || 0, // Corrigé de `FraisImmatriculation` à `fraisImmatriculation`
              montantFiscal: file.montantFiscal || 0,
              codeTVA: file.codeTVA || '', // Corrigé de `CodeTVA` à `codeTVA`
              timbreFiscal: file.timbreFiscal || 0, // Corrigé de `TimbreFiscal` à `timbreFiscal`
              totalTVA: file.totalTVA || 0, // Corrigé de `TotalTVA` à `totalTVA`
              montantNetAPayer: file.montantNetAPayer || 0, // Corrigé de `MontantNetAPayer` à `montantNetAPayer`
              matriculeFiscal: file.matriculeFiscal || '' // Corrigé de `MatriculeFiscal` à `matriculeFiscal`
          }));

            // Mise à jour de l'état des fichiers dans le répertoire sélectionné
            const updatedFiles = [...(selectedClient.fichiers.$values || []), ...newFiles];
            setSelectedClient({
                ...selectedClient,
                fichiers: {
                    ...selectedClient.fichiers,
                    $values: updatedFiles
                }
            });

            // Mise à jour de l'état global des clients pour refléter les nouvelles données
            const updatedClients = clients.map((cl, index) =>
                index === selectedClientIndex ? { ...cl, fichiers: { ...cl.fichiers, $values: updatedFiles } } : cl
            );
            setClients(updatedClients);

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
  const handleFileExtraction = async (index) => {
    const client = clients[selectedClientIndex];
    if (!client || !client.fichiers || client.fichiers.$values.length === 0) {
        setError('Veuillez sélectionner un client et au moins un fichier.');
        return;
    }

    const selectedFile = client.fichiers.$values[index];
    if (!selectedFile) {
        await fetchClientDetails();
        setError('Fichier sélectionné non disponible.');
        return;
    }

    const fileNameToTest = selectedFile.nomFichierTraite;
    if (!fileNameToTest) {
        setError('Nom du fichier traité non disponible.');
        return;
    }

    const formData = new FormData();

    try {
        const response = await axios.get(
            `https://localhost:44380/api/Files/DownloadFile/${encodeURIComponent(fileNameToTest)}`,
            { responseType: 'blob' }
        );

        if (response.status === 200) {
            const blob = new Blob([response.data]);
            formData.append('files', blob, fileNameToTest);
        } else {
            throw new Error(`Erreur lors du téléchargement du fichier: ${response.status}`);
        }
    } catch (error) {
        setError('Erreur lors du téléchargement des fichiers.');
        return;
    }

    formData.append('repertoire_name', client.nomRepertoire || '');
    formData.append('user_prompt', '');

    try {
        const response = await axios.post('http://localhost:5000/process-files', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const jsonString = response.data.outputs[0][0];
        const cleanedJsonString = jsonString.replace(/```json\n|\n```/g, '');
        const parsedData = JSON.parse(cleanedJsonString);
console.log(parsedData);
        const {
            nomClient,
            nomFournisseur,
            dateFacture,
            numFacture,
            montantFiscal,
            matriculeFiscale,
            codeTVA,
            montantHT,
            totalTVA,
            timbreFiscal
        } = parsedData;

        const newExtractedData = {
            fileName: fileNameToTest,
            data: parsedData
        };

        setExtractedData(newExtractedData);
        setOffersTable(response.data.jsonObject);
        setError(null);

        if (selectedFile.idFichier) {
            try {
                const updateParams = {
                    nomClient: nomClient || '',
                    nomFournisseur: nomFournisseur || '',
                    dateFacture: dateFacture || '',
                    numFacture: numFacture || '',
                    montantFiscal: montantFiscal ?? undefined,
                    matriculeFiscale: matriculeFiscale || '',
                    codeTVA: codeTVA || '',
                    montantHT: montantHT ?? undefined,
                    totalTVA: totalTVA ?? undefined,
                    timbreFiscal: timbreFiscal ?? undefined
                };

                const queryString = new URLSearchParams(updateParams).toString();
                const updateUrl = `https://localhost:44380/api/Files/${encodeURIComponent(selectedFile.idFichier)}?${queryString}`;
                const updateResponse = await axios.put(updateUrl);

                await fetchFiles(selectedClient.idRepertoire);
                await fetchClientDetails();

                if (updateResponse.status === 200) {
                    console.log("Fichier mis à jour avec succès.");
                } else {
                    throw new Error(`Erreur lors de la mise à jour du fichier: ${updateResponse.status}`);
                }
            } catch (error) {
                const errorMessage = error.response && error.response.data && error.response.data.errors
                    ? `Erreur de validation: ${JSON.stringify(error.response.data.errors)}`
                    : `Erreur lors de la mise à jour du fichier: ${error.message}`;
                console.error(errorMessage);
                setError(errorMessage);
            }
        } else {
            setError('ID du fichier est non défini.');
        }
    } catch (error) {
        const errorMessage = error.response ? `Erreur lors de l'extraction des fichiers: ${error.response.data.message}` : `Erreur lors de l'extraction des fichiers.`;
        setError(errorMessage);
    }
};

const handleExport = async () => {
  let apiUrl = '';

  // Fonction pour convertir le mois en numéro
  const getMonthNumber = (monthNumber) => {
    return monthNumber; // moisNumber est déjà un nombre, pas besoin de conversion supplémentaire
  };

  // Gestion des filtres d'export
  if (exportFilter === 'clientName') {
    apiUrl = `https://localhost:44380/api/Files/export?repertoireId=${selectedClient.idRepertoire}`;
  } else if (exportFilter === 'providerName') {
    apiUrl = `https://localhost:44380/api/Files/export-by-fournisseur?repertoireId=${selectedClient.idRepertoire}`;
  } else if (exportFilter === 'date') {
    if (dateSelector === 'memedate') {
      apiUrl = `https://localhost:44380/api/Files/export-by-date?repertoireId=${selectedClient.idRepertoire}`;
    } else if (dateSelector === 'week') {
      if (!startDate || !endDate) {
        alert('Veuillez sélectionner une plage de dates valide.');
        return;
      }
      const startDateISO = startDate.toISOString();
      const endDateISO = endDate.toISOString();
      apiUrl = `https://localhost:44380/api/Files/export-by-date-range?repertoireId=${selectedClient.idRepertoire}&startDate=${encodeURIComponent(startDateISO)}&endDate=${encodeURIComponent(endDateISO)}`;
    } else if (dateSelector === 'month') {
      const monthNumber = getMonthNumber(selectedMonth);
      if (monthNumber === null) {
        alert('Mois sélectionné invalide.');
        return;
      }
      apiUrl = `https://localhost:44380/api/Files/export-by-month?month=${monthNumber}&repertoireId=${selectedClient.idRepertoire}`;
    } else if (dateSelector === 'year') {
      apiUrl = `https://localhost:44380/api/Files/export-by-year?repertoireId=${selectedClient.idRepertoire}&year=${selectedYear}`;
    }
  }

  if (apiUrl) {
    try {
      const response = await axios.get(apiUrl, {
        responseType: 'blob', // Pour le téléchargement de fichiers
      });

      // Crée un lien pour télécharger le fichier
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;

      // Extrait le nom du fichier de l'en-tête 'content-disposition'
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename*=UTF-8\'\'')[1]
        : `${selectedClient.nomRepertoire}.xlsx`; // Utiliser un nom par défaut si nécessaire

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl); // Libérer la mémoire
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      alert('Une erreur est survenue lors de l\'exportation.');
    }
  }
};





return (
  <Box sx={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Ajouter un répertoire */}
      <TextField
        label="Nom du Répertoire"
        variant="outlined"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        sx={{ mb: 2, width: '100%', maxWidth: 600 }}
      />
      <Button variant="contained" onClick={handleAddClient} sx={{ mb: 4 }}>
        Ajouter Répertoire
      </Button>

      {/* Si un répertoire est sélectionné */}
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
            <Button variant="contained" onClick={handleEditClientName}>
              Modifier nom Répertoire
            </Button>
            <Button variant="contained" color="error" onClick={handleDeleteClient}>
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
              <Button variant="contained" component="span">
                Ajouter des fichiers
              </Button>
            </label>
          </Box>

          {/* Affichage des fichiers */}
          {selectedClient.fichiers && selectedClient.fichiers.$values && selectedClient.fichiers.$values.length > 0 ? (
            <>
              <List>
                {selectedClient.fichiers.$values.map((file, index) => (
                  <ListItem key={file.idFichier} sx={{ mb: 1 }}>
                    <ListItemText
                      primary={file.nomFichier || 'Nom de fichier non disponible'}
                      secondary={file.dateImportation ? new Date(file.dateImportation).toLocaleString() : 'Date non disponible'}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                        <DeleteIcon />
                      </IconButton>
                      <Button variant="contained" onClick={() => handleFileExtraction(index)}>
                        Extraction Fichiers
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              {/* Données extraites */}
              {selectedClient.fichiers.$values.map((file, index) => (
                <Box key={file.idFichier} sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Données extraites du fichier : {file.nomFichier || 'Nom de fichier non disponible'}
                  </Typography>

                  <Box key={index} sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 4 }}>
                    <Box sx={{ flex: '1 1 45%' }}>
                      <Typography variant="body1"><strong>Nom du client :</strong> {file.nomClient || 'Non disponible'}</Typography>
                      <Typography variant="body1"><strong>Nom du fournisseur :</strong> {file.nomFournisseur || 'Non disponible'}</Typography>
                      <Typography variant="body1"><strong>Date de facture :</strong> {file.dateFacture ? new Date(file.dateFacture).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Non disponible'}</Typography>
                      <Typography variant="body1"><strong>Numéro de facture :</strong> {file.numFacture || 'Non disponible'}</Typography>
                      <Typography variant="body1"><strong>Montant fiscal :</strong> {file.montantFiscal !== null ? file.montantFiscal : 'Non disponible'}</Typography>
                    </Box>

                    <Box sx={{ flex: '1 1 45%' }}>
                      <Typography variant="body1"><strong>Matricule fiscale :</strong> {file.matriculeFiscale || 'Non disponible'}</Typography>
                      <Typography variant="body1"><strong>Code TVA :</strong> {file.codeTVA || 'Non disponible'}</Typography>
                      <Typography variant="body1"><strong>Montant HT :</strong> {file.montantHT !== null ? file.montantHT : 'Non disponible'}</Typography>
                      <Typography variant="body1"><strong>Total TVA :</strong> {file.totalTVA !== null ? file.totalTVA : 'Non disponible'}</Typography>
                      <Typography variant="body1"><strong>Timbre fiscal :</strong> {file.timbreFiscal !== null ? file.timbreFiscal : 'Non disponible'}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}

              {/* Export en Excel */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Export fichiers en Excel</Typography>
                <Select value={exportFilter} onChange={handleExportChange} fullWidth>
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="clientName">Par Nom du Client</MenuItem>
                  <MenuItem value="providerName">Par Nom du Fournisseur</MenuItem>
                  <MenuItem value="date">Par Date</MenuItem>
                </Select>
                {showDateSelectors && (
                  <Box mt={2}>
                    <Select value={dateSelector} onChange={handleDateSelectorChange} fullWidth>
                      <MenuItem value="week">Par Semaine</MenuItem>
                      <MenuItem value="memedate">De même date</MenuItem>
                      <MenuItem value="month">Par Mois</MenuItem>
                      <MenuItem value="year">Par Année</MenuItem>
                    </Select>
                    {dateSelector === 'week' && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} placeholderText="Première Date" dateFormat="yyyy-MM-dd" className="datepicker-input" isClearable style={{ flex: 1 }} />
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} placeholderText="Deuxième Date" dateFormat="yyyy-MM-dd" className="datepicker-input" isClearable style={{ flex: 1 }} />
                      </Box>
                    )}
                    {dateSelector === 'month' && (
                      <Box mt={2}>
                        <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} fullWidth>
                          <MenuItem value="">Sélectionnez un mois</MenuItem>
                          {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map((month, index) => (
                            <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                          ))}
                        </Select>
                      </Box>
                    )}
                    {dateSelector === 'year' && (
                      <Box mt={2}>
                        <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} fullWidth>
                          <MenuItem value="">Sélectionnez une année</MenuItem>
                          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                          ))}
                        </Select>
                      </Box>
                    )}
                  </Box>
                )}
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={() => handleExport('excel')} sx={{ mr: 2 }}>
                    Exporter en Excel
                  </Button>
                  <Button variant="contained" onClick={() => handleExport('csv')}>
                    Exporter en CSV
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>Aucun fichier n'est disponible.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Repertoire;