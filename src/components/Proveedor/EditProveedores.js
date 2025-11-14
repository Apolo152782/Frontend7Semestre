import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { TextField, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const EditProveedores = ({
    proveedor,
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
                <Typography variant="h5" component="h2" style={{ margin: 0, fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
                    {isEditMode ? 'Editar Proveedor' : 'Datos del Proveedor'}
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
                    {isEditMode ? 'Guardar Cambios' : 'Crear Proveedor'}
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
                        label="Cédula/RUC"
                        name="ruc"
                        value={proveedor.ruc || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                        variant="outlined"
                        inputProps={{
                            maxLength: 13,
                            pattern: '[0-9]*'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        value={proveedor.nombre || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                        variant="outlined"
                        inputProps={{
                            maxLength: 100
                        }}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Teléfono"
                        name="telefono"
                        value={proveedor.telefono || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                        variant="outlined"
                        inputProps={{
                            inputMode: 'tel',
                            maxLength: 15,
                            pattern: '[0-9]*'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Dirección"
                        name="direccion"
                        value={proveedor.direccion || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                        variant="outlined"
                        inputProps={{
                            maxLength: 200
                        }}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <TextField
                        fullWidth
                        label="Descripción/Razón Social"
                        name="razon"
                        value={proveedor.razon || ''}
                        onChange={handleInputChange}
                        size={isMobile ? 'small' : 'medium'}
                        variant="outlined"
                        inputProps={{
                            maxLength: 200
                        }}
                        multiline
                        rows={3}
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

export default EditProveedores;