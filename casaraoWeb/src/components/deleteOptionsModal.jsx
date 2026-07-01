export function DeleteOptionsModal({
  visible,
  onDeleteOne,
  onDeleteAll,
  onCancel,
  title = "Deseja excluir:",
  textOne = "Apenas este dia",
  textAll = "Todos os eventos",
  hideOne = false
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[95]">
      <div className="bg-branco dark:bg-preto-dark rounded-2xl p-6 w-[90%] max-w-sm shadow-lg">

        <h2 className="text-lg text-center mb-6 text-preto dark:text-branco">
          {title}
        </h2>

        <div className="flex flex-col gap-3">

          {!hideOne && (
            <button
              onClick={onDeleteOne}
              className="bg-[#01CB34] text-branco py-2 rounded-xl"
            >
              {textOne}
            </button>
          )}

          <button
            onClick={onDeleteAll}
            className="bg-vermelho text-branco py-2 rounded-xl"
          >
            {textAll}
          </button>

          <button
            onClick={onCancel}
            className="text-sm text-vermelho border border-vermelho py-2 rounded-xl mt-2"
          >
            Cancelar
          </button>

        </div>

      </div>
    </div>
  );
}