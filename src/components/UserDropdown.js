import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Avatar, 
  Typography, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LogoutIcon from '@mui/icons-material/Logout';

const UserDropdown = ({ userData, onLogout }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const userKey = `avatar_${userData.id || userData.nombre}`;
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Estado para la imagen del avatar
    const [imagen, setImagen] = useState(() => {
        return localStorage.getItem(userKey) || '/static/images/avatar/default.jpg';
    });

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const manejarCambioDeImagen = (event) => {
        const archivo = event.target.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const nuevaImagen = reader.result;
                setImagen(nuevaImagen);
                localStorage.setItem(userKey, nuevaImagen);
            };
            reader.readAsDataURL(archivo);
        }
        handleMenuClose();
    };

    const handleLogout = () => {
        onLogout();
        handleMenuClose();
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Información del usuario - Siempre visible pero responsive */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-end',
                mr: 1,
                maxWidth: isSmallScreen ? '100px' : '180px'
            }}>
                <Typography 
                    variant="subtitle2" 
                    fontWeight="600" 
                    noWrap
                    sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                    }}
                >
                    {userData.nombre}
                </Typography>
                {!isSmallScreen && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                        {userData.rol}
                    </Typography>
                )}
            </Box>

            {/* Avatar con menú */}
            <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ 
                    p: 0,
                    '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s ease'
                    }
                }}
            >
                <Avatar 
                    src={imagen} 
                    sx={{ 
                        width: 40, 
                        height: 40,
                        border: '2px solid',
                        borderColor: 'divider'
                    }} 
                />
            </IconButton>

            {/* Menú desplegable */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        width: 250,
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        overflow: 'visible',
                        mt: 1.5,
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* Encabezado del menú */}
                <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                    <Avatar
                        src={imagen}
                        sx={{
                            width: 64,
                            height: 64,
                            mx: 'auto',
                            mb: 1,
                            border: '2px solid',
                            borderColor: 'divider'
                        }}
                    />
                    <Typography variant="subtitle1" fontWeight="600" noWrap>
                        {userData.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {userData.rol}
                    </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Opción para cambiar avatar */}
                <MenuItem onClick={() => fileInputRef.current.click()}>
                    <ListItemIcon>
                        <PhotoCameraIcon fontSize="small" />
                    </ListItemIcon>
                    Cambiar avatar
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={manejarCambioDeImagen}
                    />
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                {/* Opción para cerrar sesión */}
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'inherit' }}>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesión
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default UserDropdown;