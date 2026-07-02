import api from "./api";

export async function getUsers(data) {
  try {
    const response = await api.get("/auth/users", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro no servidor" };
  }
}

export async function updateUser(id, data) {
  try {
    const response = await api.put(`/auth/updateUser/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro no servidor" };
  }
}

export async function deleteUser(id) {
  try {
    const response = await api.delete(`/auth/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao deletar usuário" };
  }
}

export async function loginUser(email, password) {
  try {
    const response = await api.post("/auth/login", {
      email: email.toLowerCase().trim(),
      password,
    });

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

export async function getEstados(data) {
  try {
    const response = await api.get("/auth/estadocivil", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro no servidor" };
  }
}

export async function getGraus(data) {
  try {
    const response = await api.get("/auth/grauInst", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro no servidor" };
  }
}

export async function getDeparts(data) {
  try {
    const response = await api.get("/auth/departamento", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro no servidor" };
  }
}

export async function getEventos() {
  try {
    const response = await api.get("/auth/eventos");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro no servidor" };
  }
}

export async function editEvento(payload) {
  try {
    const response = await api.put("/auth/eventos/editar", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao editar evento no servidor" };
  }
}

export async function deleteEvento(payload) {
  try {
    const response = await api.delete("/auth/eventos/deletar", { data: payload });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao deletar evento no servidor" };
  }
}

export async function addEvento(payload) {
  try {
    const response = await api.post("/auth/eventos/adicionar", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao criar evento no servidor" };
  }
}

export async function getEscalas(data) {
  try {
    const response = await api.get("/auth/escalas", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro no servidor" };
  }
}

export async function addEscala(payload) {
  try {
    const response = await api.post("/auth/escalas/adicionar", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao criar escala no servidor" };
  }
}

export async function editEscala(id, payload) {
  try {
    const response = await api.put(`/auth/escalas/editar/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao editar escala no servidor" };
  }
}

export async function getCursos(data) {
  try {
    const response = await api.get("/auth/cursos", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro no servidor" };
  }
}

export async function deleteCursos(id) {
  try {
    const response = await api.delete(`/auth/cursos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao deletar curso" };
  }
}

export async function addCursos(payload) {
  try {
    const response = await api.post("/auth/cursos/adicionar", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao adicionar curso no servidor" };
  }
}

export async function editCursos(id, payload) {
  try {
    const response = await api.put(`/auth/cursos/editar/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao editar curso no servidor" };
  }
}

export async function getGaleriaEventos() {
  try {
    const response = await api.get("/auth/galeria/eventos");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao buscar eventos da galeria" };
  }
}

export async function getGaleriaEvento(agendaevento_id) {
  try {
    const response = await api.get(`/auth/galeria/evento/${agendaevento_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao buscar mídias do evento" };
  }
}

export async function getCarrossel() {
  try {
    const response = await api.get("/auth/galeria/carrossel");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao buscar fotos do carrossel" };
  }
}

export async function addMidia(payload) {
  try {
    const response = await api.post("/auth/galeria/adicionar", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao adicionar mídia" };
  }
}

export async function updateDestaqueCarrossel(id, payload) {
  try {
    const response = await api.put(`/auth/galeria/destaque/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao atualizar destaque" };
  }
}

export async function deleteMidia(id) {
  try {
    const response = await api.delete(`/auth/galeria/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Erro ao deletar mídia" };
  }
}