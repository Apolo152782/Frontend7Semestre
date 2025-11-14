import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router-dom';
import { 
  FormControl, 
  InputLabel, 
  OutlinedInput, 
  InputAdornment, 
  IconButton, 
  TextField, 
  MenuItem,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CreateUser = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [rol, setRol] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuario = {
            nombre,
            correo,
            pass,
            rol
        };

        const response = await fetch('http://localhost:8080/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });

        if (response.ok) {
            Swal.fire({
                title: 'Registro exitoso',
                text: 'El usuario ha sido registrado correctamente',
                icon: 'success',
                confirmButtonText: 'Ir al inicio',
                showCancelButton: true,
                cancelButtonText: 'Seguir registrando',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });

            setNombre('');
            setCorreo('');
            setPass('');
            setRol('');
        } else {
            Swal.fire('Error', 'Hubo un problema al registrar el usuario', 'error');
        }
    };

    const handleClick = () => {
        navigate('/');
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const isFormValid = () => {
        return nombre && correo && pass && rol;
    };

    return (
        <Box 
            className="background-radial-gradient"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                py: isSmallScreen ? 2 : 4,
                px: 2,
                position: 'relative'
            }}
        >
            {/* Back Button */}
            <Button
                variant="contained"
                color="secondary"
                onClick={handleClick}
                sx={{
                    position: 'absolute',
                    top: isSmallScreen ? 16 : 24,
                    right: isSmallScreen ? 16 : 24,
                    zIndex: 2
                }}
            >
                Regresar al inicio
            </Button>

            <Box 
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    alignItems: 'center',
                    gap: isSmallScreen ? 4 : 8,
                    my: 4
                }}
            >
                {/* Left Column - Welcome Message */}
                <Box 
                    sx={{
                        flex: 1,
                        textAlign: isSmallScreen ? 'center' : 'left',
                        color: 'white',
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

                {/* Right Column - Form */}
                <Box 
                    sx={{ 
                        flex: 1,
                        position: 'relative',
                        maxWidth: isSmallScreen ? '100%' : '500px',
                        minWidth: isSmallScreen ? 'auto' : '400px'
                    }}
                >
                    {/* Decorative shapes - Hidden on small screens */}
                    {!isSmallScreen && (
                        <>
                            <Box 
                                sx={{
                                    position: 'absolute',
                                    height: '220px',
                                    width: '220px',
                                    top: '-60px',
                                    left: '-130px',
                                    background: 'radial-gradient(#44006b, #ad1fff)',
                                    borderRadius: '50%',
                                    zIndex: 1
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
                                    zIndex: 1
                                }}
                            />
                        </>
                    )}

                    {/* Form Container */}
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
                        <Typography 
                            variant={isSmallScreen ? 'h5' : 'h4'} 
                            component="h1" 
                            gutterBottom 
                            align="center"
                            sx={{ mb: 4 }}
                        >
                            Crear una cuenta
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    label="Nombre"
                                    variant="outlined"
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    fullWidth
                                    size={isSmallScreen ? 'small' : 'medium'}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    label="Correo"
                                    variant="outlined"
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    fullWidth
                                    size={isSmallScreen ? 'small' : 'medium'}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <FormControl variant="outlined" fullWidth size={isSmallScreen ? 'small' : 'medium'}>
                                    <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                                    <OutlinedInput
                                        type={showPassword ? 'text' : 'password'}
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Contraseña"
                                    />
                                </FormControl>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <TextField
                                    select
                                    label="Seleccionar un rol"
                                    value={rol}
                                    onChange={(e) => setRol(e.target.value)}
                                    fullWidth
                                    size={isSmallScreen ? 'small' : 'medium'}
                                >
                                    <MenuItem value="" disabled>Roles</MenuItem>
                                    <MenuItem value="Administrador">Administrador</MenuItem>
                                    <MenuItem value="Empleado">Empleado</MenuItem>
                                </TextField>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={!isFormValid()}
                                sx={{
                                    py: isSmallScreen ? 1 : 1.5,
                                    fontSize: isSmallScreen ? '0.875rem' : '1rem'
                                }}
                            >
                                Registrar
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Box>

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

export default CreateUser;