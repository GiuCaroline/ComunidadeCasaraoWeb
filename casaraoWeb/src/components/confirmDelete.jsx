export function ConfirmDelete({ visible, onConfirm, onCancel, mensage }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[90]">
      <div className="bg-input dark:bg-input-dark rounded-2xl p-6 w-[90%] max-w-sm shadow-lg">
        <h2 className="text-lg font-normal text-center mb-6 text-preto dark:text-branco">
          Deseja realmente apagar este {mensage}?
        </h2>

        <div className="flex justify-between gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#01CB34] text-white font-light py-2 rounded-xl"
          >
            Sim
          </button>

          <button
            onClick={onCancel}
            className="flex-1 bg-vermelho text-white font-light py-2 rounded-xl"
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
}
