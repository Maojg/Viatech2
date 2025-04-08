import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa los componentes desde las rutas en minúsculas
import Login from './pages/login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
