import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Male as MaleIcon,
  Female as FemaleIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  ThumbUp as ThumbUpIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

function FormularioPrediccion() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [form, setForm] = useState({
    genero: '',
    frecuenciaCompra: '',
    montoPromedio: '',
    ultimaCompra: '',
    descuentoRecibido: '',
    metodoPago: '',
    satisfaccion: ''
  });

  const [errors, setErrors] = useState({});
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.genero) newErrors.genero = 'Seleccione el género';
    if (!form.frecuenciaCompra || form.frecuenciaCompra < 0) 
      newErrors.frecuenciaCompra = 'Ingrese un valor válido';
    if (!form.montoPromedio || form.montoPromedio < 0) 
      newErrors.montoPromedio = 'Ingrese un monto válido';
    if (!form.ultimaCompra || form.ultimaCompra < 0) 
      newErrors.ultimaCompra = 'Ingrese días válidos';
    if (!form.descuentoRecibido) 
      newErrors.descuentoRecibido = 'Seleccione una opción';
    if (!form.metodoPago) 
      newErrors.metodoPago = 'Seleccione método de pago';
    if (!form.satisfaccion || form.satisfaccion < 1 || form.satisfaccion > 10) 
      newErrors.satisfaccion = 'Ingrese valor entre 1 y 10';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResultado(null);
    setError(null);

    if (!validate()) return;

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/predecir', form);
      setResultado(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al procesar la predicción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          mt: 3, 
          p: isMobile ? 2 : 4, 
          boxShadow: 3, 
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            mb: 3,
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
          Predicción de Comportamiento de Compra
        </Typography>

        <Grid container spacing={3}>
          {/* Género */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.genero}>
              <InputLabel>Género</InputLabel>
              <Select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                label="Género"
                startAdornment={
                  <InputAdornment position="start">
                    {form.genero === 'Masculino' ? <MaleIcon /> : <FemaleIcon />}
                  </InputAdornment>
                }
              >
                <MenuItem value=""><em>Seleccione</em></MenuItem>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
              {errors.genero && <Typography variant="caption" color="error">{errors.genero}</Typography>}
            </FormControl>
          </Grid>

          {/* Frecuencia de Compra */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Frecuencia de Compra (mensual)"
              type="number"
              name="frecuenciaCompra"
              value={form.frecuenciaCompra}
              onChange={handleChange}
              fullWidth
              error={!!errors.frecuenciaCompra}
              helperText={errors.frecuenciaCompra}
              inputProps={{ min: 0 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">veces/mes</InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Monto Promedio */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Monto Promedio"
              type="number"
              name="montoPromedio"
              value={form.montoPromedio}
              onChange={handleChange}
              fullWidth
              error={!!errors.montoPromedio}
              helperText={errors.montoPromedio}
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Última Compra */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Última Compra"
              type="number"
              name="ultimaCompra"
              value={form.ultimaCompra}
              onChange={handleChange}
              fullWidth
              error={!!errors.ultimaCompra}
              helperText={errors.ultimaCompra}
              inputProps={{ min: 0 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">días</InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Descuento Recibido */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.descuentoRecibido}>
              <InputLabel>¿Recibió Descuento?</InputLabel>
              <Select
                name="descuentoRecibido"
                value={form.descuentoRecibido}
                onChange={handleChange}
                label="¿Recibió Descuento?"
              >
                <MenuItem value=""><em>Seleccione</em></MenuItem>
                <MenuItem value="Si">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
              {errors.descuentoRecibido && <Typography variant="caption" color="error">{errors.descuentoRecibido}</Typography>}
            </FormControl>
          </Grid>

          {/* Método de Pago */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.metodoPago}>
              <InputLabel>Método de Pago</InputLabel>
              <Select
                name="metodoPago"
                value={form.metodoPago}
                onChange={handleChange}
                label="Método de Pago"
                startAdornment={
                  <InputAdornment position="start">
                    <PaymentIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value=""><em>Seleccione</em></MenuItem>
                <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                <MenuItem value="Transferencia">Transferencia</MenuItem>
                <MenuItem value="Efectivo">Efectivo</MenuItem>
              </Select>
              {errors.metodoPago && <Typography variant="caption" color="error">{errors.metodoPago}</Typography>}
            </FormControl>
          </Grid>

          {/* Satisfacción */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nivel de Satisfacción"
              type="number"
              name="satisfaccion"
              value={form.satisfaccion}
              onChange={handleChange}
              fullWidth
              error={!!errors.satisfaccion}
              helperText={errors.satisfaccion || "Escala del 1 al 10"}
              inputProps={{ min: 1, max: 10 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ThumbUpIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Box textAlign="center" mt={4}>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                Procesando...
              </>
            ) : (
              'Predecir Comportamiento'
            )}
          </Button>
        </Box>

        {resultado && (
          <Alert 
            severity="success" 
            sx={{ mt: 3 }}
            icon={false}
          >
            <Typography variant="h6" gutterBottom>
              Resultado de la Predicción:
            </Typography>
            <Typography>{resultado}</Typography>
          </Alert>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ mt: 3 }}
          >
            <Typography variant="subtitle1">{error}</Typography>
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default FormularioPrediccion;