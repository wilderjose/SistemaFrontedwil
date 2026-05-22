import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (token && usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        console.log("Usuario cargado del localStorage:", usuarioData);
        setUsuario(usuarioData);
      } catch (error) {
        console.error("Error parsing usuario:", error);
        localStorage.removeItem("usuario");
      }
    }

    setCargando(false);
  }, []);

  const login = async (username, password) => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  setUsuario(null);

  const response = await api.post("login/", {
    username,
    password,
  });

  const data = response.data;

  const usuarioData = {
    token: data.token,
    user_id: data.user_id,
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    rol: data.rol,
  };

  localStorage.setItem("token", data.token);
  localStorage.setItem("usuario", JSON.stringify(usuarioData));

  setUsuario(usuarioData);

  return usuarioData;
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        cargando,
        autenticado: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);