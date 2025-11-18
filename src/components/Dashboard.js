import React from 'react';
import TopProductosChart from './TopProductosChart';
import VentasMensualesChart from './VentasMensualesChart';


const Dashboard = () => {
    return (
        <div style={{
            padding: '10px',
            marginTop: '10px',
            minHeight: 'calc(100vh - 100px)',
            backgroundColor: '#f8f9fa',
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                gap: '25px',
                marginBottom: '40px',
            }}>
                {/* --- Tarjeta 1: Top Productos --- */}
                <div style={cardStyle}>
                    <h2 style={titleStyle}>📊 Productos Más Vendidos</h2>
                    <TopProductosChart />
                </div>

                {/* --- Tarjeta 2: Ventas Mensuales --- */}
                <div style={cardStyle}>
                    <h2 style={titleStyle}>💰 Ventas Mensuales</h2>
                    <VentasMensualesChart />
                </div>
            </div>
        </div>
    );
};

// Estilos reutilizables
const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid #e0e0e0',
    ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
    }
};

const titleStyle = {
    color: '#333',
    fontSize: '1.4rem',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

export default Dashboard;
