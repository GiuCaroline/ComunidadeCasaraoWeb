import { useState } from "react";
import { CaretUp, CaretDown, X } from "@phosphor-icons/react";
import logoPreta from "/images/logoPreto.png";
import image from "/images/image.png";
import jake from "/images/jake.webp";

export default function EventGalery() {
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div className="pt-5 px-4 flex flex-col items-center gap-6 pb-24">
        
        <div className="w-full bg-input dark:bg-input-dark rounded-xl shadow-md transition-colors overflow-hidden">
          <button
            onClick={() => setIsPhotosOpen(!isPhotosOpen)}
            className="w-full flex justify-between items-center px-5 py-4 text-left"
          >
            <span className="text-[16px] font-medium text-vermelho dark:text-vermelho-dark">
              Fotos
            </span>
            {isPhotosOpen ? (
              <CaretUp size={24} className="text-vermelho dark:text-vermelho-dark" />
            ) : (
              <CaretDown size={24} className="text-vermelho dark:text-vermelho-dark" />
            )}
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isPhotosOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden min-h-0">
              <div className="px-5 pb-4 pt-2 grid grid-cols-2 gap-4">
                <img
                  src={logoPreta}
                  alt="Logo"
                  onClick={() => setSelectedImage(logoPreta)}
                  className="block dark:hidden w-full h-20 object-contain bg-gray-100 rounded-xl cursor-pointer"
                />
                
                <img
                  src={image}
                  alt="Foto 2"
                  onClick={() => setSelectedImage(image)}
                  className="w-full h-20 object-cover rounded-xl cursor-pointer"
                />
                
                <img
                  src={jake}
                  alt="Foto 3"
                  onClick={() => setSelectedImage(jake)}
                  className="w-full h-20 object-cover rounded-xl cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-input dark:bg-input-dark rounded-xl shadow-md transition-colors overflow-hidden">
          <button
            onClick={() => setIsVideosOpen(!isVideosOpen)}
            className="w-full flex justify-between items-center px-5 py-4 text-left"
          >
            <span className="text-[16px] font-medium text-vermelho dark:text-vermelho-dark">
              Vídeos
            </span>
            {isVideosOpen ? (
              <CaretUp size={24} className="text-vermelho dark:text-vermelho-dark" />
            ) : (
              <CaretDown size={24} className="text-vermelho dark:text-vermelho-dark" />
            )}
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isVideosOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden min-h-0">
              <div className="px-5 pb-4 pt-2 flex flex-col gap-4">
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Vídeo 1</span>
                </div>
                
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Vídeo 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-branco"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          
          <img 
            src={selectedImage} 
            alt="Imagem ampliada" 
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}