import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/home/Home';
import DashboardLayout from '../components/layouts/DashboardLayout';
import MainLayout from '../components/layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <h1 className="text-3xl font-bold underline">Welcome to the Dashboard!</h1>,
      },
    ],
  },
]);
