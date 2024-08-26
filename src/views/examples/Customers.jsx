import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Customers = () => {
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [newFile, setNewFile] = useState(null);

  // Load files from localStorage when the component mounts
  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem('customerFiles')) || [];
    setFiles(savedFiles);
  }, []);

  // Save files to localStorage whenever the files state changes
  useEffect(() => {
    localStorage.setItem('customerFiles', JSON.stringify(files));
  }, [files]);

  const handleOpen = (index) => {
    setSelectedFileIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFileIndex(null);
    setNewFile(null);
  };

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const handleSave = () => {
    if (newFile && selectedFileIndex !== null) {
      const updatedFiles = [...files];
      updatedFiles[selectedFileIndex] = newFile;
      setFiles(updatedFiles);
    }
    handleClose();
  };

  const handleDelete = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handleAddFile = (e) => {
    const newFile = e.target.files[0];
    setFiles([...files, newFile]);

    // Update localStorage with the new files
    const updatedFiles = [...files, newFile];
    localStorage.setItem('customerFiles', JSON.stringify(updatedFiles));
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Button
        variant="contained"
        component="label"
      >
        Add File
        <input
          type="file"
          hidden
          accept="application/pdf,image/*"
          onChange={handleAddFile}
        />
      </Button>
      <List>
        {files.map((file, index) => (
          <ListItem key={index}>
            <ListItemText primary={file.name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleOpen(index)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit the file, please select a new file.
          </DialogContentText>
          <Button
            variant="contained"
            component="label"
          >
            Upload File
            <input
              type="file"
              hidden
              accept="application/pdf,image/*"
              onChange={handleFileChange}
            />
          </Button>
          {newFile && <Box sx={{ marginTop: '16px' }}>Selected File: {newFile.name}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;

