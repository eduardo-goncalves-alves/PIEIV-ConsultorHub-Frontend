import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' 

// Import das funções do roteador
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// 3. Importe as páginas que você criou
import { LoginPage } from './pages/Login.tsx';
import { DashboardPage } from './pages/Dashboard.tsx';

// Mapa de rotas
const router = createBrowserRouter([
  {
    path: "/login", 
    element: <LoginPage />, 
  },
  {
    path: "/", 
    element: <DashboardPage />, 
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)