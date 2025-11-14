import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProducto from "./EditProducto";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "../Style.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const url = "http://localhost:8080/api/productos";

const ShowProducto = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [producto, setProducto] = useState(null);
  const [FilteredProductos, setFilteredProductos] = useState([]);
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
  const itemsPerPage = isSmallScreen ? 5 : 10; // Menos items en móviles

  useEffect(() => {
    getProductos();
    getProveedores();
  }, []);

  useEffect(() => {
    setFilteredProductos(
      productos.filter(
        (producto) =>
          producto.codigo
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producto.stock
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          producto.precio
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          producto.proveedor?.nombre
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [productos, searchTerm]);

  const getProductos = async () => {
    const respuesta = await axios.get(url);
    setProductos(respuesta.data);
    const Ordenados = respuesta.data.sort((a, b) => b.id - a.id);
    setFilteredProductos(Ordenados);
  };

  const getProveedores = async () => {
    const respuesta = await axios.get("http://localhost:8080/api/proveedores");
    setProveedores(respuesta.data);
  };

  const openModal = (
    producto = {
      codigo: "",
      nombre: "",
      stock: 0,
      precio: 0.0,
      proveedor: { id: null },
    },
    editMode = false
  ) => {
    setProducto(producto);
    setIsEditMode(editMode);
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "proveedorId") {
      const selectedProveedor = proveedores.find(
        (p) => p.id === parseInt(value, 10)
      );
      setProducto({ ...producto, proveedor: selectedProveedor });
    } else {
      setProducto({ ...producto, [name]: value });
    }
  };

  const saveChanges = async () => {
    if (
      !producto.codigo ||
      !producto.nombre ||
      producto.stock <= 0 ||
      producto.precio <= 0 ||
      !producto.proveedor
    ) {
      setErrorMessage("Por favor, complete todos los campos correctamente.");
      return;
    }
    if (
      isNaN(producto.precio) ||
      isNaN(producto.stock) ||
      isNaN(producto.codigo)
    ) {
      setErrorMessage("Hay campos que deben ser solo números.");
      return;
    }

    setErrorMessage("");
    try {
      if (isEditMode) {
        await axios.put(`${url}/${producto.id}`, producto);
        setSnackbarMessage("Producto editado exitosamente!");
        setSnackbarSeverity("info");
      } else {
        await axios.post(url, producto);
        setSnackbarMessage("Producto creado exitosamente!");
        setSnackbarSeverity("success");
      }
      setOpenSnackbar(true);
      getProductos();
      closeModal();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      setErrorMessage("Ocurrió un error al intentar guardar el producto.");
    }
  };

  const deleteProducto = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);
      setSnackbarMessage("Producto eliminado exitosamente!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      getProductos();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setSnackbarMessage("Ocurrió un error al intentar eliminar el producto.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Paginacion
  const totalPages = Math.ceil(FilteredProductos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = FilteredProductos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="container-fluid show-producto-container mt-3 mt-sm-5 px-3 px-sm-4 px-md-5">
      <div className="table-wrapper">
        <div className={`table-title d-flex ${isSmallScreen ? 'flex-column align-items-start gap-3' : 'justify-content-start align-items-center'}`}>
          <h3 className="m-0">Tabla de Productos</h3>
          
          <button
            className={`btn btn-create ${isSmallScreen ? 'w-100' : 'ms-5'}`}
            onClick={() => openModal()}
            style={{
              backgroundColor: "#3f2569",
              color: "white",
              padding: "8px 18px",
              fontSize: isSmallScreen ? "0.9rem" : "0.875rem",
              borderRadius: "22px",
            }}
          >
            Añadir Producto
          </button>

          <div className={`search-container ${isSmallScreen ? 'w-100 mt-2' : 'ms-3'}`}>
            <div 
              className="input-group"
              style={{
                width: isSmallScreen ? "100%" : "350px",
              }}
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
                  fontSize: isSmallScreen ? "0.9rem" : "1rem"
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
        </div>
        
        <div className="table-responsive mt-3" style={{ overflowX: "auto" }}>
          <table className="table mb-0 custom-table">
            <thead>
              <tr className="table-header-row">
                {!isSmallScreen && <th>Nº</th>}
                <th>Código</th>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Precio</th>
                {!isSmallScreen && <th>Proveedor</th>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((producto, i) => (
                <tr key={producto.id}>
                  {!isSmallScreen && <td>{indexOfFirstItem + i + 1}</td>}
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.stock}</td>
                  <td>${producto.precio.toFixed(2)}</td>
                  {!isSmallScreen && (
                    <td>
                      {producto.proveedor
                        ? producto.proveedor.nombre
                        : "Sin proveedor"}
                    </td>
                  )}
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal(producto, true)}
                        style={{ 
                          minWidth: isSmallScreen ? "36px" : "30px",
                          padding: isSmallScreen ? "0.5rem" : "0.25rem",
                          fontSize: isSmallScreen ? "1rem" : "0.875rem"
                        }}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteProducto(producto.id)}
                        style={{ 
                          minWidth: isSmallScreen ? "36px" : "30px",
                          padding: isSmallScreen ? "0.5rem" : "0.25rem",
                          fontSize: isSmallScreen ? "1rem" : "0.875rem"
                        }}
                        title="Eliminar"
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
                siblingCount={isSmallScreen ? 0 : 1}
              />
            </Stack>
          </div>
        )}
        
        {isModalOpen && (
          <EditProducto
            producto={producto}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
            saveChanges={saveChanges}
            isEditMode={isEditMode}
            errorMessage={errorMessage}
            proveedores={proveedores}
            isSmallScreen={isSmallScreen}
          />
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            marginTop: isSmallScreen ? "15%" : "5%",
          }}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ 
              width: isSmallScreen ? "90%" : "auto",
              fontSize: isSmallScreen ? "0.9rem" : "1rem"
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default ShowProducto;