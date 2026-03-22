export function DeleteOptionsModal({
  visible,
  onDeleteOne,
  onDeleteAll,
  onCancel
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[95]">
      <div className="bg-input dark:bg-input-dark rounded-2xl p-6 w-[90%] max-w-sm shadow-lg">

        <h2 className="text-lg text-center mb-6 text-preto dark:text-branco">
          Deseja excluir:
        </h2>

        <div className="flex flex-col gap-3">

          <button
            onClick={onDeleteOne}
            className="bg-[#01CB34] text-white py-2 rounded-xl"
          >
            Apenas este dia
          </button>

          <button
            onClick={onDeleteAll}
            className="bg-vermelho text-white py-2 rounded-xl"
          >
            Todos os eventos
          </button>

          <button
            onClick={onCancel}
            className="text-sm text-cinza mt-2"
          >
            Cancelar
          </button>

        </div>

      </div>
    </div>
  );
}