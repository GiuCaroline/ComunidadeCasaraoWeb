import { useState, useEffect } from "react";
import { GenderMale, GenderFemale } from "@phosphor-icons/react";

export function MascFem({ value = null, onChange }) {
  const [selected, setSelected] = useState(value);

  // Se vier valor da tela de edição, atualizar
  useEffect(() => {
    setSelected(value);
  }, [value]);

  const selectMale = () => {
    setSelected("M");
    onChange && onChange("M");
  };

  const selectFemale = () => {
    setSelected("F");
    onChange && onChange("F");
  };

  return (
    <div className="w-[95%] mb-[10%]">
      <p className="text-[16px] text-placeInput mb-4">
        Sexo
      </p>

      <div className="flex gap-9">
        {/* Masculino */}
        <button
          onClick={selectMale}
          className="flex items-center gap-2"
        >
          <div
            className={`
              w-[64px] h-[64px] rounded-full
              flex items-center justify-center
              shadow-md
              ${selected === "M" ? "bg-[#BCCFFF]" : "bg-input dark:bg-input-dark"}
            `}
          >
            <GenderMale
              size={30}
              className={
                selected === "M"
                  ? "text-[#2E9AFF]"
                  : "text-[#5e5e5e]"
              }
            />
          </div>

          <span className="text-preto dark:text-branco text-[16px]">
            Masculino
          </span>
        </button>

        {/* Feminino */}
        <button
          onClick={selectFemale}
          className="flex items-center gap-2"
        >
          <div
            className={`
              w-[64px] h-[64px] rounded-full
              flex items-center justify-center
              shadow-md
              ${selected === "F" ? "bg-[#FFBDF1]" : "bg-input dark:bg-input-dark"}
            `}
          >
            <GenderFemale
              size={30}
              className={
                selected === "F"
                  ? "text-[#C700A2]"
                  : "text-[#5e5e5e]"
              }
            />
          </div>

          <span className="text-preto dark:text-branco text-[16px]">
            Feminino
          </span>
        </button>
      </div>
    </div>
  );
}
