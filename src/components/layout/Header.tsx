import React from "react";

interface HeaderProps {
    title: string;
}

export function Header({title}: HeaderProps){
    return(
        <header className="flex items-center justify-between w-full p-4 border-b border-gray-200">

            <h1 className="text-3xl font-bold text-gray-800">
                {title}
            </h1>

            <div className="flex items-center space-x-3">
                <span className="text-md text-gray-600">
                Olá, [nome do consultor]
                </span>
            </div>
        </header>
    );
}