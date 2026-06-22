import { useState } from "react";
import { CaretUp, CaretDown, WhatsappLogo, EnvelopeSimple } from "@phosphor-icons/react";

export function DropdownContent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[95%] max-w-md flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#f4f4f4] dark:bg-input-dark rounded-xl shadow-md px-5 py-4 flex justify-between items-center text-left transition-colors"
      >
        <div className="flex flex-col">
          <span className="text-[16px] font-medium text-preto dark:text-branco">
            Curso de Casais
          </span>
          <span className="text-[14px] font-light text-[#5e5e5e] dark:text-[#a5a5a5]">
            As terças e quintas - 20h
          </span>
        </div>
        {isOpen ? (
          <CaretUp size={24} className="text-[#5e5e5e] dark:text-[#a5a5a5]" />
        ) : (
          <CaretDown size={24} className="text-[#5e5e5e] dark:text-[#a5a5a5]" />
        )}
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden shadow-md">
          <div className="w-full bg-input dark:bg-input-dark rounded-xl shadow-md p-5 flex flex-col gap-5 mt-2">
            <div>
              <h3 className="text-[16px] font-medium text-preto dark:text-branco mb-2">
                Descrição
              </h3>
              <p className="text-[14px] font-light text-preto dark:text-[#a5a5a5] leading-relaxed">
                Este curso aborda temas importantes denro de um casamento. Sobre
                ter filhos e mesmo assim continuar sendo um belo casal.
              </p>
            </div>

            <div>
              <h3 className="text-[16px] font-medium text-preto dark:text-branco mb-4">
                Responsáveis
              </h3>
              <div className="flex flex-col gap-4">
                
                <div className="flex items-center gap-3">
                  <WhatsappLogo size={26} className="text-vermelho dark:text-vermelho-dark" />
                  <span className="text-[15px] font-normal text-preto dark:text-branco">
                    (11) 940028922
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <EnvelopeSimple size={26} className="text-vermelho dark:text-vermelho-dark" />
                  <span className="text-[15px] font-normal text-preto dark:text-branco">
                    teste@gmail.com
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}