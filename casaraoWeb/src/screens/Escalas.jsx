import { useState, useEffect } from "react";
import { PlusIcon, PencilSimple } from "@phosphor-icons/react";
import MonthHeaderWeb from "../components/monthHeaderWeb";
import CustomCalendarWeb from "../components/customCalendarWeb";
import { ModalEscala } from "../components/modalEscala";
import { getDeparts, getEscalas, addEscala, editEscala } from "../services/authService";

export default function Escalas() {
  const [escalas, setEscalas] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [departamentos, setDeparts] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingEscala, setEditingEscala] = useState(null);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  useEffect(() => {
    async function carregarDeparts() {
      try {
        const data = await getDeparts();
        let arrayDeDeparts = [];

        if (Array.isArray(data)) {
          arrayDeDeparts = data;
        } else if (data && Array.isArray(data.departamentos)) {
          arrayDeDeparts = data.departamentos;
        } else if (data && Array.isArray(data.data)) {
          arrayDeDeparts = data.data;
        } else if (data && typeof data === 'object') {
          const extrairArray = Object.values(data).find(Array.isArray);
          arrayDeDeparts = extrairArray || [];
        }

        const departamentosFormatados = arrayDeDeparts.map((item) => ({
          id: String(item.id),
          value: String(item.id),
          label: item.departamento || "Sem Nome",
          cor: item.cor || "#000000"
        }));

        setDeparts(departamentosFormatados);
      } catch (error) {
        console.log(error);
        setDeparts([]);
      }
    }
    carregarDeparts();
  }, []);

  useEffect(() => {
    async function carregarEscalas() {
      try {
        const data = await getEscalas();

        if (Array.isArray(data)) {
          setEscalas(data);
        } else if (data && Array.isArray(data.escalas)) {
          setEscalas(data.escalas);
        } else if (data && Array.isArray(data.data)) {
          setEscalas(data.data);
        } else if (data && typeof data === 'object') {
          const extrairArray = Object.values(data).find(Array.isArray);
          setEscalas(extrairArray || []);
        } else {
          setEscalas([]);
        }
      } catch (error) {
        console.log(error);
        setEscalas([]);
      }
    }
    carregarEscalas();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const filtered = escalas.filter((escala) => {
      const dataEscala = escala.dia ? escala.dia.split("T")[0] : escala.data;
      return dataEscala === selectedDate;
    });

    setFilteredUsers(filtered);
  }, [selectedDate, escalas]);

  function handleEdit(escala) {
    setEditingEscala(escala);
    setModalVisible(true);
  }

  async function handleSaveEscala(data) {
    try {
      const depEncontrado = departamentos.find(
        (d) => String(d.id) === String(data.departamento_id)
      );
      
      const nomeDep = depEncontrado ? depEncontrado.label : "Desconhecido";
      const corDep = depEncontrado ? depEncontrado.cor : "#000000";

      if (editingEscala) {
        await editEscala(editingEscala.id, data);
        
        const updated = escalas.map((esc) =>
          esc.id === editingEscala.id ? { 
            ...editingEscala, 
            ...data,
            nome_departamento: nomeDep,
            cor: corDep
          } : esc
        );
        setEscalas(updated);
      } else {
        const response = await addEscala(data);
        
        const newEscala = {
          id: response.id || Date.now(),
          ...data,
          nome_departamento: nomeDep,
          cor: corDep
        };
        setEscalas([...escalas, newEscala]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getMarkedDays(escalas) {
    const result = {};

    escalas.forEach((escala) => {
      const dataKey = escala.dia ? escala.dia.split("T")[0] : escala.data;
      
      if (dataKey) {
        const cor = escala.cor || "#000000";
        
        if (!result[dataKey]) {
          result[dataKey] = [];
        }
        
        if (!result[dataKey].includes(cor)) {
          result[dataKey].push(cor);
        }
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
        filteredUsers.map((escala) => {
          const dataKey = escala.dia ? escala.dia.split("T")[0] : escala.data;
          const corExibicao = escala.cor || "#000000";
          const nomeDep = escala.nome_departamento || "Desconhecido";

          return (
            <div
              key={escala.id}
              className="w-[95%] bg-input dark:bg-input-dark rounded-2xl shadow-md px-4 py-2 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <p style={{ color: corExibicao }}>
                  {nomeDep}
                  <label className="text-preto dark:text-branco">
                    {" "}
                    - {getDiaDaSemanaCurto(dataKey)}
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
                  {formatDate(dataKey)}
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