import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/home/Home';
import DashboardLayout from '../components/layouts/DashboardLayout';
import MainLayout from '../components/layouts/MainLayout';

import SubdomainDashboard from '../components/dashboard/SubdomainDashboard';
import { isSubdomain } from '../utils/subdomain';

// Create different routers based on whether we're on a subdomain
const createRouterConfig = () => {
  if (isSubdomain()) {
    // Subdomain routing - only show subdomain dashboard
    return [
      {
        path: '/',
        element: <SubdomainDashboard />,
      },
      {
        path: '*',
        element: <SubdomainDashboard />, // Redirect all routes to dashboard on subdomains
      },
    ];
  }

  // Main domain routing
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
    },
  ];
};

export const router = createBrowserRouter(createRouterConfig());
