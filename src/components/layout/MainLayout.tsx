import React from "react";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout(){
    return(
        <div className="flex h-screen w-screen bg-slate-100">
            <Sidebar />
      
        <main className="flex-1 flex flex-col overflow-auto">
            
            {/* (Aqui será adicionado o Header.tsx depois) */}
            
            <div className="p-8 ">
            <Outlet />
            </div>
        </main>
    </div>
    )
}
