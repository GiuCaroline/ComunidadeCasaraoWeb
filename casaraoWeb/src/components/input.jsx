import { useState } from "react";

export function Input({
  texto,
  seguranca = false,
  value = "",
  onChange,
  type = "text",
  containerClass = "",
  multiline = false,
  rows = 4,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const isActive = isFocused || value.length > 0;

  const baseInputClasses = `
    w-full h-full
    px-4 py-3
    text-[16px]
    bg-input dark:bg-input-dark
    rounded-xl
    outline-none
    text-preto dark:text-branco
    shadow-md
    font-normal
    ${multiline ? "resize-none" : ""}
  `;

  return (
    <div
      className={`relative w-[95%] mb-[7%] ${multiline ? "" : "h-[50px]"} ${containerClass}`}
    >
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={rows}
          className={baseInputClasses}
        />
      ) : (
        <input
          type={seguranca ? "password" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={baseInputClasses}
        />
      )}

      <label
        className={`
          absolute left-4 transition-all duration-200
          ${isActive ? "-top-4 text-sm" : "top-3 text-base"}
          text-[#5e5e5e]
          dark:text-[#a5a5a5]
          pointer-events-none
        `}
      >
        {texto}
      </label>
    </div>
  );
}