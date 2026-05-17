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
    const response = await api.post("login/", {
      username,
      password,
    });

    const data = response.data;
    console.log("LOGIN DATA:", data);

    // La estructura correcta: data.token y data.usuario
    const usuarioData = data.usuario || data; // Por si el backend devuelve diferente
    
    console.log("Usuario a guardar:", usuarioData);
    console.log("Rol del usuario:", usuarioData.rol);

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));

    setUsuario(usuarioData);

    return data;
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