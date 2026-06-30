import { useState, useEffect } from "react";
import { Input } from "../components/input";
import { Dropdown } from "../components/dropdown";

export function ModalCurso({ visible, onClose, onSave, curso }) {
  const [form, setForm] = useState({
    nome_curso: "",
    dias: "",
    horario: "",
    descricao: "",
    celular: "",
    email: ""
  });

  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");

  const Dias = [
    { value: "Às terças", label: "Às terças" },
    { value: "Às terças e quintas", label: "Às terças e quintas" },
    { value: "Às quintas", label: "Às quintas" },
  ];
  
  useEffect(() => {
    if (curso) {
        setForm(curso);

        if (curso.horario) {
            const partes = curso.horario.split(":");
            setHora(partes[0] || "");
            setMinuto(partes[1] || "");
        }
    } else {
        setForm({
            nome_curso: "",
            dias: "",
            horario: "",
            descricao: "",
            celular: "",
            email: ""
        });
        setHora("");
        setMinuto("");
    }
  }, [curso]);

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

        if (minuto && minuto !== "0" && minuto !== "00") {
            const minutoFormatado = minuto.padStart(2, "0");
            horarioFinal = `${horaFormatada}:${minutoFormatado}:00`;
        } else {
            horarioFinal = `${horaFormatada}:00:00`;
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
          {curso ? "Editar Curso" : "Novo Curso"}
        </h2>

        <div className="flex flex-col gap-3 items-center justify-center">
            <Input
                texto="Nome do Curso"
                value={form.nome_curso}
                onChange={(value) => handleChange("nome_curso", value)}
            />

            <Dropdown
                data={Dias}
                placeholder="Dia da Semana"
                value={form.dias}
                onChange={(item) => handleChange("dias", item.value)}
            />

            <div className="mt-[-5%] ml-[3%]">
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

            <Input
                texto="Descrição"
                value={form.descricao}
                onChange={(value) => handleChange("descricao", value)}
                multiline={true}
                rows={5}
            />

            <Input
                texto="Whatsapp Responsável"
                value={formataPhone(form.celular)}
                onChange={(value) => handleChange("celular", value)}
            />

            <Input
                texto="Email Resposável"
                value={form.email}
                onChange={(value) => handleChange("email", value)}
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

function formataPhone(value) {
    if (!value) return "";
    let v = value.replace(/\D/g, "");

    if (v.length > 0) {
        v = "(" + v;
    }

    if (v.length > 3) {
        v = v.slice(0, 3) + ") " + v.slice(3);
    }

    if (v.length > 10) {
        v = v.slice(0, 10) + "-" + v.slice(10, 14);
    }

    return v;
}