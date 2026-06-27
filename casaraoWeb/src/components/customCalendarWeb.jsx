const weekDays = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function generateCalendar(month, year) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  return days;
}

export default function CustomCalendarWeb({
  month,
  year,
  markedDays,
  onSelectDay
}) {

  const days = generateCalendar(month, year);

  return (
    <div>

      <div className="grid grid-cols-7 text-center gap-4 text-base mb-4 text-preto dark:text-branco">
        {weekDays.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">

        {days.map((day, index) => {

          if (!day) return <div key={index} />;

          const key = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

          const isMarked = markedDays[key];

          return (
            <button
              key={index}
              onClick={() => onSelectDay(key)}
              className={`
                relative
                h-10 text-xs font-light
                flex items-center justify-center
                text-preto dark:text-branco
                rounded-lg
                hover:bg-vermelho-opaci dark:hover:bg-gray-700
              `}
            >
              {day}
              {isMarked && (
                <span className="absolute bottom-1 w-6 h-[2px] bg-vermelho rounded-full"></span>
              )}
            </button>
          );
        })}

      </div>

    </div>
  );
}