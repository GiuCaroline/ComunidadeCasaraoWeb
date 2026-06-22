import { useState } from "react";
import { Input } from "../components/input";
import { useNavigate } from "react-router-dom"
import logoPreta from "/images/logoPreto.png";
import logoBranca from "/images/logoBranco.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    console.log(email, senha);
  }

  return (
    <div className="flex flex-col items-center">
      <img
        src={logoPreta}
        alt="Logo"
        className="block dark:hidden w-auto h-[10vh] md:h-[80vh] object-cover selection:bg-branco mt-[20%]"
      />

      <img
        src={logoBranca}
        alt="Logo"
        className="hidden dark:block w-auto h-[10vh] md:h-[80vh] object-cover selection:bg-branco mt-[20%]"
      />

      <form
        onSubmit={handleLogin}
        className="bg-transparent p-8 w-[400px] flex flex-col items-center mt-[5%]"
      >
        <h1 className="text-2xl font-bold mb-[25%] text-vermelho">Login</h1>

        <Input
          texto="Email"
          value={email}
          onChange={setEmail}
          type="email"
        />

        <Input
          texto="Senha"
          value={senha}
          onChange={setSenha}
          seguranca={true}
        />

        <div className="items-start flex">
          <a><p className="text-placeInput text-sm">Esqueci minha senha</p></a>
        </div>

        <button
          type="submit"
          onClick={() => navigate("/menu")}
          className="mt-6 bg-primary text-branco bg-vermelho py-3 px-20 rounded-full hover:opacity-90 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
