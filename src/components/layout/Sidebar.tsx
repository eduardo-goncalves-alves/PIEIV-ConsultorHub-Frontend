import React from "react";
import { NavLink } from "react-router-dom";
import { LuChartNoAxesCombined, LuUsers, LuFileText, LuLogOut } from 'react-icons/lu';

export function Sidebar() {
  const baseLinkClass = "flex items-center w-full p-3 rounded-lg text-left hover:bg-slate-700 transition-colors";
  const activeLinkClass = "bg-[#40BEBE] text-white hover:bg-[#40BEBE]";

  return (
    <aside className="w-64 h-screen text-white flex flex-col bg-[#3D3E7E]">
      
      <div className="p-6 flex items-center justify-center border-b border-slate-700">
        <img src="/logo_consultorhub_white.png" alt="Logo" className="w-32" />
      </div>

      <nav className="flex-1 p-4 space-y-3">
        
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `${baseLinkClass} ${isActive ? activeLinkClass : ''}`
          }
        >
          <LuChartNoAxesCombined className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>

        <NavLink 
          to="/clientes" 
          className={({ isActive }) => 
            `${baseLinkClass} ${isActive ? activeLinkClass : ''}`
          }
        >
          <LuUsers className="mr-3 h-5 w-5" /> 
          Clientes
        </NavLink>
        
        <NavLink 
          to="/apolices" 
          className={({ isActive }) => 
            `${baseLinkClass} ${isActive ? activeLinkClass : ''}`
          }
        >
          <LuFileText className="mr-3 h-5 w-5" /> 
          Apólices
        </NavLink>
      </nav>

      {/* 3. O Botão de Sair (no final) */}
      <div className="p-4 border-t border-slate-700">
        <button 
          className={`${baseLinkClass} text-red-400 hover:bg-red-900/50`}
        >
          <LuLogOut className="mr-3 h-5 w-5" /> 
          Sair
        </button>
      </div>
    </aside>
  );
}