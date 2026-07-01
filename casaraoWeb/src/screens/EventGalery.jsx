import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CaretUp, CaretDown, X, Plus, DotsThreeOutlineVerticalIcon, TrashIcon, ImagesSquareIcon, CheckCircle } from "@phosphor-icons/react";
import { ModalGaleria } from "../components/modalGaleria";
import { DeleteOptionsModal } from "../components/deleteOptionsModal";
import { getGaleriaEvento, addMidia, deleteMidia } from "../services/authService";

export default function EventGalery() {
  const location = useLocation();
  const evento = location.state?.evento;

  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [fotos, setFotos] = useState([]);
  const [videos, setVideos] = useState([]);

  const [modoExclusao, setModoExclusao] = useState(false);
  const [itensSelecionados, setItensSelecionados] = useState([]);

  const [modoCarrossel, setModoCarrossel] = useState(false);
  const [selecoesCarrossel, setSelecoesCarrossel] = useState([]);
  const toggleSelecaoCarrossel = (id) => {
    const index = selecoesCarrossel.findIndex(item => item.id === id);
    
    if (index !== -1) {
      const novaLista = selecoesCarrossel
        .filter(item => item.id !== id)
        .map((item, i) => ({ ...item, ordem: i + 1 }));
      setSelecoesCarrossel(novaLista);
    } else if (selecoesCarrossel.length < 3) {
      setSelecoesCarrossel([...selecoesCarrossel, { id, ordem: selecoesCarrossel.length + 1 }]);
    }
  };

  const salvarConfiguracaoCarrossel = async () => {
    console.log("Salvando carrossel:", selecoesCarrossel);
    alert("Carrossel atualizado!");
    setModoCarrossel(false);
  };

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
        const dataObj = new Date(evento.data);
        
        if (!isNaN(dataObj.getTime())) {
            const dia = String(dataObj.getDate()).padStart(2, '0');
            const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
            const ano = dataObj.getFullYear();
            dataFormatada = `${dia}_${mes}_${ano}`;
        }
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

  const ativarModoExclusao = () => {
    setModoExclusao(true);
    setIsPhotosOpen(true);
    setIsVideosOpen(true);
    setIsMenuOpen(false);
  };

  const cancelarModoExclusao = () => {
    setModoExclusao(false);
    setItensSelecionados([]);
  };

  const toggleSelecao = (id) => {
    setItensSelecionados(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleExcluirSelecionados = () => {
    if (itensSelecionados.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const confirmarExclusao = async () => {
    setIsUploading(true);
    setIsDeleteModalOpen(false);

    try {
      for (const id of itensSelecionados) {
        await deleteMidia(id);
      }
      
      alert("Mídias excluídas com sucesso!");
      cancelarModoExclusao();
      fetchMidias();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir as mídias.");
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
                  <div key={foto.id} className="relative">
                    <img
                      src={foto.url_arquivo}
                      alt="Foto"
                      onClick={() => {
                        if (modoExclusao) toggleSelecao(foto.id);
                        else if (modoCarrossel) toggleSelecaoCarrossel(foto.id);
                        else setSelectedImage(foto.url_arquivo);
                      }}
                      className={`w-full h-20 object-cover rounded-xl cursor-pointer transition-all ${
                        (modoExclusao && itensSelecionados.includes(foto.id)) || (modoCarrossel && selecoesCarrossel.find(s => s.id === foto.id))
                          ? "border-4 border-vermelho dark:border-vermelho-dark opacity-60" 
                          : ""
                      }`}
                    />
                    {modoCarrossel && selecoesCarrossel.find(s => s.id === foto.id) && (
                      <div className="absolute top-1 right-1 bg-vermelho text-branco rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
                        {selecoesCarrossel.find(s => s.id === foto.id).ordem}
                      </div>
                    )}
                  </div>
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
                  <div key={video.id} className="relative w-full h-40">
                    {modoExclusao && (
                      <div 
                        className="absolute inset-0 z-10 cursor-pointer rounded-xl bg-transparent"
                        onClick={() => toggleSelecao(video.id)}
                      />
                    )}
                    <video 
                      controls={!modoExclusao} 
                      className={`w-full h-full bg-black rounded-xl object-cover transition-all ${
                        modoExclusao && itensSelecionados.includes(video.id) 
                          ? "border-4 border-vermelho dark:border-vermelho-dark opacity-60" 
                          : ""
                      }`}
                    >
                      <source src={video.url_arquivo} type="video/mp4" />
                      Seu navegador não suporta vídeos.
                    </video>
                    {modoExclusao && itensSelecionados.includes(video.id) && (
                      <CheckCircle weight="fill" size={32} className="absolute top-2 right-2 z-20 text-vermelho dark:text-vermelho-dark bg-branco rounded-full" />
                    )}
                  </div>
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
        {modoCarrossel ? (
           <button onClick={salvarConfiguracaoCarrossel} className="bg-vermelho text-branco rounded-full p-4 shadow-xl">
             Salvar
           </button>
        ) : ( modoExclusao ? (
              <>
                <button
                  onClick={cancelarModoExclusao}
                  className="bg-gray-500 shadow-lg rounded-full p-4 hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  <X className="text-branco" size={30} />
                </button>

                <button
                  onClick={handleExcluirSelecionados}
                  disabled={isUploading || itensSelecionados.length === 0}
                  className={`shadow-lg rounded-full p-4 transition-opacity flex items-center justify-center ${
                    isUploading || itensSelecionados.length === 0
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-vermelho dark:bg-vermelho-dark hover:opacity-90"
                  }`}
                >
                  <TrashIcon className="text-branco" size={30} />
                </button>
              </>
        ) : (
          <>
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
                onClick={() => setModoCarrossel(true)}
                className="flex items-center gap-3 p-2 bg-vermelho rounded-full shadow-lg hover:bg-vermelho-opaci transition-colors"
              >
                <span className="pl-3 text-sm font-medium text-branco">Carrossel</span>
                <div className="bg-branco p-2 rounded-full text-vermelho">
                  <ImagesSquareIcon size={20} />
                </div>
              </button>

              <button
                onClick={ativarModoExclusao}
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
              } bg-vermelho hover:opacity-90 flex items-center justify-center`}
            >
              <DotsThreeOutlineVerticalIcon className="text-branco" size={30} weight="fill" />
            </button>
          </>
        ))}
      </div>

      <ModalGaleria
        isOpen={modalVisivel}
        onClose={handleCloseModal}
        onSave={handleSaveMidias}
        agendaevento_id={evento?.agendaevento_id}
      />

      <DeleteOptionsModal
        visible={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onDeleteAll={confirmarExclusao}
        title={`Deseja excluir ${itensSelecionados.length} mídia(s)?`}
        textAll="Sim, excluir"
        hideOne={true}
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