import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import {
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    Link,
    Backdrop,
    CircularProgress,
    useMediaQuery,
    useTheme
} from '@mui/material';

const Login = ({ onLoginSuccess }) => {
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://backend-stackflow-a9cqgjede9hbgch7.centralus-01.azurewebsites.net/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    correo: correo,
                    pass: pass,
                }),
            });

            const text = await response.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error(text);
            }

            if (!response.ok) {
                throw new Error(data.message || 'Error en las credenciales');
            }

            setLoading(true);
            setMessage('Login exitoso');

            setTimeout(() => {
                localStorage.setItem('usuario', JSON.stringify({ nombre: data.nombre }));
                onLoginSuccess(data);
            }, 1500);

        } catch (error) {
            setMessage(error.message || 'Error de conexión con el servidor');
            console.error('Error:', error);
        }
    };

    const requestPin = () => {
        Swal.fire({
            title: 'Ingrese el PIN',
            input: 'password',
            inputLabel: 'PIN',
            inputPlaceholder: 'Ingrese el PIN para acceder a este apartado',
            inputAttributes: {
                maxlength: 10,
                autocapitalize: 'off',
                autocorrect: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            preConfirm: (pin) => {
                if (pin === '1234') {
                    Swal.fire('Acceso concedido', '', 'success');
                    navigate('/Usuario/CreateUser');
                } else {
                    Swal.showValidationMessage('PIN incorrecto. Inténtelo de nuevo.');
                }
            },
        });
    };

    return (
        <Box
            className="background-radial-gradient"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: isSmallScreen ? 2 : 5,
                px: 2
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                    mx: 'auto',
                    px: isSmallScreen ? 2 : 4
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        alignItems: 'center',
                        gap: 4
                    }}
                >
                    {/* Left Column - Welcome Message */}
                    <Box
                        sx={{
                            flex: 1,
                            textAlign: isSmallScreen ? 'center' : 'left',
                            mb: isSmallScreen ? 4 : 0,
                            px: isSmallScreen ? 2 : 0
                        }}
                    >
                        <Typography
                            variant={isSmallScreen ? 'h4' : 'h2'}
                            sx={{
                                fontWeight: 'bold',
                                color: '#e5a60d',
                                mb: 2
                            }}
                        >
                            STACKFLOW
                        </Typography>
                        <Typography
                            variant={isSmallScreen ? 'h6' : 'h5'}
                            sx={{
                                color: 'hsl(218, 81%, 95%)',
                                mb: 1
                            }}
                        >
                            El mejor sistema de ventas
                        </Typography>
                        <Typography
                            variant={isSmallScreen ? 'h5' : 'h4'}
                            sx={{
                                color: '#c18cf3',
                                fontWeight: 'bold'
                            }}
                        >
                            para tu NEGOCIO
                        </Typography>
                    </Box>

                    {/* Right Column - Login Form */}
                    <Box
                        sx={{
                            flex: 1,
                            position: 'relative',
                            maxWidth: isSmallScreen ? '100%' : '400px',
                            minWidth: isSmallScreen ? 'auto' : '350px'
                        }}
                    >
                        {/* Decorative shapes */}
                        <Box
                            sx={{
                                position: 'absolute',
                                height: '220px',
                                width: '220px',
                                top: '-60px',
                                left: '-130px',
                                background: 'radial-gradient(#44006b, #ad1fff)',
                                borderRadius: '50%',
                                zIndex: 1,
                                display: isSmallScreen ? 'none' : 'block'
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                borderRadius: '38% 62% 63% 37% / 70% 33% 67% 30%',
                                bottom: '-60px',
                                right: '-90px',
                                width: '300px',
                                height: '300px',
                                background: 'radial-gradient(#44006b, #ad1fff)',
                                zIndex: 1,
                                display: isSmallScreen ? 'none' : 'block'
                            }}
                        />

                        {/* Login Form */}
                        <Box
                            sx={{
                                backgroundColor: 'white',
                                padding: isSmallScreen ? 3 : 4,
                                borderRadius: 3,
                                boxShadow: 4,
                                width: '100%',
                                position: 'relative',
                                zIndex: 2
                            }}
                        >
                            <form onSubmit={handleSubmit}>
                                <Typography
                                    variant={isSmallScreen ? 'h5' : 'h4'}
                                    component="h1"
                                    gutterBottom
                                    align="center"
                                    sx={{ mb: 3 }}
                                >
                                    Iniciar sesión
                                </Typography>

                                <TextField
                                    label="Correo electrónico"
                                    variant="outlined"
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    size={isSmallScreen ? 'small' : 'medium'}
                                />

                                <TextField
                                    label="Contraseña"
                                    variant="outlined"
                                    type="password"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    size={isSmallScreen ? 'small' : 'medium'}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        mt: 2,
                                        mb: 2,
                                        py: isSmallScreen ? 1 : 1.5,
                                        fontSize: isSmallScreen ? '0.875rem' : '1rem'
                                    }}
                                >
                                    Iniciar sesión
                                </Button>

                                {message && (
                                    <Alert
                                        severity={message === 'Login exitoso' ? 'success' : 'error'}
                                        sx={{ mb: 2 }}
                                    >
                                        {message}
                                    </Alert>
                                )}

                                <Box textAlign="center" sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        ¿No tienes una cuenta?
                                    </Typography>
                                    <Link
                                        component="button"
                                        underline="hover"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            requestPin();
                                        }}
                                        color="primary"
                                        sx={{ fontSize: isSmallScreen ? '0.875rem' : '1rem' }}
                                    >
                                        Registrar aquí
                                    </Link>
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Loading Backdrop */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Global Styles */}
            <style jsx global>{`
                html, body {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                }

                .background-radial-gradient {
                    background: hsl(218, 41%, 15%);
                    background-image: 
                        radial-gradient(800px circle at 0% 0%,
                            hsl(218, 41%, 35%) 15%,
                            hsl(218, 41%, 30%) 35%,
                            hsl(218, 41%, 20%) 75%,
                            hsl(218, 41%, 19%) 80%,
                            transparent 100%),
                        radial-gradient(1250px circle at 100% 100%,
                            hsl(218, 41%, 45%) 15%,
                            hsl(218, 41%, 30%) 35%,
                            hsl(218, 41%, 20%) 75%,
                            hsl(218, 41%, 19%) 80%,
                            transparent 100%);
                }
            `}</style>
        </Box>
    );
};

export default Login;