import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' 

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { ThemeProvider } from './context/ThemeContext.tsx';

import { LoginPage } from './pages/Login.tsx';
import { DashboardPage } from './pages/Dashboard.tsx';
import { MainLayout } from './components/layout/MainLayout.tsx'
import { ClientesPage } from './pages/Clientes.tsx';
import { ApolicesPage } from './pages/Apolices.tsx';
import { SeguradoraPage } from './pages/Seguradoras.tsx';
import { RedefinirSenhaPage } from './pages/EsqueciSenha.tsx';
import { ResetarSenhaPage } from './pages/ResetarSenha.tsx';
import { PerfilPage } from './pages/Perfil.tsx';
import { CadastroPage } from './pages/Cadastro.tsx';

import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';

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
    path: "/resetar-senha/", 
    element: <ResetarSenhaPage />,
  },
  {
    path: "/cadastro",
    element: <CadastroPage />,
  },

  {
    element: <ProtectedRoute />, 
    children: [
      {
        element: <MainLayout />, 
        children: [
          {
            path: "/", 
            element: <DashboardPage />,
          },
          {
            path: "/clientes",
            element: <ClientesPage />,
          },
          {
            path: "/apolices",
            element: <ApolicesPage />,
          },
          {
            path: "/seguradoras",
            element: <SeguradoraPage />,
          },
          {
            path: "/perfil",
            element: <PerfilPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)