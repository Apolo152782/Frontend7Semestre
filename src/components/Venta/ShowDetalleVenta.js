import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "../Style.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ShowDetalleVenta = () => {
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDetallesVenta, setFilteredDetallesVenta] = useState([]);
  const [contadorExportaciones, setContadorExportaciones] = useState(
    parseInt(localStorage.getItem("contadorExportaciones") || "1", 10)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const fetchDetallesVenta = async () => {
      try {
        const response = await axios.get(
          "https://backend-stackflow-a9cqgjede9hbgch7.centralus-01.azurewebsites.net/detalleventa/listar"
        );
        const ventasOrdenadas = response.data.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setDetallesVenta(ventasOrdenadas);
      } catch (error) {
        console.error("Error al obtener los detalles de la venta:", error);
      }
    };

    fetchDetallesVenta();
  }, []);

  useEffect(() => {
    setFilteredDetallesVenta(
      detallesVenta.filter(
        (detalle) =>
          detalle.cod_pro
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          detalle.nompro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          detalle.cantidad
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          detalle.satisfactionScore
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          detalle.precio
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [detallesVenta, searchTerm]);

  const totalPages = Math.ceil(filteredDetallesVenta.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDetallesVenta.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const exportarAExcel = () => {
    // ... (mantener la misma implementación de exportarAExcel)
  };

  return (
    <div className="container-fluid show-ventas-container mt-3 mt-md-5 px-2 px-md-3">
      <div className="table-wrapper">
        <div className="table-title d-flex flex-column flex-md-row justify-content-start align-items-center align-items-md-start gap-3 gap-md-0">
          <h3 className="m-0 text-center text-md-start">Tabla de Detalle Ventas</h3>

          <div className="d-flex flex-column flex-md-row align-items-center w-100 gap-3">
            <div className="input-group" style={{ maxWidth: "400px", width: "100%" }}>
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
                  zIndex: 1
                }}
              >
                <i className="bi bi-search"></i>
              </span>
            </div>

            <button
              className="btn btn-create"
              onClick={exportarAExcel}
              style={{
                backgroundColor: "#908dc7",
                color: "white",
                padding: "8px 18px",
                fontSize: "14px",
                border: "2px solid #6c63ff",
                borderRadius: "22px",
                whiteSpace: "nowrap",
                width: isMobile ? "100%" : "auto"
              }}
            >
              {isMobile ? "Excel" : "Exportar a Excel"}
            </button>
          </div>
        </div>

        <div className="table-responsive custom-table" style={{ overflowX: "auto" }}>
          <table className="table mb-0" style={{ minWidth: isMobile ? "600px" : "100%" }}>
            <thead>
              <tr className="table-header-row">
                <th>ID</th>
                {!isMobile && <th>Código Del producto</th>}
                <th>Nombre</th>
                <th>Cant.</th>
                <th>Precio</th>
                {!isMobile && <th>Satisfacción</th>}
                {!isTablet && <th>Fecha</th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((detalleVenta, i) => (
                <tr key={detalleVenta.id}>
                  <td>{indexOfFirstItem + i + 1}</td>
                  {!isMobile && <td>{detalleVenta.cod_pro}</td>}
                  <td>{isMobile ? `${detalleVenta.nompro?.substring(0, 15)}${detalleVenta.nompro?.length > 15 ? '...' : ''}` : detalleVenta.nompro}</td>
                  <td>{detalleVenta.cantidad}</td>
                  <td>{detalleVenta.precio}</td>
                  {!isMobile && <td>{detalleVenta.satisfactionScore}</td>}
                  {!isTablet && <td>{isMobile ? detalleVenta.fecha?.substring(0, 10) : detalleVenta.fecha}</td>}
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
                size={isMobile ? "small" : "medium"}
              />
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowDetalleVenta;