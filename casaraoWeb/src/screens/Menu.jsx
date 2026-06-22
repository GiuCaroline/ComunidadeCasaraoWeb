import { useNavigate } from "react-router-dom"
import { UsersIcon, CalendarBlankIcon, ImagesSquareIcon, CalendarPlusIcon, GraduationCapIcon } from "@phosphor-icons/react"

export default function Menu() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center">
        <div className="mt-[5%] w-full items-center flex flex-col gap-4">
            <div
            onClick={() => navigate("/usuarios")}
            className="bg-input dark:bg-input-dark py-5 flex justify-between px-5 w-[95%] rounded-[20px]">
                <span className="text-preto dark:text-branco text-xl">
                    Gerenciar Usuários
                </span>
                <UsersIcon size={30} className="text-vermelho" />
            </div>
            
            <div
            onClick={() => navigate("/eventos")}
            className="bg-input dark:bg-input-dark py-5 flex justify-between px-5 w-[95%] rounded-[20px]">
                <span className="text-preto dark:text-branco text-xl">
                    Gerenciar Eventos
                </span>
                <CalendarBlankIcon size={30} className="text-vermelho" />
            </div>
            
            <div
            onClick={() => navigate("/galeria")}
            className="bg-input dark:bg-input-dark py-5 flex justify-between px-5 w-[95%] rounded-[20px]">
                <span className="text-preto dark:text-branco text-xl">
                    Gerenciar Galeria de Eventos
                </span>
                <ImagesSquareIcon size={30} className="text-vermelho" />
            </div>
            
            <div
            onClick={() => navigate("/escalas")}
            className="bg-input dark:bg-input-dark py-5 flex justify-between px-5 w-[95%] rounded-[20px]">
                <span className="text-preto dark:text-branco text-xl">
                    Gerenciar Escalas
                </span>
                <CalendarPlusIcon size={30} className="text-vermelho" />
            </div>
            
            <div
            onClick={() => navigate("/cursos")}
            className="bg-input dark:bg-input-dark py-5 flex justify-between px-5 w-[95%] rounded-[20px]">
                <span className="text-preto dark:text-branco text-xl">
                    Gerenciar Cursos
                </span>
                <GraduationCapIcon size={30} className="text-vermelho" />
            </div>
        </div>
        
    </div>
  )
}
