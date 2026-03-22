import { useState, useEffect } from "react";
import { MagnifyingGlass, TrashIcon, PencilSimple } from "@phosphor-icons/react";
import { ConfirmDelete } from "../components/confirmDelete";
import { AlertCustom } from "../components/alert";
import { useNavigate } from "react-router-dom";


export default function Usuarios() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fakeUsers = [
      { id: 1, nome: "Culto", email: "teste@teste.com" },
      { id: 2, nome: "Jovens", email: "maria@email.com" },
      { id: 3, nome: "Oração", email: "joao@email.com" },
      
    ];

    setUsers(fakeUsers);
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const result = users.filter(
      (user) =>
        user.nome.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredUsers(result);
  }, [search, users]);

  function handleDeleteClick(id) {
    setSelectedUserId(id);
    setConfirmVisible(true);
  }

  function handleConfirmDelete() {
    setConfirmVisible(false);

    try {
      const updated = users.filter((user) => user.id !== selectedUserId);
      setUsers(updated);

      setAlertType("success");
      setAlertTitle("Usuário removido");
      setAlertMessage("O usuário foi apagado com sucesso.");
    } catch (error) {
      setAlertType("error");
      setAlertTitle("Erro");
      setAlertMessage("Não foi possível apagar o usuário.");
    }

    setAlertVisible(true);
  }

  function handleCancelDelete() {
    setConfirmVisible(false);

    setAlertType("warning");
    setAlertTitle("Operação cancelada");
    setAlertMessage("O usuário não foi removido.");

    setAlertVisible(true);
  }

  const navigate = useNavigate();

  function handleEdit(user) {
    navigate("/editar", { state: { user } });
  }


  return (
    <div className="pt-5 px-4 flex flex-col items-center gap-6">

      <div className="relative w-[95%]">
        <input
          type="text"
          placeholder="Pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full py-3 px-4 pr-12
            rounded-full
            bg-input
            dark:bg-input-dark
            shadow-md
            outline-none
          "
        />

        <MagnifyingGlass
          size={22}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-preto dark:text-branco"
        />
      </div>

      {/* 📋 Lista */}
      {filteredUsers.map((user) => (
        <div
          key={user.id}
          className="
            w-[95%]
            bg-input
            dark:bg-input-dark
            rounded-2xl
            shadow-md
            px-4
            py-2
            flex justify-between items-center
          "
        >
          <div>
            <p className="font-normal text-preto dark:text-branco">{user.nome}</p>
            <p className="text-sm font-light text-preto dark:text-branco">{user.email}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleDeleteClick(user.id)}>
              <TrashIcon size={30} className="text-vermelho" />
            </button>

            <button onClick={() => handleEdit(user)}>
              <PencilSimple size={30} className="text-[#01CB34]" />
            </button>
          </div>
        </div>
      ))}

      {/* Modais */}
      <ConfirmDelete
        visible={confirmVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        mnensage={"usuário"}
      />

      <AlertCustom
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
      />

    </div>
  );
}
