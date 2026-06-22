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

  const isActive = expanded || selectedLabel.length > 0;

  useEffect(() => {
    if (value) {
      const found = data.find((item) => item.value === value);
      if (found) {
        setSelectedLabel(found.label);
      }
    }
  }, [value, data]);

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
      className="relative w-[95%] h-[50px] mb-[9%]"
      ref={dropdownRef}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="
          h-full
          w-full
          bg-input dark:bg-input-dark
          rounded-xl
          text-preto dark:text-branco
          px-4
          flex justify-between items-center
          shadow-md
        "
      >
        <span className="text-[16px]">
          {selectedLabel}
        </span>

        {expanded ? (
          <CaretUp size={22} className="text-[#5e5e5e] dark:text-[#a5a5a5]" />
        ) : (
          <CaretDown size={22} className="text-[#5e5e5e] dark:text-[#a5a5a5]" />
        )}
      </button>

      <label
        className={`
          absolute left-4 transition-all duration-200
          ${isActive ? "-top-4 text-sm" : "top-3 text-base"}
          text-[#5e5e5e]
          dark:text-[#a5a5a5]
          pointer-events-none
        `}
      >
        {placeholder}
      </label>

      {expanded && (
        <div
          className="
            absolute
            top-[55px]
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
                text-[#5e5e5e] dark:text-[#a5a5a5]
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