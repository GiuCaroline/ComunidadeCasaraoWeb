import { MagnifyingGlass, CalendarCheckIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Galeria(){
    const navigate = useNavigate();
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        const fakeEventos = [
            {id: 1, titulo: 'Jovens', date: '2026-07-04'},
            {id: 2, titulo: 'Culto', date: '2026-07-05'},
        ]

        setEventos(fakeEventos);
    }, []);

    function handleOpen(evento) {
        navigate("/eventgalery", { state: { evento } });
    }

    return(
        <div className="pt-5 px-4 flex flex-col items-center gap-6 pb-24">
            <div className="relative w-[95%]">
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    onChange={(e) => console.log('Pesquisa: ', e.target.value)}
                    className="w-full text-preto dark:text-branco py-3 px-4 pr-12 rounded-full bg-input dark:bg-input-dark shadow-md outline-none"
                />
        
                <MagnifyingGlass
                    size={22}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-preto dark:text-branco"
                />
            </div>

            <div className="w-full px-3">
                {eventos.map((evento) => (
                    <button
                        className="bg-input dark:bg-input-dark px-4 py-3 shadow-md rounded-xl w-full flex flex-row items-center justify-between mb-[5%]"
                        key={evento.id}
                        onClick={() => handleOpen(evento)}
                    >
                        <div className="flex flex-row items-center gap-3">
                            <CalendarCheckIcon className="text-vermelho dark:text-vermelho-dark" size={32} />
                            <div className="flex flex-col items-start">
                                <span className="font-regular text-preto dark:text-branco">{evento.titulo}</span>
                                <span className="font-light text-preto dark:text-branco">Dia {formatDate(evento.date)}</span>
                            </div>
                        </div>
                        <CaretRightIcon className="text-vermelho dark:text-vermelho-dark" size={32} />
                    </button>
                ))}
            </div>
        </div>
    )
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}