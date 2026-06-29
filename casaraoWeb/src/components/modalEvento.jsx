import { useState, useEffect } from "react";
import { Input } from "../components/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown } from "../components/dropdown";

export function ModalEvento({ visible, onClose, onSave, evento, modo }) {
  const isAdicionar = !evento;

  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    dia: new Date(),
    tipo_recorrencia: "NENHUMA",
    isRecorrenteOpcao: "NAO"
  });

  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");

  const repeticoes = [
    { value: "SEMANAL", label: "Semanal" },
    { value: "QUINZENAL", label: "Quinzenal" },
  ];

  const opcoesRecorrente = [
    { value: "SIM", label: "Sim" },
    { value: "NAO", label: "Não" },
  ];

  const categorias = [
    { value: "Culto", label: "Culto" },
    { value: "Especial", label: "Especial" },
  ];

  useEffect(() => {
    if (evento) {
      setForm({
        nome: evento.nome || "",
        categoria: evento.categoria || "",
        dia: evento.date ? new Date(evento.date + "T00:00:00") : new Date(),
        tipo_recorrencia: evento.tipo_recorrencia || "NENHUMA",
        isRecorrenteOpcao: evento.recorrente ? "SIM" : "NAO"
      });

      if (evento.horario) {
        const partes = evento.horario.split(":");
        setHora(partes[0] || "");
        setMinuto(partes[1] || "");
      }
    } else {
      setForm({
        nome: "",
        categoria: "Especial",
        dia: new Date(),
        tipo_recorrencia: "NENHUMA",
        isRecorrenteOpcao: "NAO"
      });
      setHora("");
      setMinuto("");
    }
  }, [evento, visible]);

  if (!visible) return null;

  function handleChange(field, value) {
    if (modo === "alguns" && (field === "dia" || field === "tipo_recorrencia")) {
      return;
    }

    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      if (isAdicionar && field === "isRecorrenteOpcao") {
        if (value === "SIM") {
          updated.categoria = "Culto";
          updated.tipo_recorrencia = "SEMANAL";
        } else {
          updated.categoria = "Especial";
          updated.tipo_recorrencia = "NENHUMA";
        }
      }

      return updated;
    });
  }

  function handleSubmit() {
    let horarioFinal = "00:00:00";

    if (hora) {
      const horaFormatada = String(hora).padStart(2, "0");
      const minutoFormatado = minuto ? String(minuto).padStart(2, "0") : "00";
      horarioFinal = `${horaFormatada}:${minutoFormatado}:00`;
    }

    onSave({
      ...evento,
      nome: form.nome,
      categoria: form.categoria,
      dia: form.dia,
      horario: horarioFinal,
      recorrente: isAdicionar ? form.isRecorrenteOpcao === "SIM" : evento?.recorrente,
      tipo_recorrencia: form.tipo_recorrencia
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-branco dark:bg-preto-dark w-[90%] max-w-md rounded-2xl p-6 shadow-lg">
        
        <h2 className="text-lg font-normal mb-4 text-preto dark:text-branco">
          {evento ? "Editar Evento" : "Novo Evento"}
        </h2>

        <div className="flex flex-col gap-3 items-center justify-center">
          <Input
            texto="Nome do Evento"
            value={form.nome}
            onChange={(value) => handleChange("nome", value)}
          />

          {!isAdicionar && (
            <Dropdown
              placeholder="Categoria"
              value={form.categoria}
              data={categorias}
              onChange={(item) => handleChange("categoria", item.value || item)}
            />
          )}

          {isAdicionar && (
            <Dropdown
              placeholder="Recorrente?"
              value={form.isRecorrenteOpcao}
              data={opcoesRecorrente}
              onChange={(item) => handleChange("isRecorrenteOpcao", item.value || item)}
            />
          )}

          <div className="w-[95%] mb-[7%] flex flex-col mt-[-3%] opacity-100 data-[disabled=true]:opacity-50" data-disabled={modo === "alguns"}>
            <label className="text-[14px] text-[#5e5e5e] dark:text-[#a5a5a5] ml-[4.5%]">
              Data do Evento
            </label>
    
            <DatePicker
              selected={form.dia}
              onChange={(date) => handleChange("dia", date)}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              disabled={modo === "alguns"}
              className="h-[48px] text-preto dark:text-branco w-full shadow-md bg-input dark:bg-input-dark rounded-xl px-[15px] outline-none disabled:cursor-not-allowed"
            />
          </div>

          <div className="mt-[-5%] ml-[3%] w-full">
            <div className="w-full flex items-end justify-start gap-2 mb-[7%] mt-[3%]">
              <div className="w-[25%]">
                <Input
                  texto="Hora"
                  value={hora}
                  onChange={setHora}
                  type="number"
                />
              </div>

              <span className="text-xl mb-3 text-preto dark:text-branco">:</span>

              <div className="w-[25%]">
                <Input
                  texto="Min"
                  value={minuto}
                  onChange={setMinuto}
                  type="number"
                />
              </div>
            </div>
          </div>

          {isAdicionar && form.isRecorrenteOpcao === "SIM" && (
            <div className="w-[95%]">
               <Dropdown
                  data={repeticoes}
                  placeholder="Frequência da Recorrência"
                  value={form.tipo_recorrencia}
                  onChange={(item) => handleChange("tipo_recorrencia", item.value || item)}
                />
            </div>
          )}

        </div>

        <div className="flex justify-between w-[95%] mx-auto mt-8">
          <button
            onClick={onClose}
            className="bg-vermelho text-branco px-8 py-2 rounded-full font-light"
          >
            Voltar
          </button>

          <button
            onClick={handleSubmit}
            className="bg-vermelho-dark text-branco px-8 py-2 rounded-full font-light"
          >
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
}