import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Typography } from 'antd';
import { TextField, MenuItem, Select, InputLabel, FormControl, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const EditProducto = ({
    producto,
    handleInputChange,
    closeModal,
    saveChanges,
    isEditMode,
    errorMessage,
}) => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                setLoading(true);
                const respuesta = await axios.get('http://localhost:8080/api/proveedores');
                setProveedores(respuesta.data);
            } catch (error) {
                console.error('Error fetching proveedores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProveedores();
    }, []);

    return (
        <Modal
            title={
                <Typography variant="h5" component="h2" style={{ margin: 0 }}>
                    {isEditMode ? 'Editar Producto' : 'Crear Producto'}
                </Typography>
            }
            open={true}
            onCancel={closeModal}
            width={isMobile ? '90%' : isTablet ? '70%' : '35%'}
            footer={[
                <Button
                    key="cancel"
                    onClick={closeModal}
                    style={{ 
                        backgroundColor: '#d8243f', 
                        color: '#fff',
                        minWidth: isMobile ? '100%' : '120px',
                        marginBottom: isMobile ? '8px' : '0'
                    }}
                >
                    Cancelar
                </Button>,
                <Button
                    key="save"
                    onClick={saveChanges}
                    style={{ 
                        backgroundColor: '#28a745', 
                        color: '#fff',
                        minWidth: isMobile ? '100%' : '120px'
                    }}
                    loading={loading}
                >
                    {isEditMode ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>,
            ]}
            bodyStyle={{
                padding: isMobile ? '16px' : '24px',
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
        >
            <form autoComplete="off">
                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Código"
                        name="codigo"
                        value={producto.codigo || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                        variant="outlined"
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        value={producto.nombre || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                        variant="outlined"
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Stock"
                        name="stock"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={producto.stock || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                        variant="outlined"
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Precio"
                        name="precio"
                        type="number"
                        inputProps={{ min: 0, step: "0.01" }}
                        value={producto.precio || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                        variant="outlined"
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                        <InputLabel>Proveedor</InputLabel>
                        <Select
                            name="proveedorId"
                            value={producto.proveedor ? producto.proveedor.id : ''}
                            onChange={handleInputChange}
                            label="Proveedor"
                            variant="outlined"
                            disabled={loading}
                        >
                            <MenuItem value="">
                                <em>Seleccione un proveedor</em>
                            </MenuItem>
                            {proveedores.map((proveedor) => (
                                <MenuItem key={proveedor.id} value={proveedor.id}>
                                    {proveedor.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {errorMessage && (
                    <div style={{ 
                        padding: '12px',
                        marginBottom: '16px',
                        backgroundColor: '#fff2f0',
                        border: '1px solid #ffccc7',
                        borderRadius: '4px',
                        color: '#ff4d4f'
                    }}>
                        {errorMessage}
                    </div>
                )}
            </form>
        </Modal>
    );
};

export default EditProducto;