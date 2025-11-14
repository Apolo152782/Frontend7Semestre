import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const ShowVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get("http://localhost:8080/ventas/listar");

        const ventasOrdenadas = response.data.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setVentas(ventasOrdenadas);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };

    fetchVentas();
  }, []);

  useEffect(() => {
    setFilteredVentas(
      ventas.filter(
        (venta) =>
          venta.codcliente
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          venta.nomcliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venta.nombreEmpleado
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          venta.metodoPago?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venta.total
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          venta.subtotal
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          venta.fecha
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [ventas, searchTerm]);

  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVentas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container-fluid show-ventas-container mt-5">
      <div className="table-wrapper">
        <div className="table-title d-flex justify-content-start align-items-center">
          <h3 className="m-0">Tabla de Ventas</h3>
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
        <div className="table-responsive custom-table">
          <table className="table mb-1">
            <thead>
              <tr className="table-header-row">
                <th>ID</th>
                <th>Cédula </th>
                <th>Nombre del Cliente</th>
                <th>Nombre del Empleado</th>
                <th>Método Pago</th>
                <th>Subtotal</th>
                <th>Total con Iva</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((venta, i) => (
                <tr key={venta.id}>
                  <td>{indexOfFirstItem + i + 1}</td>
                  <td>{venta.codcliente}</td>
                  <td>{venta.nomcliente}</td>
                  <td>{venta.nombreEmpleado}</td>
                  <td>{venta.metodoPago}</td>
                  <td>${venta.subtotal.toFixed(2)}</td>
                  <td>${venta.total.toFixed(2)}</td>
                  <td>{venta.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
            <Stack spacing={1}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="secondary"
                shape="rounded"
              />
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowVentas;