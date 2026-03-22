import { useState, useEffect } from "react";
import { PlusIcon, PencilSimple } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import MonthHeaderWeb from "../components/monthHeaderWeb";
import CustomCalendarWeb from "../components/customCalendarWeb";

export default function Escalas() {
  const [escalas, setEscalas] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const navigate = useNavigate();

  useEffect(() => {
    const fakeEscalas = [
      { id: 1, gap: "Iluminação", cor: "#0077ff", data: "2026-03-08", escala1: "Giulia", escala2: "Wilson" },
      { id: 2, gap: "Mídia", cor: "#FF0004", data: "2026-03-08", escala1: "Gabão", escala2: "" },
      { id: 3, gap: "Som", cor: "#A148FF", data: "2026-03-08", escala1: "Edu", escala2: "Guilherme" },
      { id: 4, gap: "Projeção", cor: "#48ff66", data: "2026-03-08", escala1: "Murilo", escala2: "Lincon" },
      { id: 5, gap: "Diaconato", cor: "#ffe448", data: "2026-03-08", escala1: "Fábio", escala2: "Jovens" },
    ];

    setEscalas(fakeEscalas);
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const filtered = escalas.filter(
      (escala) => escala.data === selectedDate
    );

    setFilteredUsers(filtered);
  }, [selectedDate, escalas]);

  function handleEdit(escala) {
    navigate("/editar", { state: { escala } });
  }

  function getMarkedDays(escalas) {
    const result = {};

    escalas.forEach((escala) => {
      if (escala.data) {
        result[escala.data] = true;
      }
    });

    return result;
  }

  const markedDays = getMarkedDays(escalas);

  return (
    <div className="pt-5 px-4 flex flex-col items-center gap-6 pb-24">
      <MonthHeaderWeb
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
      />

      <CustomCalendarWeb
        month={month}
        year={year}
        markedDays={markedDays}
        onSelectDay={(dateKey) => {
          setSelectedDate(dateKey);
        }}
      />

      {selectedDate &&
        filteredUsers.map((escala) => (
          <div
            key={escala.id}
            className="w-[95%] bg-input dark:bg-input-dark rounded-2xl shadow-md px-4 py-2 flex justify-between items-center"
          >
            <div className="flex flex-col">
              <p style={{ color: escala.cor }}>{escala.gap}</p>
              <p className="text-sm font-light text-preto dark:text-branco">
                10h - {escala.escala1}
              </p>
              {escala.escala2 && (
                <p className="text-sm font-light text-preto dark:text-branco">
                  18h - {escala.escala2}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-light text-preto dark:text-branco">
                {formatDate(escala.data)}
              </p>
            </div>

            <button onClick={() => handleEdit(escala)}>
              <PencilSimple size={30} className="text-[#01CB34]" />
            </button>
          </div>
        ))}

      <button className="fixed bottom-6 right-6 bg-vermelho shadow-md rounded-full p-4">
        <PlusIcon className="text-branco" size={30} />
      </button>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}
