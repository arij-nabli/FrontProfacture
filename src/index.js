import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios'; // Assurez-vous que cette ligne est ajoutée

import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/vendor/font-awesome/css/font-awesome.min.css';
import 'assets/scss/argon-design-system-react.scss?v1.1.0';

import Index from 'views/Index.js';
import Landing from 'views/examples/Landing.js';
import Profile from 'views/examples/Profile.js';
import SignIn from 'views/examples/SignIn';
import SignUp from 'views/examples/SignUp';
import ResetPassword from 'views/examples/ResetPassword';
import Dashboard from 'views/examples/Dashboard';
import Repertoire from 'views/examples/Repertoire';
import Sidebar from 'views/examples/Sidebar';
import GestionAbonnement from 'views/GestionAbonnement';
const App = () => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    // Récupérer les répertoires au chargement du composant
    fetchRepertoires();
  }, []);

  useEffect(() => {
    // Sauvegarder les clients dans le localStorage à chaque modification
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const fetchRepertoires = async () => {
    try {
      const response = await axios.get('https://localhost:44380/api/Repertoire');
      setClients(response.data.$values || []); // Ajustez en fonction de la structure des données de votre API
    } catch (error) {
      console.error('Erreur lors de la récupération des répertoires:', error);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClientId(client.idRepertoire);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Index />} />
        <Route path="/landing-page" exact element={<Landing />} />
        <Route path="/login-page" exact element={<SignIn />} />
        <Route path="/profile-page" exact element={<Profile />} />
        <Route path="/reset-password" exact element={<ResetPassword />} />
        <Route path="/register-page" exact element={<SignUp />} />
        <Route
          path="/dashboard/*"
          element={
            <>
              <Sidebar
                onClientSelect={handleClientSelect}
                refreshRepertoires={fetchRepertoires}
                selectedClientId={selectedClientId}
              />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route
  path="repertoire"
  element={
    <Repertoire
      clients={clients}
      setClients={setClients}
      selectedClientIndex={clients.findIndex(client => client.idRepertoire === selectedClientId)}
      setSelectedClientIndex={setSelectedClientId}
      refreshRepertoires={fetchRepertoires}
    />
  }
/>
<Route
                  path="gestion-abonnement"
                  element={<GestionAbonnement />} // Ajouter la route pour GestionAbonnement
                />
                <Route path="*" element={<Navigate to="/landing-page" />} />
              </Routes>
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
