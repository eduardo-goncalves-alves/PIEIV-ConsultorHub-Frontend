import React from "react";

interface StatusTagProps {
  status: string;
}

const statusColorMap: { [key: string]: string } = {
  'ATIVO': 'bg-green-100 text-green-800',
  'INATIVO': 'bg-red-100 text-red-800',
  'PENDENTE': 'bg-yellow-100 text-yellow-800',
  'DEFAULT': 'bg-gray-100 text-gray-800', 
};

interface StatusTagProps {
    status: string;
}

export function StatusTag({ status }: StatusTagProps) {
    let classes = '';

    switch (status) {
        case 'ATIVO':
            classes = 'bg-green-100 text-green-700';
            break;
        case 'CANCELADO':
            classes = 'bg-yellow-100 text-yellow-700'; 
            break;
        case 'INATIVO':
            classes = 'bg-gray-100 text-gray-700';
            break;
        default:
            classes = 'bg-gray-200 text-gray-800';
    }

    return (
        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${classes}`}>
            {status}
        </span>
    );
}