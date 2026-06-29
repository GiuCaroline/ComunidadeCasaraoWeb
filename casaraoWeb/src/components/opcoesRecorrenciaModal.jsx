export function OpcoesRecorrenciaModal({ visible, onClose, onSelectModo, acao }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[90]">
      <div className="bg-branco dark:bg-preto-dark rounded-2xl p-6 w-[90%] max-w-sm shadow-lg">
        <h2 className="text-lg font-normal text-center mb-6 text-preto dark:text-branco">
          Deseja {acao === "edit" ? "editar" : "apagar"} apenas alguns dias ou toda a série de eventos?
        </h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSelectModo("alguns")}
            className="w-full bg-vermelho-dark text-white font-light py-3 rounded-xl"
          >
            Selecionar Alguns Dias
          </button>

          <button
            onClick={() => onSelectModo("todos")}
            className="w-full bg-vermelho text-white font-light py-3 rounded-xl"
          >
            Todos os Eventos da Série
          </button>

          <button
            onClick={onClose}
            className="w-full bg-transparent border border-vermelho text-white font-light py-3 rounded-xl"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}