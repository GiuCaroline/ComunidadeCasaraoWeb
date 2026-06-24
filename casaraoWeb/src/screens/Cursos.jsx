import { DropdownContent } from "../components/dropdownContent";
import { ModalCurso } from "../components/ModalCurso";
import { MagnifyingGlass, TrashIcon, PencilSimple, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");

  useEffect(() => {
    const fakeCursos = [
      { id: 1, nomeCurso: "Curso de Casais", dias: "Às terças e quintas", horario: "20:00:00", descricao: "Este curso aborda temas importantes dentro de um casamento. Sobre ter filhos e mesmo assim continuar sendo um belo casal.", celular: '(11) 94002-8922', email: 'teste@gmail.com' },
      { id: 2, nomeCurso: "Curso Maturidade", dias: "Às quintas", horario: "20:30:00", descricao: "Uma descrição de um curso de maturidade, eu gostaria de testar como que ele fica com bastante caracteres porém não consigo medir com a descrição de baixo, deixa eu ver pera ai pelo que vi já está bem maior", celular: '(11) 94002-8922', email: 'responsavel@gmail.com' },
    ];

    setCursos(fakeCursos);
  }, []);

  const handleDeleteClick = (id, curso) => {
    console.log("Deletar curso:", id);
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

  const handleSaveCurso = (dados) => {
    console.log("Dados do curso a salvar:", dados);
    setModalVisivel(false);
  };

  const cursosFiltrados = cursos.filter((curso) => {
    const termo = termoPesquisa.toLowerCase();
    
    return (
      curso.nomeCurso?.toLowerCase().includes(termo) ||
      curso.dias?.toLowerCase().includes(termo) ||
      curso.horario?.toLowerCase().includes(termo) ||
      curso.descricao?.toLowerCase().includes(termo) ||
      curso.celular?.toLowerCase().includes(termo) ||
      curso.email?.toLowerCase().includes(termo)
    );
  });

  return(
    <div className="pt-5 px-4 flex flex-col items-center gap-6">
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
            titulo={curso.nomeCurso}
            dias={curso.dias}
            horario={curso.horario}
            descricao={curso.descricao}
            celular={curso.celular}
            email={curso.email}
          />
          <div className="flex flex-col gap-3">
            <button onClick={() => handleDeleteClick(curso.id, curso)}>
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
        className="absolute bottom-20 right-5 bg-vermelho dark:text-vermelho-dark shadow-md rounded-full p-4"
      >
        <PlusIcon className="text-branco" size={30} />
      </button>

      <ModalCurso
        visible={modalVisivel}
        onClose={handleCloseModal}
        onSave={handleSaveCurso}
        curso={cursoSelecionado}
      />
    </div>
  )
}