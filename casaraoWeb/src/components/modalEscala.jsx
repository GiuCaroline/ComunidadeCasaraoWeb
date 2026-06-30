import { useState, useEffect } from "react";
import { Input } from "../components/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown } from "../components/dropdown";
import { PlusCircle, MinusCircle } from "@phosphor-icons/react";
import { getDeparts } from "../services/authService";

export function ModalEscala({ visible, onClose, onSave, escala, titulo }) {
  const [form, setForm] = useState({
    departamento_id: "",
    dia: null,
    responsavel1: "",
    responsavel2: "",
    horario1: "",
    horario2: "",
  });

  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");

  const [hora2, setHora2] = useState("");
  const [minuto2, setMinuto2] = useState("");
  const [departamentos, setDeparts] = useState([]);

  const [mostrarSegundaEscala, setMostrarSegundaEscala] = useState(false);
  const [perguntarMais, setPerguntarMais] = useState(false);

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
          value: String(item.id),
          label: item.departamento || "Sem Nome"
        }));

        setDeparts(departamentosFormatados);
      } catch (error) {
        console.log(error);
        setDeparts([]);
      }
    }
    carregarDeparts();
  }, []);

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

  function limparFormulario() {
    setForm({
      departamento_id: "",
      dia: null,
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

  useEffect(() => {
    if (escala) {
      const valorDia = escala.dia || escala.data;
      let parsedDate = null;

      if (valorDia) {
        const apenasData = valorDia.split("T")[0];
        parsedDate = new Date(apenasData + "T00:00:00");
      }

      setForm({
        ...escala,
        departamento_id: String(escala.departamento_id || escala.departamento || ""),
        dia: parsedDate,
      });

      preencherHorarios(escala.horario1, setHora, setMinuto);

      if (escala.responsavel2) {
        setMostrarSegundaEscala(true);
        preencherHorarios(escala.horario2, setHora2, setMinuto2);
      } else {
        setMostrarSegundaEscala(false);
        setHora2("");
        setMinuto2("");
      }
    } else {
      limparFormulario();
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
    if (!h) return null;
    const horaFormatada = h.padStart(2, "0");
    const minutoFormatado = m ? m.padStart(2, "0") : "00";
    return `${horaFormatada}:${minutoFormatado}:00`;
  }

  async function handleSubmit() {
    let dataString = null;

    if (form.dia) {
      const ano = form.dia.getFullYear();
      const mes = String(form.dia.getMonth() + 1).padStart(2, "0");
      const diaString = String(form.dia.getDate()).padStart(2, "0");
      dataString = `${ano}-${mes}-${diaString}`;
    }

    const horarioFinal1 = formatarParaBanco(hora, minuto);
    const horarioFinal2 = mostrarSegundaEscala ? formatarParaBanco(hora2, minuto2) : null;

    await onSave({
      ...form,
      dia: dataString,
      horario1: horarioFinal1,
      horario2: horarioFinal2,
    });

    if (escala) {
      onClose();
    } else {
      setPerguntarMais(true);
    }
  }

  function handleContinuar() {
    setPerguntarMais(false);
    limparFormulario();
  }

  function handleFinalizar() {
    setPerguntarMais(false);
    onClose();
  }

  if (perguntarMais) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-branco dark:bg-preto-dark w-[90%] max-w-sm rounded-2xl p-8 shadow-lg flex flex-col items-center gap-6">
          <h2 className="text-xl font-medium text-preto dark:text-branco text-center">
            Salvo com sucesso!
          </h2>
          <p className="text-[#5e5e5e] dark:text-[#a5a5a5] text-center text-base">
            Deseja adicionar mais uma escala?
          </p>
          <div className="flex w-full justify-between mt-2 gap-4">
            <button
              onClick={handleFinalizar}
              className="bg-vermelho text-branco px-6 py-2 rounded-full w-1/2"
            >
              Não
            </button>
            <button
              onClick={handleContinuar}
              className="bg-[#2e9448] text-branco px-6 py-2 rounded-full w-1/2"
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    );
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
            value={form.departamento_id}
            placeholder="Departamento"
            onChange={(item) => handleChange("departamento_id", item.value)}
          />

          <div className="w-[95%] mb-[7%] flex flex-col mt-[-6%]">
            <label className="text-[14px] text-[#5e5e5e] dark:text-[#a5a5a5] ml-[4.5%]">
              Data da Escala
            </label>

            <DatePicker
              selected={form.dia}
              onChange={(date) => handleChange("dia", date)}
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
            <div className="relative w-full flex flex-col justify-center items-center border border-1 border-vermelho dark:border-vermelho-dark rounded-xl px-2 py-6 mb-[2%] mt-[4%]">
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