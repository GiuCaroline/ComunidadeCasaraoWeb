import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "../components/input";
import { MascFem } from "../components/genero";
import { Dropdown } from "../components/dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import { getCargos } from "../services/authService";

registerLocale("pt-BR", ptBR);

export default function EditUsers() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cargos, setCargos] = useState([]);
  const user = location.state?.user;

  if (!user) {
    navigate("/usuarios");
  }

  useEffect(() => {
      async function carregarCargos() {
        try {
          const data = await getCargos();
  
          if (Array.isArray(data)) {
            setCargos(data);
          } else if (data && Array.isArray(data.cargos)) {
            setCargos(data.cargos);
          } else if (data && Array.isArray(data.data)) {
            setCargos(data.data);
          } else if (data && typeof data === 'object') {
            const extrairArray = Object.values(data).find(Array.isArray);
            setCargos(extrairArray || []);
          } else {
            setCargos([]);
          }
        } catch (error) {
          console.log(error);
          setCargos([]);
        }
      }
      carregarCargos();
    }, []);


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
  const [cargo, setCargo] = useState(user?.cargo ? String(user.cargo) : "");
  const [estadoCivil, setEstadoCivil] = useState(user?.estadocivil ? String(user.estadocivil) : "");
  const [conjuge, setConjuge] = useState(user?.conjuge || "");
  const [grauInstr, setGrauInstr] = useState(user?.grauInstr ? String(user.grauInstr) : "");
  const [situacao, setSituacao] = useState(user?.situacao ? String(user.situacao) : "");
  const [email, setEmail] = useState(user?.email || "");
  const [sexo, setSexo] = useState(user?.sexo || "M");
  const [telefone, setTelefone] = useState(user?.celular || "");
  const [mae, setMae] = useState(user?.mae || "");
  const [pai, setPai] = useState(user?.pai || "");
  const [endereco, setEndereco] = useState(user?.endereco || "");
  const [departamento, setDepartamento] = useState(user?.departamento ? String(user.departamento) : "");
  const [corEscala, setCorEscala] = useState("");
  const [cep, setCep] = useState(user?.cep || "");
  const [uf, setUf] = useState(user?.uf || "");
  const [bairro, setBairro] = useState(user?.bairro || "");
  const [complemento, setComplemento] = useState(user?.complemento || "");
  const [nascimento, setNascimento] = useState(user?.dtanasc ? ajustarData(user.dtanasc) : new Date(2010, 9, 10));
  const [membro, setMembro] = useState(user?.membrodesde ? ajustarData(user.membrodesde) : new Date(2015, 7));
  const [batismo, setBatismo] = useState(user?.dtabatismo ? ajustarData(user.dtabatismo) : new Date(2019, 9, 19));

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
            <label className="text-sm text-[#5e5e5e] dark:text-[#a5a5a5] mb-1">
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
        <label className="text-[14px] text-[#5e5e5e] dark:text-[#a5a5a5] mb-1">
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
          className="h-[48px] w-full bg-input dark:bg-input-dark text-preto dark:text-branco rounded-xl px-[15px] outline-none shadow-md"
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
        <p className="font-normal text-vermelho dark:text-vermelho-dark">Endereço</p>
        <div className="bg-vermelho dark:bg-vermelho-dark w-full h-[1px]"></div>
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
        <p className="font-normal text-vermelho dark:text-vermelho-dark">Igreja</p>
        <div className="bg-vermelho dark:bg-vermelho-dark w-full h-[1px]"></div>
      </div>

      <div className="w-[95%] mb-[7%] flex flex-col">
        <label className="text-[14px] text-[#5e5e5e] dark:text-[#a5a5a5] mb-1 ml-[4.5%]">
          Membro Desde
        </label>

        <DatePicker
          locale="pt-BR"
          maxDate={new Date()}
          selected={membro}
          onChange={(date) => setMembro(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="h-[48px] w-full bg-input dark:bg-input-dark text-preto dark:text-branco rounded-xl px-[15px] outline-none shadow-md"
          placeholderText="Selecione mês e ano"
        />
      </div>

      <div className="w-[95%] mb-[7%] flex flex-col">
        <label className="text-[14px] text-[#5e5e5e] dark:text-[#a5a5a5] mb-1 ml-[4.5%]">
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
          className="h-[48px] w-full bg-input dark:bg-input-dark text-preto dark:text-branco rounded-xl px-[15px] outline-none shadow-md"
          placeholderText="Selecione a data"
        />
      </div>

      <Input texto="Email" value={email} onChange={setEmail} type="email" />

      <div className="flex justify-between w-[95%] mt-6">
        <button
          onClick={() => navigate("/usuarios")}
          className="bg-vermelho dark:bg-vermelho-dark text-branco px-10 py-2 rounded-full"
        >
          Voltar
        </button>

        <button
          onClick={handleSave}
          className="bg-vermelho dark:bg-vermelho-dark text-branco px-10 py-2 rounded-full"
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

function ajustarData(dataOriginal) {
  if (!dataOriginal) return null;
  if (dataOriginal instanceof Date) return dataOriginal;
  
  const partes = dataOriginal.split('T')[0].split('-');
  return new Date(partes[0], partes[1] - 1, partes[2] || 1);
}