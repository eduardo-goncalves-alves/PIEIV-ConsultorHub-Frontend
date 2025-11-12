import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' 


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


import { LoginPage } from './pages/Login.tsx';
import { DashboardPage } from './pages/Dashboard.tsx';
import { MainLayout } from './components/layout/MainLayout.tsx'
import { ClientesPage } from './pages/Clientes.tsx';
import { ApolicesPage } from './pages/Apolices.tsx';
import { SeguradoraPage } from './pages/Seguradoras.tsx';
import { RedefinirSenhaPage } from './pages/EsqueciSenha.tsx';
import { ResetarSenhaPage } from './pages/ResetarSenha.tsx';

// Mapa de rotas
const router = createBrowserRouter([
  {
    path: "/login", 
    element: <LoginPage />, 
  },
  {
    path: "/redefinir-senha", 
    element: <RedefinirSenhaPage />, 
  },
  {
  path: "/resetar-senha", 
  element: <ResetarSenhaPage />,
  },
  {
    path: "/", 
    element: <MainLayout />, 

    children: [
      {
        path: "/", 
        element: <DashboardPage />, 
      },
      {
        path: "/clientes", // 
        element: <ClientesPage />,
      },
      {
        path: "/apolices", // 
        element: <ApolicesPage />,
      },
      {
        path: "/seguradoras", // 
        element: <SeguradoraPage />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)