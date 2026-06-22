import { useState, useEffect } from "react";
import { PlusIcon, PencilSimple } from "@phosphor-icons/react";
import MonthHeaderWeb from "../components/monthHeaderWeb";
import CustomCalendarWeb from "../components/customCalendarWeb";
import { ModalEscala } from "../components/modalEscala";

const gapsAuxiliares = [
  { id: "1", label: "Louvor", cor: "#0077ff" },
  { id: "2", label: "Mídia", cor: "#FF0004" },
  { id: "3", label: "Iluminação", cor: "#0077ff" },
  { id: "4", label: "Som", cor: "#A148FF" },
  { id: "5", label: "Diaconato", cor: "#ffe448" },
  { id: "6", label: "Projeção", cor: "#48ff66" },
];

export default function Escalas() {
  const [escalas, setEscalas] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingEscala, setEditingEscala] = useState(null);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  useEffect(() => {
    const fakeEscalas = [
      { id: 1, gap: "3", data: "2026-07-08", responsavel1: "Giulia", responsavel2: "Wilson", horario1: '10:30:00', horario2: '18:00:00' },
      { id: 2, gap: "2", data: "2026-07-08", responsavel1: "Gabão", responsavel2: "", horario1: '10:00:00', horario2: '18:00:00' },
      { id: 3, gap: "4", data: "2026-07-08", responsavel1: "Edu", responsavel2: "Guilherme", horario1: '10:00:00', horario2: '18:00:00' },
      { id: 4, gap: "6", data: "2026-07-08", responsavel1: "Murilo", responsavel2: "Lincon", horario1: '10:00:00', horario2: '18:00:00' },
      { id: 5, gap: "5", data: "2026-06-08", responsavel1: "Fábio", responsavel2: "Jovens", horario1: '10:00:00', horario2: '18:00:00' },
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
    setEditingEscala(escala);
    setModalVisible(true);
  }

  function handleSaveEscala(data) {
    if (editingEscala) {
      const updated = escalas.map((esc) =>
        esc.id === editingEscala.id ? { ...editingEscala, ...data } : esc
      );
      setEscalas(updated);
    } else {
      const newEscala = {
        id: Date.now(),
        ...data,
      };
      setEscalas([...escalas, newEscala]);
    }

    setModalVisible(false);
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

  function getGapInfo(gapId) {
    const gapEncontrado = gapsAuxiliares.find((g) => g.id === String(gapId));
    return gapEncontrado ? gapEncontrado : { label: "Desconhecido", cor: "#000000" };
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
        filteredUsers.map((escala) => {
          const info = getGapInfo(escala.gap);

          return (
            <div
              key={escala.id}
              className="w-[95%] bg-input dark:bg-input-dark rounded-2xl shadow-md px-4 py-2 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <p style={{ color: info.cor }}>
                  {info.label}
                  <label className="text-preto dark:text-branco">
                    {" "}
                    - {getDiaDaSemanaCurto(escala.data)}
                  </label>
                </p>
                <p className="text-sm font-light text-preto dark:text-branco">
                  {formataHora(escala.horario1)} - {escala.responsavel1}
                </p>
                {escala.responsavel2 && (
                  <p className="text-sm font-light text-preto dark:text-branco">
                    {formataHora(escala.horario2)} - {escala.responsavel2}
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
          );
        })}

      <button
        onClick={() => {
          setEditingEscala(null);
          setModalVisible(true);
        }}
        className="fixed bottom-6 right-6 bg-vermelho shadow-md rounded-full p-4"
      >
        <PlusIcon className="text-branco" size={30} />
      </button>

      <ModalEscala
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEscala}
        escala={editingEscala}
        titulo={editingEscala ? "Editar Escala" : "Nova Escala"}
      />
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

function getDiaDaSemanaCurto(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString + "T00:00:00");
  const diaCompleto = date.toLocaleDateString("pt-BR", { weekday: "long" });
  const diaCurto = diaCompleto.split("-")[0];

  return diaCurto.charAt(0).toUpperCase() + diaCurto.slice(1);
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

  return tempo;
}