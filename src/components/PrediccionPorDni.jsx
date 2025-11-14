import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Grid,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  useMediaQuery,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Box } from '@mui/system';

const PrediccionPorDni = () => {
  const [historialPredicciones, setHistorialPredicciones] = useState([]);
  const [dni, setDni] = useState('');
  const [infoCliente, setInfoCliente] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  // Cargar historial desde localStorage al iniciar
  useEffect(() => {
    const cargarHistorial = () => {
      const dataGuardada = localStorage.getItem('historialPredicciones');
      if (dataGuardada) {
        setHistorialPredicciones(JSON.parse(dataGuardada));
      }
    };
    cargarHistorial();
  }, []);

  const guardarEnHistorial = (cliente) => {
    const nuevoHistorial = [cliente, ...historialPredicciones].slice(0, 10); // Limitar a 10 registros
    setHistorialPredicciones(nuevoHistorial);
    localStorage.setItem('historialPredicciones', JSON.stringify(nuevoHistorial));
  };

  const handlePredict = async () => {
    if (!dni.trim()) {
      setError('Por favor ingrese un número de cédula válido');
      setInfoCliente(null);
      return;
    }

    if (dni.length < 8 || dni.length > 11) {
      setError('La cédula debe tener entre 8 y 11 dígitos');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/predecir/dni/${dni}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener la predicción');
      }

      const data = await response.json();
      if (!data) throw new Error('No se encontraron datos para este cliente');
      
      const clienteData = {
        ...data,
        dni: dni,
        fechaConsulta: new Date().toLocaleString()
      };
      
      setInfoCliente(clienteData);
      guardarEnHistorial(clienteData);
    } catch (err) {
      setInfoCliente(null);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const limpiarHistorial = () => {
    if (window.confirm('¿Está seguro que desea borrar todo el historial?')) {
      localStorage.removeItem('historialPredicciones');
      setHistorialPredicciones([]);
    }
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(valor);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
          <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Predicción por Cédula
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label="Ingrese la cédula del cliente"
              variant="outlined"
              value={dni}
              onChange={(e) => {
                setDni(e.target.value.replace(/\D/g, '')); // Solo números
                setError('');
              }}
              inputProps={{
                maxLength: 11,
                inputMode: 'numeric'
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              error={!!error}
              helperText={error}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePredict}
              disabled={!dni.trim() || cargando}
              fullWidth
              startIcon={cargando ? <CircularProgress size={20} /> : <SearchIcon />}
            >
              {cargando ? 'Buscando...' : 'Consultar'}
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {infoCliente && (
          <Paper elevation={2} sx={{ mt: 4, p: 3, bgcolor: 'background.paper' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Información del Cliente
              </Typography>
              <Chip 
                label={infoCliente.resultado === 'Si' ? 'Cliente Activo' : 'Cliente Inactivo'} 
                color={infoCliente.resultado === 'Si' ? 'success' : 'error'} 
                variant="outlined"
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1"><strong>Nombre:</strong> {infoCliente.nombre || 'No disponible'}</Typography>
                <Typography variant="body2"><strong>Cédula:</strong> {dni}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2"><strong>Edad:</strong> {infoCliente.edad || 'No disponible'}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2"><strong>Género:</strong> {infoCliente.genero || 'No disponible'}</Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="body2"><strong>Frecuencia:</strong></Typography>
                <Chip label={`${infoCliente.frecuenciaCompra} compras/mes`} color="primary" size="small" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2"><strong>Monto:</strong></Typography>
                <Chip label={formatearMoneda(infoCliente.montoPromedio)} color="secondary" size="small" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2"><strong>Última compra:</strong></Typography>
                <Chip label={`${infoCliente.ultimaCompraDias} días`} size="small" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2"><strong>Satisfacción:</strong></Typography>
                <Chip label={`${infoCliente.satisfaccion}/10`} size="small" />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Predicción de Compra
              </Typography>
              <Alert 
                severity={infoCliente.resultado === 'Si' ? 'success' : 'warning'}
                sx={{ maxWidth: 400, mx: 'auto' }}
              >
                <Typography>
                  <strong>Probabilidad:</strong> {(infoCliente.probabilidad * 100).toFixed(2)}%
                </Typography>
                {infoCliente.resultado === 'Si' 
                  ? 'Es probable que este cliente realice una nueva compra.' 
                  : 'Es poco probable que este cliente realice una nueva compra en el corto plazo.'}
              </Alert>
            </Box>
          </Paper>
        )}

        {/* Historial de búsquedas */}
        <Paper elevation={2} sx={{ mt: 4, p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Historial Reciente
            </Typography>
            <Box>
              <Tooltip title="Recargar historial">
                <IconButton onClick={() => window.location.reload()} size="small" sx={{ mr: 1 }}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Button 
                variant="outlined" 
                color="error" 
                size="small" 
                onClick={limpiarHistorial}
                startIcon={<DeleteIcon />}
                disabled={historialPredicciones.length === 0}
              >
                Limpiar
              </Button>
            </Box>
          </Box>

          {historialPredicciones.length === 0 ? (
            <Alert severity="info">
              No hay búsquedas recientes. Realice una consulta para comenzar.
            </Alert>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Cédula</TableCell>
                    {!isMobile && <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>}
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Monto</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Resultado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historialPredicciones.map((item, index) => (
                    <TableRow 
                      key={index} 
                      hover 
                      onClick={() => {
                        setDni(item.dni);
                        setInfoCliente(item);
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{item.dni}</TableCell>
                      {!isMobile && <TableCell>{item.nombre || 'N/A'}</TableCell>}
                      <TableCell align="right">{formatearMoneda(item.montoPromedio)}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={item.resultado} 
                          size="small" 
                          color={item.resultado === 'Si' ? 'success' : 'error'} 
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Paper>
    </Container>
  );
};

export default PrediccionPorDni;