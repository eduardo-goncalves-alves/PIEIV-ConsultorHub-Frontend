import React, {useState} from "react";
import { Sidebar } from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { ConfirmModal } from "../ConfirmModal";

export function MainLayout(){
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');

        setIsLogoutModalOpen(false);

        navigate('/login');
    }
    return(
            <>
            <div className="flex h-screen w-screen bg-slate-100">
                <Sidebar onLogoutClick={() => setIsLogoutModalOpen(true)} />
        
            <main className="flex-1 flex flex-col overflow-auto">
                <div className="p-8 ">
                <Outlet />
                </div>
            </main>
        </div>
        <ConfirmModal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)} 
            onConfirm={handleLogout} 
        >
            {/* A Mensagem que você quer mostrar */}
            <h2 className="text-xl font-bold text-gray-800">Confirmar Saída</h2>
            <p className="mt-2 text-gray-600">
            Você tem certeza que deseja sair do sistema?
            </p>
        </ConfirmModal>
        </>
    );
}
