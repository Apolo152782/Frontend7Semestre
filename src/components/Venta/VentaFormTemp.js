import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import '../Style.css';

const VentaFormTemp = () => {
  const [codigoCliente, setCodigoCliente] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [codigoProducto, setCodigoProducto] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [precio, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [stock, setStock] = useState(0);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [total, setTotal] = useState(0);
  const [metodoPago, setMetodoPago] = useState('');
  const [productosEncontrados, setProductosEncontrados] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [nombreProductoBusqueda, setNombreProductoBusqueda] = useState('');

  const IVA_RATE = 0.19;
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Estados para la evaluación de satisfacción
  const [openEvaluationModal, setOpenEvaluationModal] = useState(false);
  const [satisfactionScore, setSatisfactionScore] = useState(null);
  const [tempVentaData, setTempVentaData] = useState(null);

  // Estado para el modal de stock insuficiente
  const [openStockModal, setOpenStockModal] = useState(false);
  const [stockModalMessage, setStockModalMessage] = useState('');

  // Estilos para los modales
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '400px' },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center'
  };

  const stockModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '350px' },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    textAlign: 'center'
  };

  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
  const nombreEmpleado = usuario.nombre || 'Nombre no disponible';

  const buscarClientePorDni = async () => {
    if (!codigoCliente) {
      mostrarAlerta("Por favor, ingrese un DNI.", 'error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/clientes/dni/nombre/${codigoCliente}`);
      if (response.ok) {
        const cliente = await response.json();
        setNombreCliente(cliente.nombre);
        if (cliente.metodo_pago) {
          setMetodoPago(cliente.metodo_pago);
        }
      } else {
        mostrarAlerta('Cliente no encontrado', 'error');
        setNombreCliente("Cliente no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      mostrarAlerta('Error al buscar cliente', 'error');
      setNombreCliente("Error al buscar cliente");
    }
  };

  const buscarProductosAlEscribir = async (nombre) => {
    if (nombre.length < 2) {
      setProductosEncontrados([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/productos/buscar?nombre=${encodeURIComponent(nombre)}`);
      if (response.ok) {
        const data = await response.json();
        setProductosEncontrados(data);
        setMostrarSugerencias(true);
      }
    } catch (error) {
      console.error("Error buscando productos:", error);
    }
  };

  const mostrarModalStockInsuficiente = (mensaje) => {
    setStockModalMessage(mensaje);
    setOpenStockModal(true);
  };

  const agregarDetalle = () => {
    if (!nombreProducto) {
      mostrarAlerta('Por favor, busca un producto antes de agregarlo.', 'error');
      return;
    }
    if (cantidad <= 0) {
      mostrarAlerta('La cantidad debe ser mayor que cero.', 'error');
      return;
    }
    if (cantidad > stock) {
      mostrarModalStockInsuficiente('No hay suficiente stock disponible.');
      return;
    }

    const subtotal = precio * cantidad;
    const nuevoDetalle = {
      codigoProducto,
      nombreProducto,
      precio,
      cantidad,
      subtotal,
    };

    const nuevoStock = stock - cantidad;

    setDetallesVenta([...detallesVenta, nuevoDetalle]);
    setTotal(total + subtotal);
    setStock(nuevoStock < 0 ? 0 : nuevoStock);
    setCodigoProducto('');
    setCantidad(1);
    setNombreProducto('');
    setPrecio(0);
    setNombreProductoBusqueda('');
  };

  const eliminarDetalle = (index) => {
    const nuevoDetalles = detallesVenta.filter((_, i) => i !== index);
    const subtotalEliminado = detallesVenta[index].subtotal;
    setDetallesVenta(nuevoDetalles);
    setTotal(total - subtotalEliminado);
  };

  const generarPDF = (ventaData) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [85, 200],
    });

    doc.setFont('Courier');
    const leftMargin = 5;
    let yPos = 10;

    doc.setFontSize(16);
    const companyName = "StackFlow";
    const companyNameWidth = doc.getStringUnitWidth(companyName) * 16 / doc.internal.scaleFactor;
    const companyNameX = (85 - companyNameWidth) / 2;
    doc.text(companyName, companyNameX, yPos);
    yPos += 10;

    doc.setFontSize(8);
    const address = "131113 Cartagena - Bolivar - Colombia";
    const addressWidth = doc.getStringUnitWidth(address) * 8 / doc.internal.scaleFactor;
    const addressX = (85 - addressWidth) / 2;
    doc.text(address, addressX, yPos);
    yPos += 5;

    const receiptNum = `#${Math.floor(Math.random() * 100000000)}`;
    const receiptWidth = doc.getStringUnitWidth(receiptNum) * 8 / doc.internal.scaleFactor;
    const receiptX = (85 - receiptWidth) / 2;
    doc.text(receiptNum, receiptX, yPos);
    yPos += 7;

    doc.setLineWidth(0.1);
    doc.line(leftMargin, yPos, 80, yPos);
    yPos += 5;

    doc.setFontSize(8);
    doc.text(`FECHA: ${new Date().toLocaleDateString()}`, leftMargin, yPos);
    yPos += 4;
    doc.text(`HORA: ${new Date().toLocaleTimeString()}`, leftMargin, yPos);
    yPos += 4;
    doc.text(`Empleado: ${nombreEmpleado}`, leftMargin, yPos);

    yPos += 4;
    doc.text(`CLIENTE: ${nombreCliente}`, leftMargin, yPos);
    yPos += 4;
    doc.text(`MÉTODO DE PAGO: ${metodoPago.toUpperCase()}`, leftMargin, yPos);
    yPos += 6;

    doc.setFontSize(10);
    const saleText = "VENTA";
    const saleWidth = doc.getStringUnitWidth(saleText) * 10 / doc.internal.scaleFactor;
    const saleX = (85 - saleWidth) / 2;
    doc.text(saleText, saleX, yPos);
    yPos += 6;

    doc.setFontSize(8);
    doc.text("CANT.", leftMargin, yPos);
    doc.text("DESCRIPCION", 18, yPos);
    doc.text("P.U.", 54, yPos);
    doc.text("TOTAL", 70, yPos);
    yPos += 4;

    detallesVenta.forEach(detalle => {
      const cantidadTexto = `${detalle.cantidad}`;
      doc.text(cantidadTexto, leftMargin, yPos);

      const descripcionTexto = detalle.nombreProducto.length > 20
        ? detalle.nombreProducto.substring(0, 20) + "..."
        : detalle.nombreProducto;
      doc.text(descripcionTexto, 18, yPos);

      const precioUnitarioTexto = `$${detalle.precio}`;
      doc.text(precioUnitarioTexto, 54, yPos);

      const precioTotalTexto = `$${(detalle.cantidad * detalle.precio)}`;
      doc.text(precioTotalTexto, 70, yPos);

      yPos += 5;
    });

    doc.line(leftMargin, yPos, 80, yPos);
    yPos += 5;

    const iva = total * IVA_RATE;
    doc.text("SUBTOTAL:", leftMargin, yPos);
    doc.text(`$${total.toFixed(2)}`, 57, yPos);
    yPos += 4;

    doc.text("IVA (19%):", leftMargin, yPos);
    doc.text(`$${iva.toFixed(2)}`, 57, yPos);
    yPos += 4;

    doc.setFontSize(10);
    doc.text("TOTAL:", leftMargin, yPos);
    doc.text(`$${(total + iva).toFixed(2)}`, 57, yPos);
    yPos += 6;

    // Agregar evaluación SI EXISTE
    const detallesConSatisfaccion = ventaData.detallesVenta.filter(d => d.satisfactionScore);
    if (detallesConSatisfaccion.length > 0) {
      const score = detallesConSatisfaccion[0].satisfactionScore;

      doc.setFontSize(8);
      doc.text("EVALUACIÓN DEL CLIENTE:", leftMargin, yPos);
      yPos += 4;

      // Dibujar barra visual
      const barWidth = 50;
      const scoreWidth = (score / 10) * barWidth;
      doc.setFillColor(144, 141, 199);
      doc.rect(leftMargin, yPos, scoreWidth, 5, 'F');
      doc.rect(leftMargin, yPos, barWidth, 5);

      yPos += 8;
      doc.text(`Calificación: ${score}/10`, leftMargin, yPos);
      yPos += 6;
    }

    doc.setFontSize(8);
    const thankYouMsg = "¡Gracias por su compra!";
    const thankYouWidth = doc.getStringUnitWidth(thankYouMsg) * 8 / doc.internal.scaleFactor;
    const thankYouX = (85 - thankYouWidth) / 2;
    doc.text(thankYouMsg, thankYouX, yPos);

    doc.save(`Recibo_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const mostrarAlerta = (mensaje, severidad = 'success') => {
    setAlertMessage(mensaje);
    setAlertSeverity(severidad);
    setAlertOpen(true);
  };

  const handleEvaluationSubmit = async () => {
    try {
      if (satisfactionScore === null) {
        mostrarAlerta('Por favor, seleccione una valoración', 'error');
        return;
      }

      const ventaDataConEvaluacion = {
        ...tempVentaData,
        detallesVenta: tempVentaData.detallesVenta.map(detalle => ({
          ...detalle,
          satisfactionScore: satisfactionScore
        }))
      };

      const response = await fetch('http://localhost:8080/ventas/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaDataConEvaluacion)
      });

      if (response.status === 200 || response.status === 201) {
        mostrarAlerta('Venta generada exitosamente.');
        generarPDF(ventaDataConEvaluacion);

        // Limpiar el formulario
        setDetallesVenta([]);
        setTotal(0);
        setSatisfactionScore(null);
        setStock(0);
        setNombreCliente('');
        setCodigoCliente('');
        setMetodoPago('efectivo');
        setNombreProductoBusqueda('');
        setProductosEncontrados([]);

        if (nombreProductoBusqueda) {
          buscarProductosAlEscribir(nombreProductoBusqueda);
        }
      } else {
        mostrarAlerta('Error al generar la venta.', 'error');
      }
    } catch (error) {
      console.log('Error al generar la venta:', error);
      mostrarAlerta('Error al generar la venta.', 'error');
    } finally {
      setOpenEvaluationModal(false);
    }
  };

  const generarVenta = async () => {
    if (!nombreCliente || nombreCliente === 'Cliente no encontrado' || nombreCliente === 'Error al buscar cliente') {
      mostrarAlerta('Por favor, selecciona un cliente válido.', 'error');
      return;
    }
    if (detallesVenta.length === 0) {
      mostrarAlerta('Por favor, agrega al menos un producto a la venta.', 'error');
      return;
    }

    const ventaData = {
      nomcliente: nombreCliente,
      codcliente: codigoCliente,
      metodoPago: metodoPago,
      satisfactionScore: satisfactionScore,
      nombreEmpleado: nombreEmpleado,
      subtotal: total,
      iva: total * IVA_RATE,
      total: total * (1 + IVA_RATE),
      fecha: new Date().toLocaleDateString('en-CA'),
      detallesVenta: detallesVenta.map(detalle => ({
        cod_pro: detalle.codigoProducto,
        nompro: detalle.nombreProducto,
        cantidad: detalle.cantidad,
        precio: detalle.precio,
        fecha: new Date().toLocaleDateString('en-CA'),
      }))
    };

    setTempVentaData(ventaData);
    setOpenEvaluationModal(true);
  };

  const iva = total * IVA_RATE;
  const totalConIVA = total + iva;

  return (
    <div className="container mt-3 mt-md-5">
      <h3 className="text-center text-md-start">Registro de Ventas</h3>
      <br />
      <div className="row">
        <div className="col-12 col-md-5 mb-4 mb-md-0">
          <div className="card h-100">
            <div className="card-body">
              <div className="form-group">
                <h6>Datos del Cliente</h6>
                <div className="d-flex flex-column align-items-start">
                  <div className="d-flex w-100">
                    <input
                      type="text"
                      className="form-control me-2 input-dni"
                      placeholder="Cédula"
                      value={codigoCliente}
                      onChange={(e) => setCodigoCliente(e.target.value)}
                    />
                    <button
                      className="btn btn-buscar ms-2"
                      onClick={buscarClientePorDni}
                      style={{
                        backgroundColor: '#3f2569',
                        color: 'white',
                        padding: '8px 18px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        outline: 'none'
                      }}
                    >
                      Buscar
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control mt-2 input-nombre"
                    value={nombreCliente}
                    placeholder="Nombre del Cliente"
                    readOnly
                  />
                </div>
              </div>

              <div className="form-group mt-3">
                <h6>Método de Pago</h6>
                <select
                  className="form-control"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>Selecciona el método de pago</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              <br />
              <h6>Datos del Producto</h6>
              <div className="form-group" style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control me-2 input-codigo"
                  placeholder="Nombre del producto"
                  value={nombreProductoBusqueda}
                  onChange={(e) => {
                    setNombreProductoBusqueda(e.target.value);
                    buscarProductosAlEscribir(e.target.value);
                  }}
                  onFocus={() => setMostrarSugerencias(true)}
                  onBlur={() => setTimeout(() => setMostrarSugerencias(false), 150)}
                />

                {mostrarSugerencias && productosEncontrados.length > 0 && (
                  <div className="dropdown-menu show w-100">
                    {productosEncontrados.map((producto) => (
                      <button
                        key={producto.codigo}
                        className="dropdown-item"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCodigoProducto(producto.codigo);

                          let stockDisponible = producto.stock;
                          for (let i = 0; i < detallesVenta.length; i++) {
                            if (detallesVenta[i].codigoProducto === producto.codigo) {
                              stockDisponible -= detallesVenta[i].cantidad;
                            }
                          }

                          setStock(stockDisponible < 0 ? 0 : stockDisponible);
                          setNombreProducto(producto.nombre);
                          setPrecio(producto.precio);
                          setNombreProductoBusqueda(producto.nombre);
                          setMostrarSugerencias(false);
                        }}
                      >
                        {producto.nombre}
                      </button>
                    ))}
                  </div>
                )}

                <br />
                <div className="row">
                  <div className="col-4">
                    <h6>Precio</h6>
                    <input
                      type="number"
                      className="form-control input-precioProducto"
                      value={precio}
                      placeholder="Precio"
                      readOnly
                    />
                  </div>
                  <div className="col-4">
                    <h6>Cantidad</h6>
                    <input
                      type="number"
                      className="form-control input-cantidadProducto"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="col-4">
                    <h6>Stock</h6>
                    <input
                      type="text"
                      className="form-control input-stockProducto"
                      value={stock}
                      placeholder="Stock"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <button className="btn btn-success mt-3 w-100" onClick={agregarDetalle}>
                Agregar Producto
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card h-100">
            <div className="card-body">
              <div className="table-responsive custom-table" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Nº</th>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detallesVenta.map((detalle, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{detalle.codigoProducto}</td>
                        <td>{detalle.nombreProducto}</td>
                        <td>${detalle.precio.toFixed(2)}</td>
                        <td>{detalle.cantidad}</td>
                        <td>${detalle.subtotal.toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarDetalle(index)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card mt-3 card-totals">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>Subtotal:</h6>
                      <h6>IVA (19%):</h6>
                      <h5>Total:</h5>
                    </div>
                    <div className="text-end">
                      <h6>${total.toFixed(2)}</h6>
                      <h6>${iva.toFixed(2)}</h6>
                      <h5>${totalConIVA.toFixed(2)}</h5>
                    </div>
                  </div>
                  <button
                    className="btn btn-success w-100 mt-2"
                    onClick={generarVenta}
                    disabled={!nombreCliente || detallesVenta.length === 0}
                  >
                    Generar Venta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de evaluación de satisfacción */}
      <Modal open={openEvaluationModal} onClose={() => setOpenEvaluationModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            ¡Gracias por su compra!
          </Typography>
          <Typography sx={{ mt: 2, mb: 4 }}>
            Por favor, califique su satisfacción (1-10):
          </Typography>

          <Slider
            value={satisfactionScore || 5}
            onChange={(e, newValue) => setSatisfactionScore(newValue)}
            min={1}
            max={10}
            step={1}
            marks={[
              { value: 1, label: '1' },
              { value: 5, label: '5' },
              { value: 10, label: '10' }
            ]}
            valueLabelDisplay="auto"
            sx={{
              width: '80%',
              margin: '0 auto',
              mb: 4
            }}
          />

          <Typography variant="body1" sx={{ mb: 3 }}>
            Su calificación: <strong>{satisfactionScore || '--'}/10</strong>
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={handleEvaluationSubmit}
            sx={{ backgroundColor: '#3f2569', '&:hover': { backgroundColor: '#5d3a9b' } }}
          >
            Confirmar Evaluación
          </Button>
        </Box>
      </Modal>

      {/* Modal de stock insuficiente */}
      <Modal open={openStockModal} onClose={() => setOpenStockModal(false)}>
        <Box sx={stockModalStyle}>
          <Typography variant="h6" gutterBottom color="error">
            Stock Insuficiente
          </Typography>
          <Typography sx={{ mt: 2, mb: 4 }}>
            {stockModalMessage}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setOpenStockModal(false)}
            color="error"
          >
            Entendido
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VentaFormTemp;