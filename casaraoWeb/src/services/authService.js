import api from "./api";

export async function getUsers(data) {
  try {
    const response = await api.get("/auth/users", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro no servidor" };
  }
}

export async function getCargos(data) {
  try {
    const response = await api.get("/auth/cargos", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro no servidor" };
  }
}