import { DropdownContent } from "../components/dropdownContent";
import { ModalCurso } from "../components/ModalCurso";
import { ConfirmDelete } from "../components/confirmDelete";
import { MagnifyingGlass, TrashIcon, PencilSimple, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { getCursos, addCursos, editCursos, deleteCursos } from "../services/authService";

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  
  const [deleteModalVisivel, setDeleteModalVisivel] = useState(false);
  const [cursoParaDeletar, setCursoParaDeletar] = useState(null);

  useEffect(() => {
    async function carregarCursos() {
      try {
        const data = await getCursos();

        if (Array.isArray(data)) {
          setCursos(data);
        } else if (data && Array.isArray(data.cursos)) {
          setCursos(data.cursos);
        } else if (data && Array.isArray(data.data)) {
          setCursos(data.data);
        } else if (data && typeof data === 'object') {
          const extrairArray = Object.values(data).find(Array.isArray);
          setCursos(extrairArray || []);
        } else {
          setCursos([]);
        }
      } catch (error) {
        console.log(error);
        setCursos([]);
      }
    }
    carregarCursos();
  }, []);

  const handleDeleteClick = (id) => {
    setCursoParaDeletar(id);
    setDeleteModalVisivel(true);
  };

  const confirmarDelete = async () => {
    if (!cursoParaDeletar) return;

    try {
      await deleteCursos(cursoParaDeletar);
      setCursos((prev) => prev.filter((curso) => curso.id !== cursoParaDeletar));
      setDeleteModalVisivel(false);
      setCursoParaDeletar(null);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelarDelete = () => {
    setDeleteModalVisivel(false);
    setCursoParaDeletar(null);
  };

  const handleEdit = (curso) => {
    setCursoSelecionado(curso);
    setModalVisivel(true);
  };

  const handleOpenNew = () => {
    setCursoSelecionado(null);
    setModalVisivel(true);
  };

  const handleCloseModal = () => {
    setModalVisivel(false);
    setCursoSelecionado(null);
  };

  const handleSaveCurso = async (dados) => {
    try {
      if (cursoSelecionado) {
        const response = await editCursos(cursoSelecionado.id, dados);
        setCursos((prev) =>
          prev.map((c) => (c.id === cursoSelecionado.id ? { ...c, ...response } : c))
        );
      } else {
        const response = await addCursos(dados);
        setCursos((prev) => [...prev, response]);
      }
      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  const cursosFiltrados = cursos.filter((curso) => {
    const termo = termoPesquisa.toLowerCase();
    
    return (
      curso.nome_curso?.toLowerCase().includes(termo) ||
      curso.dias?.toLowerCase().includes(termo) ||
      curso.horario?.toLowerCase().includes(termo) ||
      curso.descricao?.toLowerCase().includes(termo) ||
      curso.celular?.toLowerCase().includes(termo) ||
      curso.email?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="pt-5 px-4 flex flex-col items-center gap-6 pb-24">
      <div className="relative w-[95%]">
        <input
          type="text"
          placeholder="Pesquisar..."
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          className="w-full text-preto dark:text-branco py-3 px-4 pr-12 rounded-full bg-input dark:bg-input-dark shadow-md outline-none"
        />

        <MagnifyingGlass
          size={22}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-preto dark:text-branco"
        />
      </div>
      
      {cursosFiltrados.map((curso) => (
        <div 
          key={curso.id}
          className="flex flex-row justify-between gap-3 items-center w-full max-w-md"
        >
          <DropdownContent
            titulo={curso.nome_curso}
            dias={curso.dias}
            horario={curso.horario}
            descricao={curso.descricao}
            celular={curso.celular}
            email={curso.email}
          />
          <div className="flex flex-col gap-3">
            <button onClick={() => handleDeleteClick(curso.id)}>
              <TrashIcon size={27} className="text-vermelho dark:text-vermelho-dark" />
            </button>

            <button onClick={() => handleEdit(curso)}>
              <PencilSimple size={27} className="text-[#01CB34]" />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleOpenNew}
        className="fixed bottom-20 right-5 bg-vermelho dark:text-vermelho-dark shadow-md rounded-full p-4"
      >
        <PlusIcon className="text-branco" size={30} />
      </button>

      <ModalCurso
        visible={modalVisivel}
        onClose={handleCloseModal}
        onSave={handleSaveCurso}
        curso={cursoSelecionado}
      />

      <ConfirmDelete
        visible={deleteModalVisivel}
        onConfirm={confirmarDelete}
        onCancel={cancelarDelete}
        mensage="curso"
      />
    </div>
  );
}