import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

// Componentes
import FormularioPrediccion from "./components/FormularioPrediccion";
import Inicio from "./components/Inicio";
import Login from "./components/Usuario/Login";
import HomePage from "./components/HomePage";
import ShowCliente from "./components/Cliente/ShowCliente";
import CreateClientes from "./components/Cliente/CreateClientes";
import EditClientes from "./components/Cliente/EditClientes";
import ShowProveedor from "./components/Proveedor/ShowProveedor";
import CreateProveedor from "./components/Proveedor/CreateProveedor";
import ShowProducto from "./components/Producto/ShowProducto";
import VentaForm from "./components/Venta/VentaFormTemp";
import ShowVentas from "./components/Venta/ShowVentas";
import CreateUser from "./components/Usuario/CreateUser";
import ShowDetalleVenta from "./components/Venta/ShowDetalleVenta";
import Dashboard from "./components/Dashboard";
import PrediccionPorDni from "./components/PrediccionPorDni";

// 💬 Importa el componente del chat
import GeminiChat from "./components/GeminiChat";

// 🔐 Función segura para obtener userData del localStorage
const getUserData = () => {
  try {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Error al leer userData del localStorage:", e);
    return null;
  }
};

// Configuración de Axios para enviar token en cada petición
axios.interceptors.request.use((config) => {
  const userData = getUserData();
  if (userData?.token) {
    config.headers.Authorization = `Bearer ${userData.token}`;
  }
  return config;
});

// Componente para protección de rutas por rol
const RoleBasedRoute = ({ allowedRoles }) => {
  const userData = getUserData();
  const userRole = userData?.rol;

  if (!userRole) return <Navigate to="/" />;
  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/HomePage" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [userData, setUserData] = useState(() => getUserData());

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    setUserData(data);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userData", JSON.stringify(data));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
  };

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const user = getUserData();

    if (auth === "true" && user) {
      setIsAuthenticated(true);
      setUserData(user);
    }
  }, []);

  // 🧩 Layout global con barra superior y GeminiChat
  const Layout = () => (
    <>
      <Inicio userData={userData} onLogout={handleLogout} />
      <div>
        <Outlet />
      </div>

      {/* 💬 Chat flotante de Gemini visible en todas las páginas */}
      <GeminiChat />
    </>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Login onLoginSuccess={handleLoginSuccess} />}
        >
          <Route index element={<HomePage />} />
        </Route>

        <Route element={<Layout />}>
          {/* Rutas accesibles para Administrador y Empleado */}
          <Route element={<RoleBasedRoute allowedRoles={["Administrador", "Empleado"]} />}>
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/create" element={<CreateClientes />} />
            <Route path="/edit/:id" element={<EditClientes />} />
            <Route path="/Venta/VentaForm" element={<VentaForm />} />
            {/* Ruta que bloquea el acceso al Empleado para eliminar clientes */}
            <Route path="/Cliente/ShowCliente" element={<ShowCliente userData={userData} />} />
          </Route>

          {/* Rutas exclusivas para Administrador */}
          <Route element={<RoleBasedRoute allowedRoles={["Administrador"]} />}>
            <Route path="/proveedor/ShowProveedor" element={<ShowProveedor />} />
            <Route path="/proveedor/CreateProveedor" element={<CreateProveedor />} />
            <Route path="/Producto/ShowProducto" element={<ShowProducto />} />
            <Route path="/Venta/ShowVentas" element={<ShowVentas />} />
            <Route path="/Venta/ShowDetalleVenta" element={<ShowDetalleVenta />} />
            <Route path="/TopProductosChart" element={<Dashboard />} />
            <Route path="/FormularioPrediccion" element={<FormularioPrediccion />} />
            <Route path="/PrediccionPorDni" element={<PrediccionPorDni />} />
          </Route>
        </Route>

        <Route path="/Usuario/CreateUser" element={<CreateUser />} />

        {/* Ruta para acceso no autorizado */}
        <Route path="/unauthorized" element={<div>No tienes permisos para acceder a esta página</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
