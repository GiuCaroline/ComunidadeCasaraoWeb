import { useState, useEffect } from "react";
import { Input } from "../components/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown } from "../components/dropdown";

export function ModalEvento({ visible, onClose, onSave, evento }) {
  const [form, setForm] = useState({
    nome: "",
    semana: "",
    horario: "",
    dia: ""
  });


  const repeticoes = [
    { value: "1", label: "Semanal" },
    { value: "2", label: "Quinzenal" },
  ];


  useEffect(() => {
    if (evento) {
        setForm(evento);

        if (evento.horario) {
        const partes = evento.horario.split("h");
        setHora(partes[0] || "");
        setMinuto(partes[1] || "");
        }
    } else {
        setForm({
        nome: "",
        semana: "",
        horario: "",
        dia: ""
        });
        setHora("");
        setMinuto("");
    }
    }, [evento]);

  
  
    const [hora, setHora] = useState("");
    const [minuto, setMinuto] = useState("");

  if (!visible) return null;

  function handleChange(field, value) {
    setForm((prev) => ({
        ...prev,
        [field]: value
    }));
}

  function handleSubmit() {
        let horarioFinal = "";

        if (hora) {
            const horaFormatada = hora.padStart(2, "0");

            if (
            minuto &&
            minuto !== "0" &&
            minuto !== "00"
            ) {
            const minutoFormatado = minuto.padStart(2, "0");
            horarioFinal = `${horaFormatada}h${minutoFormatado}`;
            } else {
            horarioFinal = `${horaFormatada}h`;
            }
        }

        onSave({
            ...form,
            horario: horarioFinal
        });
    }



  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-branco dark:bg-preto-dark w-[90%] max-w-md rounded-2xl p-6 shadow-lg ">
        
        <h2 className="text-lg font-normal mb-4 text-preto dark:text-branco">
          {evento ? "Editar Evento" : "Novo Evento"}
        </h2>

        <div className="flex flex-col gap-3 items-center justify-center">
            <Input
                texto="Nome do Evento"
                value={form.nome}
                onChange={(value) => handleChange("nome", value)}
            />

            <div className="w-[95%] mb-[7%] flex flex-col mt-[-6%]">
                <label className="text-[14px] text-[#5e5e5e] dark:text-[#a5a5a5] mb-1">
                    Data do Evento
                </label>
        
                <DatePicker
                    selected={form.dia}
                    onChange={(date) => handleChange("dia", date)}
                    dateFormat="dd/MM/yyyy"
                    locale="pt-BR"
                    className="h-[48px] text-preto dark:text-branco w-full shadow-md bg-input dark:bg-input-dark rounded-xl px-[15px] outline-none"
                />
            </div>

            <div className="mt-[-5%] ml-[3%]">
                <label className="ml-[3%] text-[14px] text-[#5e5e5e] dark:text-[#a5a5a5]">
                    Horário
                </label>

                <div className="w-full flex items-end justify-start gap-2 mb-[7%] mt-[3%]">
                    <div className="w-[25%]">
                        <Input
                        texto="Hora"
                        value={hora}
                        onChange={setHora}
                        type="number"
                        />
                    </div>

                    <span className="text-xl mb-5 text-preto dark:text-branco">:</span>

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

            <Dropdown
                data={repeticoes}
                placeholder="Repetir Evento"
            />



        </div>

        <div className="flex justify-between w-[95%] mt-6">
            <button
            onClick={onClose}
            className="bg-vermelho text-branco px-10 py-2 rounded-full"
            >
                Voltar
            </button>

            <button
            onClick={handleSubmit}
            className="bg-vermelho text-branco px-10 py-2 rounded-full"
            >
                Salvar
            </button>
        </div>

      </div>
    </div>
  );
}
