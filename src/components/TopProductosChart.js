import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { TrendingUp } from '@mui/icons-material';
import { styled } from '@mui/system';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

const TopProductosChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Cargando datos...',
      data: [],
      backgroundColor: '#f3f3f3'
    }]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/graficos/top-productos');

        setChartData({
          labels: response.data.map(item => item[0]),
          datasets: [{
            label: 'Unidades Vendidas',
            data: response.data.map(item => item[1]),
            backgroundColor: [
              '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7'
            ],
            borderColor: [
              '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7'
            ],
            borderWidth: 2,
            borderRadius: 6
          }]
        });

      } catch (error) {
        console.error("Error:", error);
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
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
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
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
          drawBorder: false
        },
        ticks: {
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
          <TrendingUp style={{ color: '#5F6CAF', fontSize: '24px' }} />
        </IconContainer>
        <div>
          <h3 style={{
            margin: 0,
            color: '#5F6CAF',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            TOP PRODUCTOS
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            color: '#888',
            fontSize: '13px'
          }}>
            Productos más vendidos este mes
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
          <Bar
            data={chartData}
            options={options}
          />
        </div>
      )}
    </ChartContainer>
  );
};

export default TopProductosChart;