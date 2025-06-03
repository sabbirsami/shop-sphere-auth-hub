import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';
import SubdomainDashboard from '../components/dashboard/SubdomainDashboard';
import Home from '../components/home/Home';
import DashboardLayout from '../components/layouts/DashboardLayout';
import MainLayout from '../components/layouts/MainLayout';
import { isSubdomain } from '../utils/subdomain';

const createRouterConfig = () => {
  if (isSubdomain()) {
    return [
      {
        path: '/',
        element: <SubdomainDashboard />,
      },
      {
        path: '*',
        element: <SubdomainDashboard />,
      },
    ];
  }

  return [
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
          element: <Dashboard />,
        },
      ],
    },
    {
      path: '*',
      element: (
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900">404: Page not found</h1>
        </div>
      ),
    },
  ];
};

export const router = createBrowserRouter(createRouterConfig());
