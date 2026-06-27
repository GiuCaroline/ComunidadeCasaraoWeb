import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "../components/input";
import { MascFem } from "../components/genero";
import { Dropdown } from "../components/dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import { PlusCircle, MinusCircle } from "@phosphor-icons/react";
import { getCargos, getEstados, getGraus, getDeparts, updateUser } from "../services/authService";

registerLocale("pt-BR", ptBR);

export default function EditUsers() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cargos, setCargos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [graus, setGraus] = useState([]);
  const [departamentos, setDeparts] = useState([]);
  const user = location.state?.user;

  if (!user) {
    navigate("/usuarios");
  }

  useEffect(() => {
    async function carregarCargos() {
      try {
        const data = await getCargos();
        let arrayDeCargos = [];

        if (Array.isArray(data)) {
          arrayDeCargos = data;
        } else if (data && Array.isArray(data.cargos)) {
          arrayDeCargos = data.cargos;
        } else if (data && Array.isArray(data.data)) {
          arrayDeCargos = data.data;
        } else if (data && typeof data === 'object') {
          const extrairArray = Object.values(data).find(Array.isArray);
          arrayDeCargos = extrairArray || [];
        }

        const cargosFormatados = arrayDeCargos.map((item) => ({
          value: String(item.id),
          label: item.cargo || "Sem Nome"
        }));

        setCargos(cargosFormatados);
      } catch (error) {
        console.log(error);
        setCargos([]);
      }
    }
    carregarCargos();
  }, []);

  useEffect(() => {
    async function carregarEstados() {
      try {
        const data = await getEstados();
        let arrayDeEstados = [];

        if (Array.isArray(data)) {
          arrayDeEstados = data;
        } else if (data && Array.isArray(data.estados)) {
          arrayDeEstados = data.estados;
        } else if (data && Array.isArray(data.data)) {
          arrayDeEstados = data.data;
        } else if (data && typeof data === 'object') {
          const extrairArray = Object.values(data).find(Array.isArray);
          arrayDeEstados = extrairArray || [];
        }

        const estadosFormatados = arrayDeEstados.map((item) => ({
          value: String(item.id),
          label: item.estado || "Sem Nome"
        }));

        setEstados(estadosFormatados);
      } catch (error) {
        console.log(error);
        setEstados([]);
      }
    }
    carregarEstados();
  }, []);

  useEffect(() => {
    async function carregarGraus() {
      try {
        const data = await getGraus();
        let arrayDeGraus = [];

        if (Array.isArray(data)) {
          arrayDeGraus = data;
        } else if (data && Array.isArray(data.graus)) {
          arrayDeGraus = data.graus;
        } else if (data && Array.isArray(data.data)) {
          arrayDeGraus = data.data;
        } else if (data && typeof data === 'object') {
          const extrairArray = Object.values(data).find(Array.isArray);
          arrayDeGraus = extrairArray || [];
        }

        const grausFormatados = arrayDeGraus.map((item) => ({
          value: String(item.id),
          label: item.instrucao || "Sem Nome"
        }));

        setGraus(grausFormatados);
      } catch (error) {
        console.log(error);
        setGraus([]);
      }
    }
    carregarGraus();
  }, []);

  const situacaos = [
    { value: "Ativo", label: "Ativo" },
    { value: "Em Tranferência", label: "Em Tranferência" },
    { value: "Inativo", label: "Inativo" },
  ];

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

  const cargosIniciais = [user?.cargo, user?.cargo2, user?.cargo3, user?.cargo4]
    .map((c) => (c ? String(c) : ""))
    .filter((c) => c !== "");

  if (cargosIniciais.length === 0) cargosIniciais.push("");

  const [nome, setNome] = useState(user?.nome || "");
  const [cargosAtivos, setCargosAtivos] = useState(cargosIniciais);
  const [estadoCivil, setEstadoCivil] = useState(user?.estadocivil ? String(user.estadocivil) : "");
  const [conjuge, setConjuge] = useState(user?.conjuge || "");
  const [grau, setGrau] = useState(user?.grauinst ? String(user.grauinst) : "");
  const [situacao, setSituacao] = useState(user?.situacao ? String(user.situacao) : "");
  const [email, setEmail] = useState(user?.email || "");
  const [sexo, setSexo] = useState(user?.sexo || "M");
  const [telefone, setTelefone] = useState(user?.celular || "");
  const [mae, setMae] = useState(user?.mae || "");
  const [pai, setPai] = useState(user?.pai || "");
  const [endereco, setEndereco] = useState(user?.endereco || "");
  const [departamento, setDepartamento] = useState(user?.departamento ? String(user.departamento) : "");
  const [corEscala, setCorEscala] = "";
  const [cep, setCep] = useState(user?.cep || "");
  const [uf, setUf] = useState(user?.uf || "");
  const [bairro, setBairro] = useState(user?.bairro || "");
  const [complemento, setComplemento] = useState(user?.complemento || "");
  const [nascimento, setNascimento] = useState(user?.dtanasc ? ajustarData(user.dtanasc) : new Date(2010, 9, 10));
  const [membro, setMembro] = useState(user?.membrodesde ? ajustarData(user.membrodesde) : new Date(2015, 7));
  const [batismo, setBatismo] = useState(user?.dtabatismo ? ajustarData(user.dtabatismo) : new Date(2019, 9, 19));

  function handleCargoChange(index, value) {
    const novos = [...cargosAtivos];
    novos[index] = value;
    setCargosAtivos(novos);
  }

  function addCargo() {
    if (cargosAtivos.length < 4) {
      setCargosAtivos([...cargosAtivos, ""]);
    }
  }

  function removeCargo() {
    if (cargosAtivos.length > 1) {
      const novos = [...cargosAtivos];
      novos.pop();
      setCargosAtivos(novos);
    }
  }

  async function handleSave() {
    try {
      const payload = {
        nome: nome || null,
        nascimento: nascimento ? formatarDataBackend(nascimento) : null,
        sexo: sexo || null,
        
        estadoCivil: estadoCivil || null, 
        conjuge: conjuge || null,
        escolaridade: grau || null, 
        situacao: situacao || null,
        
        mae: mae || null,
        pai: pai || null,
        telefone: telefone || null,
        cep: cep || null,
        uf: uf || null,
        endereco: endereco || null,
        bairro: bairro || null,
        complemento: complemento || null,
        
        cargo: cargosAtivos[0] || null,
        cargo2: cargosAtivos[1] || null,
        cargo3: cargosAtivos[2] || null,
        cargo4: cargosAtivos[3] || null,
        
        membro: membro ? formatarDataBackend(membro) : null,
        batismo: batismo ? formatarDataBackend(batismo) : null,
        email: email || null,
      };

      await updateUser(user.id, payload);
      
      navigate("/usuarios");
    } catch (error) {
      console.log("Erro ao atualizar o usuário:", error);
    }
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

      {cargosAtivos.map((cargoValue, index) => (
        <div key={index} className="flex items-start w-full justify-between">
          <div className="flex-1 w-full justify-center items-center flex">
            <Dropdown
              data={cargos}
              value={cargoValue}
              placeholder={index === 0 ? "Cargo" : `Cargo ${index + 1}`}
              onChange={(item) => handleCargoChange(index, item.value)}
            />
          </div>

          {index === cargosAtivos.length - 1 && (
            <div className="flex items-center gap-2 h-[50px]">
              {cargosAtivos.length > 1 && (
                <button onClick={removeCargo} className="text-vermelho">
                  <MinusCircle size={32} weight="fill" />
                </button>
              )}
              {cargosAtivos.length < 4 && (
                <button onClick={addCargo} className="text-vermelho-dark">
                  <PlusCircle size={32} weight="fill" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {cargosAtivos.includes("5") && (
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
        data={estados}
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
        data={graus}
        value={grau}
        placeholder="Grau de Instrução"
        onChange={(item) => setGrau(item.value)}
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
      <Input texto="Número e Complemento" value={complemento} onChange={setComplemento} />
        
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

function ajustarData(dataOriginal) {
  if (!dataOriginal) return null;
  if (dataOriginal instanceof Date) return dataOriginal;
  
  const partes = dataOriginal.split('T')[0].split('-');
  return new Date(partes[0], partes[1] - 1, partes[2] || 1);
}

function formatarDataBackend(date) {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}