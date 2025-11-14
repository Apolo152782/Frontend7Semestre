import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { TextField, MenuItem, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const EditClientes = ({
    cliente,
    handleInputChange,
    closeModal,
    saveChanges,
    isEditMode,
    errorMessage,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    return (
        <Modal
            title={
                <Typography variant="h5" component="h2" style={{ margin: 0 }}>
                    {isEditMode ? 'Editar Cliente' : 'Crear Cliente'}
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
                >
                    {isEditMode ? 'Guardar Cambios' : 'Crear Cliente'}
                </Button>,
            ]}
            style={{
                top: isMobile ? '20px' : '50px',
            }}
            bodyStyle={{
                padding: isMobile ? '16px' : '24px',
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
        >
            <form autoComplete="off" onClick={(e) => e.stopPropagation()}>
                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Cédula"
                        name="dni"
                        value={cliente.dni || ''}
                        onChange={handleInputChange}
                        inputProps={{ maxLength: 11 }}
                        size={isMobile ? 'small' : 'medium'}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        value={cliente.nombre || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Edad"
                        name="edad"
                        value={cliente.edad || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        name="genero"
                        select
                        label="Género"
                        value={cliente.genero || ''}
                        onChange={handleInputChange}
                        fullWidth
                        size={isMobile ? 'small' : 'medium'}
                    >
                        <MenuItem value="" disabled>Seleccione un género</MenuItem>
                        <MenuItem value="Masculino">Masculino</MenuItem>
                        <MenuItem value="Femenino">Femenino</MenuItem>
                        <MenuItem value="Otro">Otro</MenuItem>
                    </TextField>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Teléfono"
                        name="telefono"
                        value={cliente.telefono || ''}
                        onChange={handleInputChange}
                        inputProps={{ maxLength: 15 }}
                        size={isMobile ? 'small' : 'medium'}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Dirección"
                        name="direccion"
                        value={cliente.direccion || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Descripción"
                        name="razon"
                        value={cliente.razon || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                    />
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

export default EditClientes;