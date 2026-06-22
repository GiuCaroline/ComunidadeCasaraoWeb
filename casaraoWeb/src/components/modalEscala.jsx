import { useState, useEffect } from "react";
import { Input } from "../components/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown } from "../components/dropdown";
import { PlusCircle, MinusCircle } from "@phosphor-icons/react";

export function ModalEscala({ visible, onClose, onSave, escala, titulo }) {
  const [form, setForm] = useState({
    gap: "",
    data: null,
    responsavel1: "",
    responsavel2: "",
    horario1: "",
    horario2: "",
  });

  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");

  const [hora2, setHora2] = useState(""); // Ajustei o nome do estado para hora2 para manter o padrão
  const [minuto2, setMinuto2] = useState("");

  const [mostrarSegundaEscala, setMostrarSegundaEscala] = useState(false);

  const departamentos = [
    { value: "1", label: "Louvor" },
    { value: "2", label: "Mídia" },
    { value: "3", label: "Iluminação" },
    { value: "4", label: "Som" },
    { value: "5", label: "Diaconato" },
    { value: "6", label: "Projeção" },
  ];

  // Função para quebrar a string do banco ("10:30:00") e colocar nos inputs
  function preencherHorarios(horarioString, setH, setM) {
    if (!horarioString) {
      setH("");
      setM("");
      return;
    }
    const partes = horarioString.split(":");
    if (partes.length >= 2) {
      setH(partes[0]);
      setM(partes[1]);
    }
  }

  useEffect(() => {
    if (escala) {
      const parsedDate = escala.data
        ? new Date(escala.data + "T00:00:00")
        : null;

      setForm({
        ...escala,
        data: parsedDate,
      });

      // Preenche os inputs da primeira escala
      preencherHorarios(escala.horario1, setHora, setMinuto);

      // Preenche os inputs da segunda escala, se houver
      if (escala.responsavel2) {
        setMostrarSegundaEscala(true);
        preencherHorarios(escala.horario2, setHora2, setMinuto2);
      } else {
        setMostrarSegundaEscala(false);
        setHora2("");
        setMinuto2("");
      }
    } else {
      setForm({
        gap: "",
        data: null,
        responsavel1: "",
        responsavel2: "",
        horario1: "",
        horario2: "",
      });
      setHora("");
      setMinuto("");
      setHora2("");
      setMinuto2("");
      setMostrarSegundaEscala(false);
    }
  }, [escala]);

  if (!visible) return null;

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleAddSegundaEscala() {
    setMostrarSegundaEscala(true);
  }

  function handleRemoveSegundaEscala() {
    setMostrarSegundaEscala(false);
    handleChange("responsavel2", "");
    setHora2("");
    setMinuto2("");
  }

  function formatarParaBanco(h, m) {
    if (!h) return "";
    const horaFormatada = h.padStart(2, "0");
    const minutoFormatado = m ? m.padStart(2, "0") : "00";
    return `${horaFormatada}:${minutoFormatado}:00`;
  }

  function handleSubmit() {
    let dataString = "";

    if (form.data) {
      const ano = form.data.getFullYear();
      const mes = String(form.data.getMonth() + 1).padStart(2, "0");
      const dia = String(form.data.getDate()).padStart(2, "0");
      dataString = `${ano}-${mes}-${dia}`;
    }

    const horarioFinal1 = formatarParaBanco(hora, minuto);
    const horarioFinal2 = mostrarSegundaEscala ? formatarParaBanco(hora2, minuto2) : "";

    onSave({
      ...form,
      data: dataString,
      horario1: horarioFinal1,
      horario2: horarioFinal2,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-branco dark:bg-preto-dark w-[90%] max-w-md rounded-2xl p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-normal mb-6 text-preto dark:text-branco">
          {titulo}
        </h2>

        <div className="flex flex-col gap-3 items-center justify-center">
          <Dropdown
            data={departamentos}
            value={form.gap}
            placeholder="Gap"
            onChange={(item) => handleChange("gap", item.value)}
          />

          <div className="w-[95%] mb-[7%] flex flex-col mt-[-6%]">
            <label className="text-[14px] text-[#5e5e5e] dark:text-[#a5a5a5] ml-[4.5%]">
              Data da Escala
            </label>

            <DatePicker
              selected={form.data}
              onChange={(date) => handleChange("data", date)}
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              className="h-[48px] text-preto dark:text-branco w-full shadow-md bg-input dark:bg-input-dark rounded-xl px-[15px] outline-none"
            />
          </div>

          <div className="relative w-full flex flex-col justify-center items-center border border-1 border-vermelho dark:border-vermelho-dark rounded-xl px-2 py-6 mb-[2%] mt-[2%]">
            <div className="absolute -top-3 left-4 bg-branco dark:bg-preto-dark px-2">
              <span className="text-sm font-popRegular text-preto dark:text-branco">
                1º Escala
              </span>
            </div>

            <div
              className={`absolute -top-4 right-4 transition-opacity duration-300 ${
                mostrarSegundaEscala ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <button
                onClick={handleAddSegundaEscala}
                className="bg-branco dark:bg-preto-dark rounded-full"
              >
                <PlusCircle size={32} className="text-[#2e9448]" weight="fill" />
              </button>
            </div>

            <Input
              texto="Responsável"
              value={form.responsavel1}
              onChange={(value) => handleChange("responsavel1", value)}
            />

            <div className="w-full flex items-end justify-start gap-2 ml-[3%]">
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

          <div
            className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
              mostrarSegundaEscala ? "max-h-[500px] opacity-100 mt-[2%]" : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <div className="relative w-full flex flex-col justify-center items-center border border-1 border- dark:border-vermelho-dark rounded-xl px-2 py-6 mb-[2%] mt-[4%]">
              <div className="absolute -top-3 left-4 bg-branco dark:bg-preto-dark px-2">
                <span className="text-sm font-popRegular text-preto dark:text-branco">
                  2º Escala
                </span>
              </div>

              <button
                onClick={handleRemoveSegundaEscala}
                className="absolute -top-4 right-4 bg-branco dark:bg-preto-dark rounded-full"
              >
                <MinusCircle size={32} className="text-vermelho dark:text-vermelho-dark" weight="fill" />
              </button>

              <Input
                texto="Responsável"
                value={form.responsavel2}
                onChange={(value) => handleChange("responsavel2", value)}
              />

              <div className="w-full flex items-end justify-start gap-2 ml-[3%]">
                <div className="w-[25%]">
                  <Input
                    texto="Hora"
                    value={hora2}
                    onChange={setHora2}
                    type="number"
                  />
                </div>

                <span className="text-xl mb-5 text-preto dark:text-branco">
                  :
                </span>

                <div className="w-[25%]">
                  <Input
                    texto="Min"
                    value={minuto2}
                    onChange={setMinuto2}
                    type="number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between w-[95%] mt-6 mx-auto">
          <button
            onClick={onClose}
            className="bg-vermelho dark:bg-vermelho-dark text-branco px-10 py-2 rounded-full"
          >
            Voltar
          </button>

          <button
            onClick={handleSubmit}
            className="bg-vermelho dark:bg-vermelho-dark text-branco px-10 py-2 rounded-full"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}