import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuUpload, LuFile, LuX } from "react-icons/lu";
import type { Apolice } from "../types/apolice.types"; 

type Cliente = { id: string; nome: string; };
type Seguradora = { id: string; nome: string; };

interface ApoliceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;       
  clienteIdPreSelecionado?: string; 
  apoliceParaEdit?: Apolice | null; 
}

export function ApoliceFormModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  clienteIdPreSelecionado, 
  apoliceParaEdit 
}: ApoliceFormModalProps) {

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [seguradoras, setSeguradoras] = useState<Seguradora[]>([]);
  
  // Estado do formulário
  const [form, setForm] = useState({
    id: "",
    clienteId: "",
    seguradoraId: "",
    numeroApolice: "",
    dataInicioVigencia: "",
    dataTerminoVigencia: "",
    valorPremio: 0,
    status: "ATIVO",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [isUploadAreaOpen, setIsUploadAreaOpen] = useState(false); 
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };

    async function fetchCombos() {
      try {
        const [clientesResp, seguradorasResp] = await Promise.all([
          axios.get("http://localhost:8080/api/clientes", { headers }),
          axios.get("http://localhost:8080/api/seguradoras", { headers }),
        ]);
        setClientes(clientesResp.data);
        setSeguradoras(seguradorasResp.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar listas de clientes/seguradoras.");
      }
    }

    fetchCombos();

    if (apoliceParaEdit) {
      setForm({
        id: apoliceParaEdit.id || "",
        clienteId: apoliceParaEdit.clienteId || "", 
        seguradoraId: apoliceParaEdit.seguradoraId || "",
        numeroApolice: apoliceParaEdit.numeroApolice,
        dataInicioVigencia: apoliceParaEdit.dataInicioVigencia,
        dataTerminoVigencia: apoliceParaEdit.dataTerminoVigencia,
        valorPremio: apoliceParaEdit.valorPremio,
        status: apoliceParaEdit.status,
      });
    } else {
      setForm({
        id: "",
        clienteId: clienteIdPreSelecionado || "",
        seguradoraId: "",
        numeroApolice: "",
        dataInicioVigencia: "",
        dataTerminoVigencia: "",
        valorPremio: 0,
        status: "ATIVO",
      });
    }
    
    setError("");
    setUploadedFile(null);
    setIsUploadAreaOpen(false);

  }, [isOpen, apoliceParaEdit, clienteIdPreSelecionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const apoliceId = form.id || apoliceParaEdit?.id;

    if (!apoliceId) {
        setError("Erro: A apólice deve ser criada via Upload primeiro ou o ID está ausente.");
        setLoading(false);
        return;
    }

    const token = localStorage.getItem("authToken");

    try {
        await axios.put(`http://localhost:8080/api/apolices/doc_update/${apoliceId}`, form, {
            headers: { Authorization: `Bearer ${token}` },
        });


        setLoading(false); 
        onSuccess(); 
        onClose();   

    } catch (err) {
      console.error(err);
      setError("Erro ao salvar alterações da apólice. Verifique os logs do servidor.");
      setLoading(false); 
    } 

};

  const handleSaveUpload = async () => {
    if (!uploadedFile || !form.clienteId || !form.seguradoraId || !form.numeroApolice) { 
      alert("Selecione Cliente, Seguradora, o Nº Apólice e o arquivo antes de continuar.");
      return;
    }

    setUploading(true);
    setError("");

    // const clienteIdBlob = new Blob([form.clienteId], { type: 'text/plain' });
    // const seguradoraIdBlob = new Blob([form.seguradoraId], { type: 'text/plain' });
    // const numeroApoliceBlob = new Blob([form.numeroApolice], { type: 'text/plain' });    
    
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("file", uploadedFile as File);

    formData.append("idCliente", form.clienteId);     
    formData.append("idSeguradora", form.seguradoraId); 
    formData.append("numeroApolice", form.numeroApolice);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/apolices/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setForm((prev) => ({
        ...prev,
        id: data.id, 
        numeroApolice: data.numeroApolice || "",
        dataInicioVigencia: data.dataInicioVigencia || "",
        dataTerminoVigencia: data.dataTerminoVigencia || "",
        valorPremio: data.valorPremio || 0,
        status: data.status || "ATIVO", 
      }));

      setIsUploadAreaOpen(false); 

    } catch (err) {
      console.error("Erro no upload:", err);
      setError("Erro ao enviar o arquivo. Verifique se o tamanho do PDF é permitido.");
    } finally {
      setUploading(false);
    }
  };

  // Funções de Drag and Drop
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragActive(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setUploadedFile(e.dataTransfer.files[0]);
  };

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative dark:bg-gray-800 transition-colors duration-300">
        
        
        <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-2xl dark:bg-gray-700 dark:border-gray-600">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {apoliceParaEdit ? 'Editar Apólice' : 'Nova Apólice'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition">
                <LuX size={24} />
            </button>
        </div>

        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg dark:bg-red-900/30 dark:text-red-400">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Cliente</label>
                        <select name="clienteId" value={form.clienteId} onChange={handleChange} required
                            className="w-full text-gray-600 border rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-[#3D3E7E] outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors">
                            <option value="">Selecione...</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Seguradora</label>
                        <select name="seguradoraId" value={form.seguradoraId} onChange={handleChange} required
                            className="w-full text-gray-600 border rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-[#3D3E7E] outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors">
                            <option value="">Selecione...</option>
                            {seguradoras.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                        </select>
                    </div>
                </div>

                {!apoliceParaEdit && (
                    <button type="button" onClick={() => setIsUploadAreaOpen(true)}
                        className="w-full border-2 border-dashed border-gray-500 rounded-xl p-4 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition gap-2 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-700">
                        <LuUpload /> Preencher automaticamente com Upload de Arquivo
                    </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Nº Apólice</label>
                        <input type="text" name="numeroApolice" value={form.numeroApolice} onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3 text-gray-600 bg-gray-50 focus:ring-2 focus:ring-[#3D3E7E] outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Início Vigência</label>
                        <input type="date" name="dataInicioVigencia" value={form.dataInicioVigencia} onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3 text-gray-600 bg-gray-50 focus:ring-2 focus:ring-[#3D3E7E] outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Término Vigência</label>
                        <input type="date" name="dataTerminoVigencia" value={form.dataTerminoVigencia} onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-3 text-gray-600 bg-gray-50 focus:ring-2 focus:ring-[#3D3E7E] outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Valor Prêmio</label>
                        <input type="number" step="0.01" name="valorPremio" value={form.valorPremio} onChange={handleChange}
                             className="w-full border rounded-xl px-4 py-3 text-gray-600 bg-gray-50 focus:ring-2 focus:ring-[#3D3E7E] outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300">Status</label>
                        <select name="status" value={form.status} onChange={handleChange}
                             className="w-full border rounded-xl px-4 py-3 text-gray-600 bg-gray-50 focus:ring-2 focus:ring-[#3D3E7E] outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors">
                             <option value="ATIVO">Ativo</option>
                             <option value="CANCELADO">Cancelado</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-white bg-[#40BEBE] rounded-lg hover:bg-[#2d8888] transition">Cancelar</button>
                    <button type="submit" disabled={loading}
                        className="px-6 py-2 bg-[#3D3E7E] text-white font-semibold rounded-lg hover:bg-[#2d2e5e] dark:bg-[#373872] dark:hover:bg-[#494a96] transition flex items-center gap-2">
                        {loading ? 'Salvando...' : <> Confirmar</>}
                    </button>
                </div>
            </form>
        </div>

        {/* Sub-Modal de Upload (Dentro do Modal Principal)*/}
        {isUploadAreaOpen && (
            <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-10 rounded-2xl animate-fade-in dark:bg-gray-800/95 transition-colors">
                 <div
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    onClick={() => document.getElementById("fileInputModal")?.click()}
                    className={`w-full max-w-md border-2 border-dashed border-[#3D3E7E] rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition ${
                        dragActive 
                        ? "bg-blue-50 dark:bg-blue-900/20" 
                        : "bg-gray-50 dark:bg-gray-700"
                    } dark:border-gray-500`}
                  >
                    <LuUpload size={40} className="text-[#3D3E7E] mb-3 dark:text-indigo-400" />
                    <p className="text-gray-600 text-center dark:text-gray-300">Arraste ou clique para selecionar o PDF</p>
                    <input id="fileInputModal" type="file" className="hidden" onChange={(e) => e.target.files && setUploadedFile(e.target.files[0])} />
                 </div>

                 {uploadedFile && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                        <LuFile className="mr-2"/> {uploadedFile.name}
                    </div>
                 )}

                 <div className="flex gap-4 mt-8">
                    <button onClick={() => setIsUploadAreaOpen(false)} className="px-4 py-2 text-white bg-[#40BEBE] rounded-lg hover:bg-[#2d8888]">Cancelar</button>
                    <button onClick={handleSaveUpload} disabled={uploading || !uploadedFile} className="px-4 py-2 bg-[#3D3E7E] text-white rounded-lg hover:bg-[#303162] dark:bg-indigo-600 dark:hover:bg-indigo-700">
                        {uploading ? "Processando..." : "Processar Arquivo"}
                    </button>
                 </div>
            </div>
        )}

      </div>
    </div>
  );
}