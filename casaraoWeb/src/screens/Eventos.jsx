import { useState, useEffect } from "react";
import { TrashIcon, PencilSimple, PlusIcon } from "@phosphor-icons/react";
import { AlertCustom } from "../components/alert";
import { ModalEvento } from "../components/modalEvento";
import EventCalendarModal from "../components/eventCalendarModal";
import { OpcoesRecorrenciaModal } from "../components/opcoesRecorrenciaModal";
import MonthHeaderWeb from "../components/monthHeaderWeb";
import CustomCalendarWeb from "../components/customCalendarWeb";
import { getEventos, editEvento, deleteEvento, addEvento } from "../services/authService";

export default function Eventos() {
  const [eventosBase, setEventosBase] = useState([]);
  const [agendaBase, setAgendaBase] = useState([]);
  const [canceladosBase, setCanceladosBase] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState(null); 
  const [targetEvento, setTargetEvento] = useState(null);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDatesList, setSelectedDatesList] = useState([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [editModeType, setEditModeType] = useState("todos");

  async function carregarDados() {
    try {
      const data = await getEventos();
      setEventosBase(data.eventos || []);
      setAgendaBase(data.agenda || []);
      setCanceladosBase(data.cancelados || []);
    } catch (error) {
      setAlertType("error");
      setAlertTitle("Erro");
      setAlertMessage("Não foi possível carregar os eventos.");
      setAlertVisible(true);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setFilteredEventos([]);
      return;
    }
    const lista = getEventosParaData(selectedDate, eventosBase, agendaBase, canceladosBase);
    setFilteredEventos(lista);
  }, [selectedDate, eventosBase, agendaBase, canceladosBase]);

  function safeToDateString(dateInput) {
    if (!dateInput) return "";
    if (dateInput instanceof Date) {
      return dateInput.toISOString().split("T")[0];
    }
    return String(dateInput).substring(0, 10);
  }

  function verificaSemanaMes(dateObj, regra) {
    if (!regra) return true;
    const normalizedRegra = regra.toUpperCase();
    const dia = dateObj.getDate();
    const mes = dateObj.getMonth();
    const ano = dateObj.getFullYear();
    const semanaDoMes = Math.ceil(dia / 7);

    if (normalizedRegra === "PRIMEIRA") return semanaDoMes === 1;
    if (normalizedRegra === "SEGUNDA") return semanaDoMes === 2;
    if (normalizedRegra === "TERCEIRA") return semanaDoMes === 3;
    if (normalizedRegra === "QUARTA") return semanaDoMes === 4;
    
    if (normalizedRegra === "ULTIMA") {
      const proximaSemana = new Date(ano, mes, dia + 7);
      return proximaSemana.getMonth() !== mes;
    }
    
    if (normalizedRegra === "EXCETO_ULTIMA") {
      const proximaSemana = new Date(ano, mes, dia + 7);
      return proximaSemana.getMonth() === mes;
    }
    
    return true;
  }

  function getEventosParaData(dateString, deventos, dagenda, dcancelados) {
    const resultado = [];
    const dateObj = new Date(dateString + "T00:00:00");
    const dayOfWeek = dateObj.getDay();

    const daAgenda = dagenda.filter(ae => safeToDateString(ae.data) === dateString);
    resultado.push(...daAgenda.map(e => ({ ...e, agenda_id: e.agenda_id, id: e.evento_id, date: dateString })));

    deventos.forEach(evento => {
      if ((evento.recorrente || evento.recorrencia_id) && evento.ativo !== false) {
        const isCancelado = dcancelados.some(c => Number(c.evento_id) === Number(evento.id) && safeToDateString(c.data) === dateString);
        if (isCancelado) return;

        const dataInicioStr = safeToDateString(evento.data_inicio);
        const dataFimStr = safeToDateString(evento.data_fim);

        if (dataInicioStr && dateString < dataInicioStr) return;
        if (dataFimStr && dateString > dataFimStr) return;

        if (Number(evento.dia_semana) === dayOfWeek) {
          if (Number(evento.intervalo_semanas) > 1 && dataInicioStr) {
            const d1 = new Date(dataInicioStr + "T00:00:00");
            d1.setDate(d1.getDate() - d1.getDay());
            
            const d2 = new Date(dateString + "T00:00:00");
            d2.setDate(d2.getDate() - d2.getDay());
            
            const diffTime = d2 - d1;
            if (diffTime >= 0) {
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
              const diffWeeks = Math.round(diffDays / 7);
              if (diffWeeks % Number(evento.intervalo_semanas) !== 0) return;
            } else {
              return;
            }
          }

          if (evento.semana_mes) {
            const passaFiltro = verificaSemanaMes(dateObj, evento.semana_mes);
            if (!passaFiltro) return;
          }

          resultado.push({
            ...evento,
            date: dateString,
            isGroup: true
          });
        }
      }
    });

    return resultado;
  }

  function getMarkedDays() {
    const result = {};
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const lista = getEventosParaData(currentDate, eventosBase, agendaBase, canceladosBase);
      if (lista.length > 0) {
        result[currentDate] = true;
      }
    }
    return result;
  }

  const markedDays = getMarkedDays();

  function handleTriggerDelete(evento) {
    if (evento.isGroup) {
      setCurrentAction("delete");
      setTargetEvento(evento);
      setOptionsVisible(true);
    } else {
      setTargetEvento(evento);
      executarExclusaoDirect(evento.id, [], "todos", evento.agenda_id);
    }
  }

  function handleTriggerEdit(evento) {
    if (evento.isGroup) {
      setCurrentAction("edit");
      setTargetEvento(evento);
      setOptionsVisible(true);
    } else {
      setEditModeType("todos");
      setSelectedDatesList([]);
      setTargetEvento(evento);
      setEditingEvento(evento);
      setModalVisible(true);
    }
  }

  function handleSelectModo(modo) {
    setOptionsVisible(false);
    if (modo === "todos") {
      if (currentAction === "delete") {
        executarExclusaoDirect(targetEvento.id, [], "todos");
      } else {
        setEditModeType("todos");
        setSelectedDatesList([]);
        setEditingEvento(targetEvento);
        setModalVisible(true);
      }
    } else if (modo === "alguns") {
      setCalendarVisible(true);
    }
  }

  function handleCalendarContinue(datasSelecionadas) {
    setCalendarVisible(false);
    if (currentAction === "delete") {
      executarExclusaoDirect(targetEvento.id, datasSelecionadas, "alguns");
    } else {
      setEditModeType("alguns");
      setSelectedDatesList(datasSelecionadas);
      setEditingEvento(targetEvento);
      setModalVisible(true);
    }
  }

  async function executarExclusaoDirect(eventoId, datas, modo, agendaId) {
    try {
      await deleteEvento({ eventoId, modo, datas, agendaId });
      setAlertType("success");
      setAlertTitle("Sucesso");
      setAlertMessage("Exclusão realizada com sucesso.");
      setAlertVisible(true);
      carregarDados();
    } catch (err) {
      setAlertType("error");
      setAlertTitle("Erro");
      setAlertMessage("Não foi possível excluir.");
      setAlertVisible(true);
    }
  }

 async function handleSaveEvento(formData) {
    setModalVisible(false);
    try {
      if (targetEvento || formData.id) {
        await editEvento({
          eventoId: targetEvento ? targetEvento.id : formData.id,
          modo: editModeType,
          datas: selectedDatesList,
          nome: formData.nome,
          horario: formData.horario,
          categoria: formData.categoria,
          agendaId: targetEvento ? targetEvento.agenda_id : formData.agenda_id
        });
        setAlertType("success");
        setAlertTitle("Sucesso");
        setAlertMessage("Alteração salva com sucesso.");
      } else {
        const dataFormatada = formData.dia.toISOString().split("T")[0];
        await addEvento({
          nome: formData.nome,
          horario: formData.horario,
          categoria: formData.categoria,
          recorrente: formData.recorrente,
          tipo_recorrencia: formData.tipo_recorrencia,
          dia: dataFormatada
        });
        setAlertType("success");
        setAlertTitle("Sucesso");
        setAlertMessage("Evento criado com sucesso.");
      }
      setAlertVisible(true);
      carregarDados();
    } catch (err) {
      setAlertType("error");
      setAlertTitle("Erro");
      setAlertMessage("Não foi possível salvar as alterações.");
      setAlertVisible(true);
    }
  }

  function getDiaSemanaTexto(dateString) {
    if (!dateString) return "";
    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const date = new Date(dateString + "T00:00:00");
    return diasSemana[date.getDay()];
  }

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

      {selectedDate && filteredEventos.map((evento, index) => (
        <div
          key={evento.agenda_id ? `agenda-${evento.agenda_id}` : `rec-${evento.id}-${index}`}
          className="w-[95%] bg-input dark:bg-input-dark rounded-2xl shadow-md px-4 py-3 flex justify-between items-center"
        >
          <div className="w-[72%]">
            <p className="font-normal text-preto dark:text-branco">
              {evento.nome} - {getDiaSemanaTexto(evento.date)}
            </p>
            <div className="flex justify-between w-full">
              <p className="text-sm font-light text-preto dark:text-branco">
                {evento.horario}
              </p>
              <p className="text-sm font-light text-preto dark:text-branco">
                {formatDate(evento.date)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleTriggerDelete(evento)}>
              <TrashIcon size={30} className="text-vermelho dark:text-vermelho-dark" />
            </button>

            <button onClick={() => handleTriggerEdit(evento)}>
              <PencilSimple size={30} className="text-[#01CB34]" />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => {
          setTargetEvento(null);
          setEditingEvento(null);
          setEditModeType("todos");
          setSelectedDatesList([]);
          setModalVisible(true);
        }}
        className="fixed bottom-6 right-6 bg-vermelho dark:text-vermelho-dark shadow-md rounded-full p-4"
        id="editar"
      >
        <PlusIcon className="text-branco" size={30} />
      </button>

      <OpcoesRecorrenciaModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        onSelectModo={handleSelectModo}
        acao={currentAction}
      />

      <ModalEvento
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEvento}
        evento={editingEvento}
        modo={editModeType}
      />

      <EventCalendarModal
        visible={calendarVisible}
        eventoGrupo={targetEvento}
        onClose={() => setCalendarVisible(false)}
        onContinue={handleCalendarContinue}
      />

      <AlertCustom
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
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