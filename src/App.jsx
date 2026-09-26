import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AppLayout from './components/layout/AppLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppLayout title="Dashboard" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<AppLayout title="Clients" />}>
        <Route path="/clients" element={<Clients />} />
      </Route>
      <Route element={<AppLayout title="Projects" />}>
        <Route path="/projects" element={<Projects />} />
      </Route>
      <Route element={<AppLayout title="Project Details" />}>
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Route>
    </Routes>
  );
}