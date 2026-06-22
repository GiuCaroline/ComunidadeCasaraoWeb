import { useNavigate } from "react-router-dom"
import logoPreta from "/images/logoPreto.png";
import logoBranca from "/images/logoBranco.png";

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center">
      <img
        src={logoPreta}
        alt="Logo"
        className="block dark:hidden w-auto h-[10vh] md:h-[80vh] object-cover selection:bg-branco mt-[15%]"
      />

      <img
        src={logoBranca}
        alt="Logo"
        className="hidden dark:block w-auto h-[10vh] md:h-[80vh] object-cover selection:bg-branco mt-[15%]"
      />
      <div className="mt-[25%]">
        <img 
          src="/images/banner.png"
          className="w-auto h-[40vh] md:h-[80vh] object-cover selection:bg-branco ml-[5%]"
        />
      </div>

      <button className="bg-vermelho text-branco font-light px-10 mt-[15%] py-2 text-xl rounded-full" 
      onClick={() => navigate("/login")}>Login</button>
    </div>
  )
}
