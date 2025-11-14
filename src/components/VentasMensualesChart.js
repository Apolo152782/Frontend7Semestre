import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { ShowChart } from '@mui/icons-material';
import { styled } from '@mui/system';

// Registra componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ChartContainer = styled('div')(({ theme }) => ({
    width: '100%',
    minWidth: '400px',
    height: '400px',
    margin: '10px 1% 20px 0',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.03)',
    float: 'left',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)'
    }
}));

const ChartHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(0,0,0,0.05)'
}));

const IconContainer = styled('div')(({ theme }) => ({
    backgroundColor: '#5F6CAF20',
    borderRadius: '12px',
    padding: '8px',
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const VentasMensualesChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/graficos/ventas-mensuales');
                const data = response.data;

                setChartData({
                    labels: data.map(item => item[0]),
                    datasets: [{
                        label: 'Ventas Totales',
                        data: data.map(item => item[1]),
                        borderColor: '#5F6CAF',
                        backgroundColor: '#5F6CAF30',
                        tension: 0.3,
                        fill: true,
                        borderWidth: 3,
                        pointRadius: 5,
                        pointBackgroundColor: '#5F6CAF'
                    }]
                });
            } catch (error) {
                console.error("Error cargando datos:", error);
                setChartData({
                    labels: ['Error'],
                    datasets: [{
                        label: 'Datos no disponibles',
                        data: [1],
                        backgroundColor: '#FFCCD5'
                    }]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,
                    font: {
                        size: 11,
                        family: "'Segoe UI', sans-serif"
                    },
                    padding: 20,
                    usePointStyle: true
                }
            },
            title: {
                display: false // Ocultamos el título para usar nuestro header personalizado
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                callbacks: {
                    label: (context) => `$${context.parsed.y.toLocaleString()}`
                },
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                    drawBorder: false
                },
                ticks: {
                    callback: (value) => `$${value.toLocaleString()}`,
                    font: {
                        size: 10,
                        family: "'Segoe UI', sans-serif"
                    },
                    color: '#666'
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 10,
                        family: "'Segoe UI', sans-serif"
                    },
                    color: '#666'
                }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart'
        }
    };

    return (
        <ChartContainer>
            <ChartHeader>
                <IconContainer>
                    <ShowChart style={{ color: '#5F6CAF', fontSize: '24px' }} />
                </IconContainer>
                <div>
                    <h3 style={{
                        margin: 0,
                        color: '#5F6CAF',
                        fontSize: '18px',
                        fontWeight: '600'
                    }}>
                        VENTAS MENSUALES
                    </h3>
                    <p style={{
                        margin: '4px 0 0 0',
                        color: '#888',
                        fontSize: '13px'
                    }}>
                        Tendencia de ventas últimos meses
                    </p>
                </div>
            </ChartHeader>

            {loading ? (
                <div style={{
                    height: 'calc(100% - 60px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888'
                }}>
                    <p>Cargando datos...</p>
                </div>
            ) : (
                <div style={{ height: 'calc(100% - 60px)' }}>
                    <Line
                        data={chartData}
                        options={options}
                    />
                </div>
            )}
        </ChartContainer>
    );
};

export default VentasMensualesChart;