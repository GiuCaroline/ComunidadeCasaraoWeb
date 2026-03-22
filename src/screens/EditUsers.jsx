import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../components/input";
import { MascFem } from "../components/genero";
import { Dropdown } from "../components/dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";

registerLocale("pt-BR", ptBR);


export default function EditUsers() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;

  if (!user) {
    navigate("/usuarios");
  }

  const cargos = [
    { value: "1", label: "Cooperador" },
    { value: "2", label: "Discipulador" },
    { value: "3", label: "Equipe de Intercessão" },
    { value: "4", label: "Funcionário" },
    { value: "5", label: "Líder de Departamento" },
    { value: "6", label: "Líder de GR" },
    { value: "7", label: "Líder de Ministério" },
    { value: "8", label: "Membro" },
    { value: "9", label: "Pastor" },
    { value: "10", label: "STAFF ILUMINAÇÃO" },
    { value: "11", label: "STAFF MÍDIA" },
    { value: "12", label: "STAFF PROJEÇÃO" },
    { value: "13", label: "STAFF SOM" },
    { value: "14", label: "STAFF VÍDEO" },
    { value: "15", label: "Visitante" },
  ];

  const estadoCivis = [
    { value: "1", label: "Casado(a)" },
    { value: "2", label: "Desquitado(a)" },
    { value: "3", label: "Divorciado(a)" },
    { value: "4", label: "Não Informar" },
    { value: "5", label: "Separado(a)" },
    { value: "6", label: "Solteiro(a)" },
    { value: "7", label: "União Estável" },
    { value: "8", label: "Viúvo(a)" },
  ];

  const grauInstrs = [
    { value: "1", label: "Alfabetizado" },
    { value: "2", label: "Bacharelado" },
    { value: "3", label: "Doutorado" },
    { value: "4", label: "Especialização/Pós Graduação" },
    { value: "5", label: "Fundamental (1°Grau) Completo" },
    { value: "6", label: "Fundamental (1°Grau) Incompleto" },
    { value: "7", label: "Médio (2°Grau) Completo" },
    { value: "8", label: "Médio (2°Grau) Incompleto" },
    { value: "9", label: "Mestrado" },
    { value: "10", label: "Não Sabe Ler/Escrever" },
    { value: "11", label: "Superior Completo" },
    { value: "12", label: "Superior Incompleto" },
  ];

  const situacaos = [
    { value: "Ativo", label: "Ativo" },
    { value: "Em Tranferência", label: "Em Tranferência" },
    { value: "Inativo", label: "Inativo" },
  ];

  const departamentos = [
    { value: "1", label: "Louvor" },
    { value: "2", label: "Mídia" },
    { value: "3", label: "Iluminação" },
    { value: "4", label: "Som" },
    { value: "4", label: "Diaconato" },
  ];

  const [nome, setNome] = useState(user?.nome || "");
  const [cargo, setCargo] = useState("5");
  const [estadoCivil, setEstadoCivil] = useState("6");
  const [conjuge, setConjuge] = useState("");
  const [grauInstr, setGrauInstr] = useState("12");
  const [situacao, setSituacao] = useState("Ativo");
  const [email, setEmail] = useState(user?.email || "");
  const [sexo, setSexo] = useState(user?.sexo || "M");
  const [telefone, setTelefone] = useState("(11) 940205682");
  const [mae, setMae] = useState("Siclana de tal");
  const [pai, setPai] = useState("Siclano de tal");
  const [endereco, setEndereco] = useState("Rua dos Bobos");
  const [departamento, setDepartamento] = useState("");
  const [corEscala, setCorEscala] = useState("#0077ff");
  const [cep, setCep] = useState("09123-123");
  const [uf, setUf] = useState("SP");
  const [bairro, setBairro] = useState("Vila Velha");
  const [complemento, setComplemento] = useState("Nenhum, essa sua cabeça oca!!!");
  const [nascimento, setNascimento] = useState(new Date(2010, 9, 10));
  const [membro, setMembro] = useState(new Date(2015, 7));
  const [batismo, setBatismo] = useState(new Date(2019, 9, 19));

  function handleSave() {
    console.log("Usuário atualizado:", {
      nome,
      estadoCivil,
      conjuge,
      grauInstr,
      situacao,
      mae,
      pai,
      cep,
      uf,
      email,
      telefone,
      endereco,
      bairro,
      complemento,
      cargo,
      nascimento,
      membro,
      batismo,
    });

    navigate("/usuarios");
  }



  async function buscarCep(cep) {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );

      const data = await response.json();

      if (!data.erro) {
        setEndereco(data.logradouro);
        setBairro(data.bairro);
        setUf(data.uf);
      }
    } catch (error) {
      console.log("Erro ao buscar CEP");
    }
  }

  return (
    <div className="flex flex-col items-center pt-6 pb-10 px-5">

      <Input texto="Nome" value={nome} onChange={setNome} />
      <Dropdown
        data={cargos}
        value={cargo}
        placeholder="Cargo"
        onChange={(item) => setCargo(item.value)}
      />
      {cargo === "5" && (
        <div className="flex items-center gap-4 w-[95%] mb-[7%]">

          <div className="w-1/2">
            <Dropdown
              data={departamentos}
              value={departamento}
              placeholder="Departamento"
              onChange={(item) => setDepartamento(item.value)}
            />
          </div>

          <div className="w-1/2 flex flex-col mt-[-12%]">
            <label className="text-sm text-[#5e5e5e] mb-1">
              Cor da Escala
            </label>
            <input
              type="color"
              value={corEscala}
              onChange={(e) => setCorEscala(e.target.value)}
              className="h-[48px] w-full rounded-xl cursor-pointer"
            />
          </div>

        </div>
      )}

      <div className="w-[95%] mb-[7%] flex flex-col">
        <label className="text-[14px] text-[#5e5e5e] mb-1">
          Data de Nascimento
        </label>

        <DatePicker
          selected={nascimento}
          onChange={(date) => setNascimento(date)}
          dateFormat="dd/MM/yyyy"
          locale="pt-BR"
          maxDate={new Date()}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          className="h-[48px] w-full bg-input dark:bg-input-dark rounded-xl px-[15px] outline-none shadow-md"
        />
      </div>
      <MascFem value={sexo} onChange={setSexo} />
      <Dropdown
        data={estadoCivis}
        value={estadoCivil}
        placeholder="Estado Civil"
        onChange={(item) => setEstadoCivil(item.value)}
      />
      {(estadoCivil === "1" || estadoCivil === "7") && (
        <Input
          texto="Cônjuge"
          value={conjuge}
          onChange={setConjuge}
        />
      )}
      <Dropdown
        data={grauInstrs}
        value={grauInstr}
        placeholder="Grau de Instrução"
        onChange={(item) => setGrauInstr(item.value)}
      />
      <Dropdown
        data={situacaos}
        value={situacao}
        placeholder="Situação"
        onChange={(item) => setSituacao(item.value)}
      />
      <Input texto="Celular" value={telefone} onChange={(value) => setTelefone(formatTelefone(value))}/>
      <Input texto="Mãe" value={mae} onChange={setMae} />
      <Input texto="Pai" value={pai} onChange={setPai} />

      <div className="flex items-center w-full gap-2 mb-[7%]">
        <p className="font-normal text-vermelho">Endereço</p>
        <div className="bg-vermelho w-full h-[1px]"></div>
      </div>

      <div className="flex gap-5 px-2">
        <Input
          texto="Cep"
          value={cep}
          onChange={(value) => {
            const formatted = formatCep(value);
            setCep(formatted);

            if (formatted.length === 9) {
              buscarCep(formatted);
            }
          }}
        />

        <Input texto="Uf" value={uf} onChange={setUf} />
      </div>
      
      <Input texto="Endereço" value={endereco} onChange={setEndereco} />
      <Input texto="Bairro" value={bairro} onChange={setBairro} />
      <Input texto="Complemento" value={complemento} onChange={setComplemento} />
        
      <div className="flex items-center w-full gap-2 mb-[7%]">
        <p className="font-normal text-vermelho">Igreja</p>
        <div className="bg-vermelho w-full h-[1px]"></div>
      </div>

      <div className="w-[95%] mb-[7%] flex flex-col">
        <label className="text-[14px] text-[#5e5e5e] mb-1">
          Membro Desde
        </label>

        <DatePicker
          locale="pt-BR"
          maxDate={new Date()}
          selected={membro}
          onChange={(date) => setMembro(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="h-[48px] w-full bg-input dark:bg-input-dark rounded-xl px-[15px] outline-none shadow-md"
          placeholderText="Selecione mês e ano"
        />
      </div>

      <div className="w-[95%] mb-[7%] flex flex-col">
        <label className="text-[14px] text-[#5e5e5e] mb-1">
          Data do Batismo
        </label>

        <DatePicker
          locale="pt-BR"
          maxDate={new Date()}
          selected={batismo}
          onChange={(date) => setBatismo(date)}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          dateFormat="dd/MM/yyyy"
          className="h-[48px] w-full bg-input dark:bg-input-dark rounded-xl px-[15px] outline-none shadow-md"
          placeholderText="Selecione a data"
        />
      </div>

      <Input texto="Email" value={email} onChange={setEmail} type="email" />

      <div className="flex justify-between w-[95%] mt-6">
        <button
          onClick={() => navigate("/usuarios")}
          className="bg-vermelho text-branco px-10 py-2 rounded-full"
        >
          Voltar
        </button>

        <button
          onClick={handleSave}
          className="bg-vermelho text-branco px-10 py-2 rounded-full"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}



function formatTelefone(value) {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 10) {
    return numbers
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numbers
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}


function formatCep(value) {
  const numbers = value.replace(/\D/g, "");

  return numbers
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}
