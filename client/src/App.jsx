import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PatientList from './pages/PatientList.jsx';
import PatientNew from './pages/PatientNew.jsx';
import PatientDetail from './pages/PatientDetail.jsx';
import ScoreNew from './pages/ScoreNew.jsx';
import Reports from './pages/Reports.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Signup />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pacientes" element={<PatientList />} />
        <Route path="/pacientes/novo" element={<PatientNew />} />
        <Route path="/pacientes/:id" element={<PatientDetail />} />
        <Route path="/pacientes/:id/escore" element={<ScoreNew />} />
        <Route path="/relatorios" element={<Reports />} />
        <Route
          path="/admin"
          element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
