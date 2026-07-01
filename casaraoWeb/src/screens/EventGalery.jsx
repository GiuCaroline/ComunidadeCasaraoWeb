import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CaretUp, CaretDown, X, Plus, DotsThreeOutlineVerticalIcon, TrashIcon, ImagesSquareIcon } from "@phosphor-icons/react";
import { ModalGaleria } from "../components/modalGaleria";
import { getGaleriaEvento, addMidia } from "../services/authService";

export default function EventGalery() {
  const location = useLocation();
  const evento = location.state?.evento;

  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [fotos, setFotos] = useState([]);
  const [videos, setVideos] = useState([]);

  async function fetchMidias() {
    if (evento?.agendaevento_id) {
      try {
        const data = await getGaleriaEvento(evento.agendaevento_id);
        
        const imagensFiltradas = data.filter(item => item.tipo_arquivo === 'imagem');
        const videosFiltrados = data.filter(item => item.tipo_arquivo === 'video');
        
        setFotos(imagensFiltradas);
        setVideos(videosFiltrados);
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchMidias();
  }, [evento]);

  const handleOpenNew = () => {
    setModalVisivel(true);
  };

  const handleCloseModal = () => {
    setModalVisivel(false);
  };

  const gerarNomeDaPasta = () => {
    if (!evento) return "midias_gerais";
    
    const nomeBase = evento.nome ? evento.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_') : "evento";
    
    let dataFormatada = "sem_data";
    if (evento.data) {
        dataFormatada = evento.data.split('T')[0].split('-').reverse().join('_');
    }

    let horario = formataHora(evento.horario);

    return `${nomeBase}_${dataFormatada}_${horario}`;
  };

  const enviarParaCloudinary = async (arquivoFisico, nomePasta) => {
    const formData = new FormData();
    formData.append('file', arquivoFisico);
    formData.append('upload_preset', 'ml_default');
    formData.append('folder', nomePasta);

    const resposta = await fetch('https://api.cloudinary.com/v1_1/sriqwd6o/auto/upload', { 
      method: 'POST',
      body: formData
    });

    if (!resposta.ok) {
        throw new Error("Erro no upload do Cloudinary");
    }

    const dados = await resposta.json();
    return dados.secure_url;
  };

  const handleSaveMidias = async (midias) => {
    if (!evento?.agendaevento_id) {
        alert("Erro: Evento não identificado.");
        return;
    }

    setIsUploading(true);
    const pastaDestino = gerarNomeDaPasta();

    try {
        for (const item of midias) {
            const urlPronta = await enviarParaCloudinary(item.file, pastaDestino);

            await addMidia({
                agendaevento_id: evento.agendaevento_id,
                url_arquivo: urlPronta,
                tipo_arquivo: item.type === 'video' ? 'video' : 'imagem'
            });
        }

        alert('Mídias adicionadas com sucesso!');
        setModalVisivel(false);
        fetchMidias(); 
    } catch (error) {
        console.error("Erro no upload:", error);
        alert('Erro ao enviar as mídias.');
    } finally {
        setIsUploading(false);
    }
  };

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
                {fotos.map((foto) => (
                  <img
                    key={foto.id}
                    src={foto.url_arquivo}
                    alt="Foto do evento"
                    onClick={() => setSelectedImage(foto.url_arquivo)}
                    className="w-full h-20 object-cover rounded-xl cursor-pointer"
                  />
                ))}
                
                {fotos.length === 0 && (
                  <span className="text-input-dark dark:text-input text-sm col-span-2">Nenhuma foto encontrada.</span>
                )}
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
                {videos.map((video) => (
                  <video 
                    key={video.id} 
                    controls 
                    className="w-full h-40 bg-black rounded-xl object-cover"
                  >
                    <source src={video.url_arquivo} type="video/mp4" />
                    Seu navegador não suporta vídeos.
                  </video>
                ))}

                {videos.length === 0 && (
                  <span className="text-input-dark dark:text-input text-sm">Nenhum vídeo encontrado.</span>
                )}
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

      <div className="fixed bottom-20 right-5 flex flex-col items-end gap-3 z-40">
        <div
          className={`flex flex-col gap-3 transition-all duration-300 ease-in-out origin-bottom ${
            isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4 pointer-events-none"
          }`}
        >
          <button
            onClick={() => {
              handleOpenNew();
              setIsMenuOpen(false);
            }}
            disabled={isUploading}
            className="flex items-center gap-3 p-2 bg-vermelho rounded-full shadow-lg hover:bg-vermelho-opaci transition-colors"
          >
            <span className="pl-3 text-sm font-medium text-branco">Adicionar</span>
            <div className={`p-2 rounded-full text-vermelho ${isUploading ? "bg-gray-400" : "bg-branco"}`}>
              <Plus size={20} />
            </div>
          </button>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 p-2 bg-vermelho rounded-full shadow-lg hover:bg-vermelho-opaci transition-colors"
          >
            <span className="pl-3 text-sm font-medium text-branco">Carrossel</span>
            <div className="bg-branco p-2 rounded-full text-vermelho">
              <ImagesSquareIcon size={20} />
            </div>
          </button>

          <button
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 p-2 bg-vermelho rounded-full justify-between shadow-lg hover:bg-vermelho-opaci transition-colors"
          >
            <span className="pl-3 text-sm font-medium text-branco">Excluir</span>
            <div className="bg-branco p-2 rounded-full text-vermelho">
              <TrashIcon size={20} />
            </div>
          </button>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`shadow-lg rounded-full p-4 transition-transform duration-300 ${
            isMenuOpen ? "rotate-90" : "rotate-0"
          } bg-vermelho hover:opacity-90`}
        >
          <DotsThreeOutlineVerticalIcon className="text-branco" size={30} weight="fill" />
        </button>
      </div>

      <ModalGaleria
        isOpen={modalVisivel}
        onClose={handleCloseModal}
        onSave={handleSaveMidias}
        agendaevento_id={evento?.agendaevento_id}
      />
    </>
  );
}

function formataHora(tempo) {
  if (!tempo) return "";

  const partes = tempo.split(":");
  if (partes.length >= 2) {
    const hora = partes[0];
    const minuto = partes[1];

    if (minuto === "00") {
      return `${hora}h`;
    }
    
    return `${hora}h${minuto}`;
  }
}