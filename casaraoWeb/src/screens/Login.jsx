import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/input";
import logoPreta from "/images/logoPreto.png";
import logoBranca from "/images/logoBranco.png";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !senha) return;

    try {
      const data = await loginUser(email, senha);

      login(data.user);

      navigate("/menu");
    } catch (error) {
      console.error(error);
    }
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
        <h1 className="text-2xl font-semibold mb-[15%] text-vermelho dark:text-vermelho-dark">Login</h1>

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

        <div className="items-start w-full ml-[6%] flex">
          <a><p className="text-placeInput text-sm">Esqueci minha senha</p></a>
        </div>

        <button
          type="submit"
          className="mt-[15%] bg-primary text-branco bg-vermelho py-3 px-20 rounded-full hover:opacity-90 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}