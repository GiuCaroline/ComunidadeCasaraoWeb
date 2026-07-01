import { useState } from "react";
import { CaretUp, CaretDown, WhatsappLogo, EnvelopeSimple } from "@phosphor-icons/react";

export function DropdownContent({titulo, dias, horario, descricao, celular, email}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[95%] max-w-md flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-input dark:bg-input-dark rounded-xl shadow-md px-5 py-4 flex justify-between items-center text-left transition-colors"
      >
        <div className="flex flex-col">
          <span className="text-[16px] font-medium text-preto dark:text-branco">
            {titulo}
          </span>
          <span className="text-[14px] font-light text-preto dark:text-branco">
            {dias} - {formataHora(horario)}
          </span>
        </div>
        {isOpen ? (
          <CaretUp size={24} className="text-preto dark:text-branco" />
        ) : (
          <CaretDown size={24} className="text-preto dark:text-branco" />
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
              <p className="text-[14px] font-light text-preto dark:text-branco leading-relaxed">
                {descricao}
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
                    {celular}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <EnvelopeSimple size={26} className="text-vermelho dark:text-vermelho-dark" />
                  <span className="text-[15px] font-normal text-preto dark:text-branco">
                    {email}
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

function formataHora(tempo) {
  if (!tempo) return "";

  const partes = tempo.split(":");
  if (partes.length >= 2) {
    const hora = partes[0];
    const minuto = partes[1];

    if (minuto === "00") {
      return `${hora}h`;
    }
    
    return `${hora}h${minuto}`;
  }

  return tempo;
}