import { useState, useMemo, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import MonthHeaderWeb from "./monthHeaderWeb";
import CustomCalendarWeb from "./customCalendarWeb";

export default function EventCalendarModal({
  visible = false,
  onClose = () => {},
  eventoGrupo = null,
  onSelectDay = () => {}
}) {

  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  useEffect(() => {
    if (visible) {
      const now = new Date();
      setMonth(now.getMonth());
      setYear(now.getFullYear());
    }
  }, [visible]);

  const diaSemanaNumero = Number(eventoGrupo?.diaSemana ?? -1);

  const eventosDoMes = useMemo(() => {
        
    if (diaSemanaNumero < 0) return {};

    const dias = {};
    const totalDias = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= totalDias; i++) {

      const data = new Date(year, month, i);

      if (data.getDay() === diaSemanaNumero) {

        const key = `${year}-${String(month + 1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;
        
        if (eventoGrupo.excludedDates?.includes(key)) {
            continue;
        }

        dias[key] = true;
      }
    }
   

    return dias;

  }, [month, year, diaSemanaNumero]);

  if (!visible || !eventoGrupo) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-branco dark:bg-preto-dark w-[95%] max-w-md rounded-2xl p-5 shadow-lg">

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-normal text-lg text-preto dark:text-branco">
            {eventoGrupo.nome}
          </h2>

          <button onClick={onClose}>
            <X size={24} className="text-preto dark:text-branco"/>
          </button>
        </div>

        <MonthHeaderWeb
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
        />

        <CustomCalendarWeb
          month={month}
          year={year}
          markedDays={eventosDoMes}
          onSelectDay={onSelectDay}
        />

      </div>
    </div>
  );
}