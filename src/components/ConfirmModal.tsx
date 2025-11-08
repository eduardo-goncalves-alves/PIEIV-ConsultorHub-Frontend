import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
}

export function ConfirmModal({isOpen, onClose, onConfirm, children}: ModalProps){
    if(!isOpen){
        return null;
    }
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <div className="text-xl text-gray-800">
                    {children}
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-white bg-[#40BEBE] rounderd-lg hover:bg-[#287474]"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-5 py-2 text-white bg-[#3D3E7E] rounderd-lg hover:bg-[#2d2e5e]"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )
}