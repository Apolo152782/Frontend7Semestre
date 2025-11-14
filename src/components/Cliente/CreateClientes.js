import { Button } from 'bootstrap';
import React from 'react';



const CreateClientes = ({ cliente, handleInputChange, closeModal, saveChanges }) => {
    return (
        <div
            className="modal show"
            style={{
                display: "block",
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                overflowY: 'auto' // Permite scroll si el contenido es muy largo
            }}
            tabIndex="-1"
            role="dialog"
        >
            <div
                className="modal-dialog"
                role="document"
                style={{
                    margin: '20px auto',
                    maxWidth: '600px', // Ancho máximo ajustable
                    maxHeight: '60vh', // Altura máxima del 80% del viewport
                    overflowY: 'auto' // Scroll interno si es necesario
                }}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Crear Cliente</h5>
                        <button type="button" className="close" onClick={closeModal} aria-label="Cerrar" style={{ position: 'absolute', right: '15px', top: '15px' }}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <label>Cédula:</label>
                            <input type="text" className="form-control" name="dni" value={cliente.dni || ''} onChange={handleInputChange} required />

                            <label className="mt-3">Nombre:</label>
                            <input type="text" className="form-control" name="nombre" value={cliente.nombre || ''} onChange={handleInputChange} required />

                            <label className="mt-3">Edad:</label>
                            <input type="number" className="form-control" name="edad" maxLength="3" value={cliente.edad || ''} onChange={handleInputChange} required />

                            <select
                                className="form-control"

                                value={cliente.genero || ''} onChange={handleInputChange} required
                            >
                                <option value="" disabled hidden>Selecciona el Genero</option>
                                <option value="efectivo">Hombre</option>
                                <option value="tarjeta">Mujer</option>
                                <option value="transferencia">Otro</option>
                            </select>

                            <label className="mt-3">Teléfono:</label>
                            <input type="text" className="form-control" name="telefono" maxLength="15" value={cliente.telefono || ''} onChange={handleInputChange} required />

                            <label className="mt-3">Dirección:</label>
                            <input type="text" className="form-control" name="direccion" value={cliente.direccion || ''} onChange={handleInputChange} required />

                            <label className="mt-3">Razón:</label>
                            <input type="text" className="form-control" name="razon" value={cliente.razon || ''} onChange={handleInputChange} required />
                        </form>
                    </div>
                    <div className="modal-footer">

                        <Button className="btn btn-success" variant="contained" onClick={saveChanges}>Crear Cliente</Button>
                        <button className="btn btn-info" onClick={closeModal}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateClientes;