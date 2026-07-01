import { useState, useRef } from "react";
import { X, Plus, Trash, Image, VideoCamera } from "@phosphor-icons/react";

export function ModalGaleria({ isOpen, onClose, onSave }) {
  const [midias, setMidias] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    const novasMidias = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
      file: file
    }));

    setMidias((prev) => [...prev, ...novasMidias]);
  };

  const handleRemoveMedia = (id) => {
    setMidias((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    onSave(midias);
    setMidias([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md bg-branco dark:bg-preto-dark rounded-2xl shadow-xl overflow-hidden flex flex-col transition-colors">
        
        <div className="flex justify-between items-center px-6 py-4">
          <h2 className="text-[18px] font-semibold text-preto dark:text-branco">
            Adicionar Mídias
          </h2>
          <button 
            onClick={onClose} 
            className="text-preto dark:text-branco hover:opacity-70 transition-opacity"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-vermelho/30 dark:border-vermelho-dark/30 hover:border-vermelho dark:hover:border-vermelho-dark rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-input/10 dark:bg-input-dark/10 transition-all"
          >
            <Plus size={32} className="text-vermelho dark:text-vermelho-dark" />
            <span className="text-sm font-medium text-preto dark:text-branco">
              Selecionar fotos e vídeos
            </span>
            <span className="text-xs text-preto dark:text-branco">
              Formatos aceitos: PNG, JPG, MP4...
            </span>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple 
              accept="image/*,video/*" 
              className="hidden" 
            />
          </div>

          {midias.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-2">
              {midias.map((midia) => (
                <div 
                  key={midia.id} 
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
                >
                  {midia.type === "image" ? (
                    <img 
                      src={midia.url} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <video 
                      src={midia.url} 
                      className="w-full h-full object-cover" 
                      muted 
                    />
                  )}

                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    {midia.type === "image" ? (
                      <Image size={20} className="text-white opacity-80" />
                    ) : (
                      <VideoCamera size={20} className="text-white opacity-80" />
                    )}
                  </div>

                  <button 
                    onClick={() => handleRemoveMedia(midia.id)}
                    className="absolute top-1.5 right-1.5 bg-vermelho text-branco p-1 rounded-full shadow-md hover:bg-red-700 transition-colors"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-sm text-preto dark:text-branco hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl font-medium text-sm bg-vermelho dark:bg-vermelho-dark text-white shadow-md hover:opacity-90 transition-opacity"
          >
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
}