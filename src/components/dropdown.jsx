import { useState, useEffect, useRef } from "react";
import { CaretUp, CaretDown } from "@phosphor-icons/react";

export function Dropdown({
  data = [],
  value = null,
  onChange,
  placeholder = "Selecione",
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const dropdownRef = useRef(null);

  // Se vier valor inicial (edição)
  useEffect(() => {
    if (value) {
      const found = data.find((item) => item.value === value);
      if (found) {
        setSelectedLabel(found.label);
      }
    }
  }, [value, data]);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSelect = (item) => {
    setSelectedLabel(item.label);
    onChange && onChange(item);
    setExpanded(false);
  };

  return (
    <div
      className="relative w-[95%] mb-[9%]"
      ref={dropdownRef}
    >
      {/* Botão */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="
          h-[48px]
          w-full
          bg-input dark:bg-input-dark
          rounded-xl
          text-preto dark:text-branco
          px-4
          flex justify-between items-center
          shadow-md
        "
      >
        <span className="text-placeInput dark:text-[#a5a5a5] text-[16px]">
          {selectedLabel || placeholder}
        </span>

        {expanded ? <CaretUp size={22} className="text-placeInput dark:text-[#a5a5a5]"/> : <CaretDown size={22} className="text-placeInput dark:text-[#a5a5a5]"/>}
      </button>

      {/* Lista */}
      {expanded && (
        <div
          className="
            absolute
            top-[52px]
            w-full
            bg-input dark:bg-input-dark
            max-h-[300px]
            rounded-xl
            p-2
            shadow-md
            overflow-y-auto
            z-[999]
          "
        >
          {data.map((item) => (
            <button
              key={item.value}
              onClick={() => onSelect(item)}
              className="
                w-full
                h-[45px]
                text-left
                px-2
                text-placeInput dark:text-[#a5a5a5]
                text-[16px]
                hover:bg-black/5
                rounded-lg
              "
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
