import React, { useEffect, useState } from "react";
import axios from "axios";
import EditClientes from "./EditClientes";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../Style.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const url = "http://localhost:8080/api/clientes";

const ShowCliente = ({ userData }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Alertas
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isSmallScreen ? 10 : 10;

  useEffect(() => {
    getClientes();
  }, []);

  useEffect(() => {
    setFilteredClientes(
      clientes.filter(
        (cliente) =>
          cliente.dni
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.edad?.toString().includes(searchTerm) ||
          cliente.genero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.telefono
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          cliente.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.razon?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [clientes, searchTerm]);

  const getClientes = async () => {
    try {
      const respuesta = await axios.get(url, {
        headers: {
          rol: "ADMIN",
        },
      });
      const clientesOrdenados = respuesta.data.sort((a, b) => b.id - a.id);
      setClientes(clientesOrdenados);
      setFilteredClientes(clientesOrdenados);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setSnackbarMessage("Error de red al cargar los clientes.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const openModal = (
    cliente = {
      dni: "",
      nombre: "",
      edad: "",
      genero: "",
      telefono: "",
      direccion: "",
      razon: "",
    },
    editMode = false
  ) => {
    setCliente(cliente);
    setIsEditMode(editMode);
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const saveChanges = async () => {
    if (
      !cliente.dni ||
      !cliente.nombre ||
      !cliente.edad ||
      !cliente.genero ||
      !cliente.telefono ||
      !cliente.direccion ||
      !cliente.razon
    ) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }

    if (isNaN(cliente.dni) || isNaN(cliente.telefono)) {
      setErrorMessage("Cédula y Teléfono deben ser solo números.");
      return;
    }

    setErrorMessage("");

    try {
      if (isEditMode) {
        await axios.put(`${url}/${cliente.id}`, cliente);
        setSnackbarMessage("Cliente editado exitosamente!");
        setSnackbarSeverity("info");
      } else {
        await axios.post(url, cliente);
        setSnackbarMessage("Cliente creado exitosamente!");
        setSnackbarSeverity("success");
      }
      setOpenSnackbar(true);
      getClientes();
      closeModal();
    } catch (error) {
      setErrorMessage("Hubo un error al guardar el cliente.");
    }
  };

  const deleteCliente = async (id) => {
    await axios.delete(`${url}/${id}`);
    setSnackbarMessage("Cliente eliminado exitosamente!");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
    getClientes();
  };

  // Paginacion
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClientes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="container-fluid show-cliente-container mt-5 mt-md-5 px-2 px-md-4">
      <div className="table-wrapper">
        <div className="table-title d-flex justify-content-start align-items-center">
          <h3 className="m-0">Tabla de Clientes</h3>  
            <button
              className="btn btn-create ms-5"
              onClick={() => openModal()}
              style={{
                backgroundColor: "#3f2569",
                color: "white",
                padding: "8px 18px",
                fontSize: "14px",
                borderRadius: "22px",
                width: isSmallScreen ? "100%" : "auto"
              }}
            >
              Añadir Cliente
            </button>
            
            <div className="mb-3 ms-1" style={{ flexGrow: 1 }}></div>
            <div
            className="input-group"
            style={{ width: "400px", marginLeft: "20px" }}
          >
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderRadius: "25px",
                  color: "black",
                  border: "1px solid #6c757d",
                  paddingRight: "40px",
                }}
              />
              <span
                className="input-group-text"
                style={{
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "white",
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <i className="bi bi-search"></i>
              </span>
            </div>
        </div>
        
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="table mb-0 custom-table">
            <thead>
              <tr className="table-header-row">
                {!isSmallScreen && <th>Nº</th>}
                <th>Cédula</th>
                <th>Nombre</th>
                {!isSmallScreen && <th>Edad</th>}
                {!isSmallScreen && <th>Género</th>}
                <th>Teléfono</th>
                {!isSmallScreen && <th>Dirección</th>}
                {!isSmallScreen && <th>Razón</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((cliente, i) => (
                <tr key={cliente.id}>
                  {!isSmallScreen && <td>{indexOfFirstItem + i + 1}</td>}
                  <td>{cliente.dni}</td>
                  <td>{cliente.nombre}</td>
                  {!isSmallScreen && <td>{cliente.edad}</td>}
                  {!isSmallScreen && <td>{cliente.genero}</td>}
                  <td>{cliente.telefono}</td>
                  {!isSmallScreen && <td>{cliente.direccion}</td>}
                  {!isSmallScreen && <td>{cliente.razon}</td>}
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal(cliente, true)}
                        style={{ minWidth: "30px" }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          userData?.rol === "Administrador" &&
                          deleteCliente(cliente.id)
                        }
                        disabled={userData?.rol !== "Administrador"}
                        title={
                          userData?.rol !== "Administrador"
                            ? "Solo el administrador puede eliminar"
                            : ""
                        }
                        style={{
                          minWidth: "30px",
                          cursor:
                            userData?.rol !== "Administrador"
                              ? "not-allowed"
                              : "pointer",
                          opacity: userData?.rol !== "Administrador" ? 0.5 : 1,
                          borderColor:
                            userData?.rol !== "Administrador" ? "#ccc" : "",
                          color: userData?.rol !== "Administrador" ? "#aaa" : "",
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
            <Stack spacing={1}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="secondary"
                shape="rounded"
                size={isSmallScreen ? "small" : "medium"}
              />
            </Stack>
          </div>
        )}
        
        {isModalOpen && (
          <EditClientes
            cliente={cliente}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
            saveChanges={saveChanges}
            isEditMode={isEditMode}
            errorMessage={errorMessage}
            isSmallScreen={isSmallScreen}
          />
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            marginTop: isSmallScreen ? "20%" : "5%",
          }}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: isSmallScreen ? "90%" : "auto" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default ShowCliente;