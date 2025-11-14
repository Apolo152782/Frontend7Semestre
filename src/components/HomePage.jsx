import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import GeminiChat from './GeminiChat';


import ImagenFondo from './imagenes/InicioImagen.jpeg';
const HomePage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Simular carga de datos
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            title: "Gestión de Clientes",
            description: "Administra tu base de clientes, historial de compras y preferencias. Mantén un seguimiento detallado de cada interacción.",
            icon: "people-fill",
            color: "#007AFF"
        },
        {
            title: "Control de Inventario",
            description: "Seguimiento en tiempo real de productos, alertas de stock bajo y gestión de proveedores integrada.",
            icon: "clipboard2-data-fill",
            color: "#34C759"
        },
        {
            title: "Ventas y Facturación",
            description: "Proceso de venta simplificado, múltiples formas de pago y generación automática de facturas.",
            icon: "receipt-cutoff",
            color: "#FF2D55"
        },
        {
            title: "Reportes Detallados",
            description: "Analítica avanzada, reportes personalizados y métricas clave para tomar mejores decisiones.",
            icon: "bar-chart-line-fill",
            color: "#AF52DE"
        },
        {
            title: "Gestión de Proveedores",
            description: "Administra tus proveedores, órdenes de compra y mantén un registro de todas las transacciones.",
            icon: "truck",
            color: "#FF9500"
        },
        {
            title: "Seguridad Avanzada",
            description: "Protección de datos, múltiples niveles de acceso y respaldo automático de información.",
            icon: "shield-lock-fill",
            color: "#5856D6"
        }
    ];

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Estilos dinámicos
    const styles = {
        app: {
            backgroundColor: darkMode ? '#121212' : '#ffffff',
            minHeight: '100vh',
            transition: 'background-color 0.5s ease'
        },
        heroSection: {
            background: darkMode
                ? 'linear-gradient(135deg, #2c3e50, #1a1a1a)'
                : 'linear-gradient(135deg, #6e8efb, #a777e3)',
            color: darkMode ? '#f5f5f7' : 'white'
        },
        card: {
            backgroundColor: darkMode ? '#1e1e1e' : 'white',
            border: 'none',
            borderRadius: '20px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            opacity: 1,
            animation: 'fadeIn 0.6s ease forwards'
        },
        cardHover: {
            transform: 'scale(1.03)',
            boxShadow: darkMode
                ? '0 15px 35px rgba(0,0,0,0.3)'
                : '0 15px 35px rgba(0,0,0,0.1)'
        },
        textColor: {
            color: darkMode ? '#f5f5f7' : '#1c1c1e'
        },
        mutedText: {
            color: darkMode ? '#a1a1a6' : '#636366'
        },
        contactCard: {
            backgroundColor: darkMode ? '#2c2c2e' : '#f5f5f7',
            borderRadius: '20px'
        }
    };

    // CSS para las animaciones
    const animationStyles = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .loading-card {
            background: ${darkMode ? '#2c2c2e' : '#f5f5f7'} !important;
            position: relative;
            overflow: hidden;
        }
        
        .loading-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                90deg,
                transparent,
                ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'},
                transparent
            );
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
    `;

    return (
        <div style={styles.app}>
            <style>{animationStyles}</style>

            {/* Botón de modo oscuro */}
            <Button
                onClick={toggleDarkMode}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: darkMode ? '#f5f5f7' : '#1c1c1e',
                    color: darkMode ? '#1c1c1e' : '#f5f5f7',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
            >
                <i className={`bi bi-${darkMode ? 'sun' : 'moon'}`}></i>
            </Button>
            {/* Hero Section - Versión Corregida */}
            <section
                className="d-flex justify-content-center align-items-center"
                style={{
                    backgroundImage: `url(${ImagenFondo})`,
                    backgroundSize: 'cover', // 🚀 Cambiado de '70% auto' a 'cover'
                    backgroundPosition: 'center',

                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                    padding: '120px 0',
                    position: 'relative',
                    overflow: 'hidden' // 🚀 Clave para eliminar bordes
                }}
            >
                {/* Overlay dinámico (ajustado) */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: darkMode
                            ? 'rgba(0, 0, 0, 0.7)' // 🚀 Opacidad aumentada
                            : 'rgba(110, 142, 251, 0.6)',
                        zIndex: 1
                    }}
                />

                {/* Contenido del texto (inalterado) */}
                <Container style={{ position: 'relative', zIndex: 2 }}>
                    <Row>
                        <Col lg={8} className="mx-auto text-center">
                            <h1 className="mb-4" style={{
                                fontWeight: 700,
                                color: 'white',
                                fontSize: '3.5rem',
                                textShadow: darkMode
                                    ? '0 4px 12px rgba(0, 0, 0, 0.9)' // 🚀 Sombra más intensa en oscuro
                                    : '0 2px 8px rgba(0, 0, 0, 0.6)'
                            }}>
                                Bienvenido a StackFlow
                            </h1>

                            <h2 style={{
                                fontWeight: 500,
                                color: 'white',
                                fontSize: '1.8rem',
                                textShadow: darkMode
                                    ? '0 2px 6px rgba(0, 0, 0, 0.8)'
                                    : '0 1px 4px rgba(0, 0, 0, 0.5)'
                            }}>
                                Sistema de punto de venta intuitivo y eficiente para tu negocio
                            </h2>
                        </Col>
                    </Row>
                </Container>
            </section>
            {/* Features Section */}
            <section style={{
                padding: '80px 0',
                backgroundColor: darkMode ? '#121212' : '#f5f5f7',
                transition: 'background-color 0.5s ease'
            }}>
                <Container>
                    <Row className="justify-content-center mb-5">
                        <Col lg={8} className="text-center">
                            <h2 className="mb-4" style={{
                                fontWeight: 600,
                                color: styles.textColor.color
                            }}>Características del Sistema</h2>
                            <p className="lead" style={{ color: styles.mutedText.color }}>
                                Descubre todas las herramientas que StackFlow tiene para optimizar tu negocio
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        {isLoading ? (
                            // Esqueleto de carga
                            Array.from({ length: 6 }).map((_, index) => (
                                <Col key={index} lg={4} md={6} className="mb-4">
                                    <Card className="h-100 loading-card" style={{
                                        height: '250px',
                                        borderRadius: '20px'
                                    }}></Card>
                                </Col>
                            ))
                        ) : (
                            // Contenido real
                            features.map((feature, index) => (
                                <Col key={index} lg={4} md={6} className="mb-4">
                                    <Card
                                        className="h-100 border-0"
                                        style={styles.card}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = styles.cardHover.transform;
                                            e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = styles.card.transform;
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <Card.Body className="p-4">
                                            <div className="mb-3" style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                backgroundColor: `${feature.color}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <i className={`bi bi-${feature.icon}`} style={{
                                                    fontSize: '1.5rem',
                                                    color: feature.color
                                                }}></i>
                                            </div>
                                            <Card.Title style={{
                                                color: styles.textColor.color,
                                                fontWeight: 600,
                                                marginBottom: '12px'
                                            }}>{feature.title}</Card.Title>
                                            <Card.Text style={{
                                                color: styles.mutedText.color,
                                                lineHeight: '1.5'
                                            }}>{feature.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </Container>
            </section>

            {/* Contact Section */}
            <section style={{
                backgroundColor: darkMode ? '#121212' : '#ffffff',
                padding: '80px 0',
                transition: 'background-color 0.5s ease'
            }}>
                <Container>
                    <Row className="justify-content-center mb-5">
                        <Col lg={12} className="text-center">
                            <h2 className="mb-4" style={{
                                fontWeight: 600,
                                color: styles.textColor.color
                            }}>Ponte en contacto con nosotros</h2>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={5} className="mb-4 mb-lg-0">
                            <iframe
                                title="Mapa"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.9802727946085!2d-75.53603372520038!3d10.423139889704942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef62f82209502bf%3A0xfac5cd83a1d9d78b!2sCra.%2018b%20%2334-22%2C%20Amador%2C%20Cartagena%20de%20Indias%2C%20Provincia%20de%20Cartagena%2C%20Bol%C3%ADvar!5e0!3m2!1ses-419!2sco!4v1743903282156!5m2!1ses-419!2sco"
                                width="100%"
                                height="300"
                                style={{
                                    border: 0,
                                    borderRadius: '20px',
                                    boxShadow: darkMode
                                        ? '0 4px 20px rgba(0,0,0,0.3)'
                                        : '0 4px 20px rgba(0,0,0,0.05)'
                                }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </Col>

                        <Col lg={3} md={6} className="mb-4 mb-lg-0 mb-md-0 ms-auto">
                            <div style={{
                                ...styles.contactCard,
                                padding: '25px',
                                height: '100%',
                                transition: 'all 0.5s ease'
                            }}>
                                <h4 className="mb-3" style={{
                                    fontWeight: 600,
                                    color: styles.textColor.color
                                }}>Oficina Central</h4>
                                <p style={{ color: styles.mutedText.color }}>Cra. 18b #34-22,Cartagena, Bolivar 131020, Colombia</p>
                                <hr style={{
                                    borderColor: darkMode ? '#3a3a3c' : '#e5e5ea',
                                    opacity: 0.5
                                }} />
                                <p className="d-flex align-items-center mb-2">
                                    <span className="me-2" style={{ color: styles.mutedText.color }}>Teléfono:</span>
                                    <a href="tel:305-240-9671" style={{
                                        color: '#007AFF',
                                        textDecoration: 'none'
                                    }}>
                                        305-240-9671
                                    </a>
                                </p>
                                <p className="d-flex align-items-center mb-0">
                                    <span className="me-2" style={{ color: styles.mutedText.color }}>Correo:</span>
                                    <a href="contacto@stackflow.com" style={{
                                        color: '#007AFF',
                                        textDecoration: 'none'
                                    }}>
                                        Contacto@stackflow.com
                                    </a>
                                </p>
                            </div>
                        </Col>

                        <Col lg={3} md={6} className="mx-auto">
                            <div style={{
                                ...styles.contactCard,
                                padding: '25px',
                                height: '100%',
                                transition: 'all 0.5s ease'
                            }}>
                                <h4 className="mb-3" style={{
                                    fontWeight: 600,
                                    color: styles.textColor.color
                                }}>Arjona office</h4>
                                <p style={{ color: styles.mutedText.color }}>Cr 39 53B-61, Arjona, Bolivar 131020, Colombia</p>
                                <hr style={{
                                    borderColor: darkMode ? '#3a3a3c' : '#e5e5ea',
                                    opacity: 0.5
                                }} />
                                <p className="d-flex align-items-center mb-2">
                                    <span className="me-2" style={{ color: styles.mutedText.color }}>Teléfono</span>
                                    <a href="telefono" style={{
                                        color: '#007AFF',
                                        textDecoration: 'none'
                                    }}>
                                        300-534-0917
                                    </a>
                                </p>
                                <p className="d-flex align-items-center mb-0">
                                    <span className="me-2" style={{ color: styles.mutedText.color }}>Email</span>
                                    <a href="mailto:info@company.com" style={{
                                        color: '#007AFF',
                                        textDecoration: 'none'
                                    }}>
                                        stackflow@company.com
                                    </a>
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <GeminiChat />

            <footer style={{
                backgroundColor: darkMode ? '#1c1c1e' : '#f1f1f1',
                padding: '30px 0',
                marginTop: '60px',
                textAlign: 'center',
                color: darkMode ? '#a1a1a6' : '#636366'
            }}>
                <div className="mb-3">
                    <a href="https://web.facebook.com/?locale=es_LA&_rdc=1&_rdr#" target="_blank" rel="noreferrer" className="me-3 text-decoration-none" style={{ color: darkMode ? '#f5f5f7' : '#1c1c1e' }}>
                        <i className="bi bi-facebook" style={{ fontSize: '1.5rem' }}></i>
                    </a>
                    <a href="https://x.com/f_stack65814" target="_blank" rel="noreferrer" className="me-3 text-decoration-none" style={{ color: darkMode ? '#f5f5f7' : '#1c1c1e' }}>
                        <i className="bi bi-twitter-x" style={{ fontSize: '1.5rem' }}></i>
                    </a>
                    <a href="https://www.instagram.com/stackfloww/" target="_blank" rel="noreferrer" className="me-3 text-decoration-none" style={{ color: darkMode ? '#f5f5f7' : '#1c1c1e' }}>
                        <i className="bi bi-instagram" style={{ fontSize: '1.5rem' }}></i>
                    </a>
                </div>
                <small>&copy; {new Date().getFullYear()} StackFlow. Todos los derechos reservados.</small>
            </footer>

        </div>
    );
};

export default HomePage;