import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import PublicProject from './pages/PublicProject';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import AppLayout from './components/layout/AppLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/p/:token" element={<PublicProject />} />

      <Route element={<AppLayout title="Dashboard" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<AppLayout title="Clients" />}>
        <Route path="/clients" element={<Clients />} />
      </Route>
      <Route element={<AppLayout title="Client Details" />}>
        <Route path="/clients/:id" element={<ClientDetail />} />
      </Route>
      <Route element={<AppLayout title="Projects" />}>
        <Route path="/projects" element={<Projects />} />
      </Route>
      <Route element={<AppLayout title="Project Details" />}>
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Route>
      <Route element={<AppLayout title="Tasks" />}>
        <Route path="/tasks" element={<Tasks />} />
      </Route>
      <Route element={<AppLayout title="Invoices" />}>
        <Route path="/invoices" element={<Invoices />} />
      </Route>
      <Route element={<AppLayout title="Invoice Details" />}>
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
      </Route>
      <Route element={<AppLayout title="Settings" />}>
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}