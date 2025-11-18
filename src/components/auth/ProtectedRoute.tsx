import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute(){
    const token = localStorage.getItem('authToken');

    if(!token){
        // 'replace' irá impedir o retorno a página através do voltar
        return <Navigate to="/login" replace/>;
    }

    return <Outlet/>;
}