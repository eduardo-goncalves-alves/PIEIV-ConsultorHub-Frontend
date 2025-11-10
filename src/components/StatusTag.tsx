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

export function StatusTag({ status }: StatusTagProps) {
  
  const colorClass = statusColorMap[status.toUpperCase()] || statusColorMap['DEFAULT'];

  return (
    <span 
      className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}
    >
      {status}
    </span>
  );
}