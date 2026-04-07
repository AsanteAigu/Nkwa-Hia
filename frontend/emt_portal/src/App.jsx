import React from 'react';
import { useEmt } from './context/EmtContext.jsx';
import EmtLogin from './components/EmtLogin.jsx';
import ParamedicDashboard from './components/ParamedicDashboard.jsx';
import DriverDashboard from './components/DriverDashboard.jsx';

export default function App() {
  const { isAuthenticated, user } = useEmt();

  if (!isAuthenticated) return <EmtLogin />;
  if (user?.role === 'driver') return <DriverDashboard />;
  return <ParamedicDashboard />;
}
