import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import UserDropdown from './UserDropdown';

import { ChartColumnBig, LayoutPanelLeft, ChartSpline, ShoppingCart, UsersRound, Package2, ChartNetwork, Handshake } from 'lucide-react';

import Logo from './imagenes/StackFlowLogo.png';

const Inicio = ({ userData, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [selectorStyle, setSelectorStyle] = useState({});
  const [showVentasDropdown, setShowVentasDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dropdownRef = useRef(null);

  // Definimos los breakpoints para mejor manejo
  const breakpoints = {
    mobile: 640,
    tablet: 1024,
    desktop: 1025
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Cerrar menú móvil si se redimensiona a un tamaño mayor
      if (window.innerWidth > breakpoints.tablet) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints.tablet]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowVentasDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const allLinks = menuRef.current?.querySelectorAll('.nav-link');
    if (!allLinks) return;

    const activeLink = [...allLinks].find(link => {
      const path = location.pathname;
      const isVenta = path.includes('/Venta') && link.textContent.trim() === 'Ventas';
      const isMatch = link.classList.contains('active');
      return isVenta || isMatch;
    });

    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      setSelectorStyle({
        width: `${rect.width}px`,
        left: `${rect.left - menuRect.left}px`,
      });
    }
  }, [location.pathname, mobileMenuOpen]);

  const linkMotion = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 300 }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setShowVentasDropdown(false); // Cerrar dropdown al abrir/cerrar menú móvil
  };

  const toggleVentasDropdown = () => {
    setShowVentasDropdown(!showVentasDropdown);
  };

  // Función para determinar el tamaño de dispositivo
  const getDeviceType = () => {
    if (windowWidth <= breakpoints.mobile) return 'mobile';
    if (windowWidth <= breakpoints.tablet) return 'tablet';
    return 'desktop';
  };

  const deviceType = getDeviceType();

  return (
    <nav style={{
      backgroundColor: '#f8f9fa',
      padding: deviceType === 'mobile' ? '0 1rem' : '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      width: '100%',
      height: deviceType === 'mobile' ? '60px' : '66px',
      top: 0,
      zIndex: 1000,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: deviceType === 'mobile' ? '8px' : '10px',
        cursor: 'pointer'
      }} onClick={() => navigate('/homepage')}>
        <img src={Logo} alt="Logo" style={{
          width: deviceType === 'mobile' ? '48px' : '58px',
          height: deviceType === 'mobile' ? '44px' : '53px'
        }} />
        <span style={{
          fontWeight: 'bold',
          fontSize: deviceType === 'mobile' ? '1.4rem' : '1.7rem'
        }}>
          <span style={{ color: '#3f2569' }}>Stack</span>
          <span style={{ color: '#e5a60d' }}>Flow</span>
        </span>
      </div>

      {/* Menú Hamburguesa para móvil y tableta */}
      <div style={{ display: deviceType !== 'desktop' ? 'block' : 'none' }}>
        <button
          onClick={toggleMobileMenu}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#3f2569',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú principal */}
      <div
        ref={menuRef}
        style={{
          position: deviceType === 'desktop' ? 'relative' : 'fixed',
          display: deviceType === 'desktop' ? 'flex' : mobileMenuOpen ? 'flex' : 'none',
          flexDirection: deviceType === 'desktop' ? 'row' : 'column',
          gap: deviceType === 'mobile' ? '1rem' : '1.5rem',
          alignItems: deviceType === 'desktop' ? 'center' : 'flex-start',
          backgroundColor: deviceType !== 'desktop' ? '#f8f9fa' : 'transparent',
          top: deviceType !== 'desktop' ? (deviceType === 'mobile' ? '60px' : '66px') : 'auto',
          left: deviceType !== 'desktop' ? 0 : 'auto',
          right: deviceType !== 'desktop' ? 0 : 'auto',
          padding: deviceType !== 'desktop' ? (deviceType === 'mobile' ? '1rem' : '1.5rem 2rem') : '0',
          boxShadow: deviceType !== 'desktop' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
          zIndex: 999,
          width: deviceType !== 'desktop' ? '100%' : 'auto',
          height: deviceType !== 'desktop' ? `calc(100vh - ${deviceType === 'mobile' ? '60px' : '66px'})` : 'auto',
          overflowY: deviceType !== 'desktop' ? 'auto' : 'visible',
          justifyContent: deviceType !== 'desktop' ? 'flex-start' : 'center',
          transition: 'all 0.3s ease'
        }}
      >

        {deviceType === 'desktop' && (
          <div
            className="selector"
            style={{
              position: 'absolute',
              bottom: 0,
              height: '2px',
              backgroundColor: '#e5a60d',
              transition: 'all 0.3s ease',
              ...selectorStyle
            }}
          />
        )}

        {/* Links animados */}
        <motion.div {...linkMotion}>
          <NavLink
            to="/Homepage"
            className="nav-link"
            onClick={() => deviceType !== 'desktop' && setMobileMenuOpen(false)}
            onMouseEnter={() => setHoveredLink('Homepage')}
            onMouseLeave={() => setHoveredLink(null)}
            style={({ isActive }) => ({
              color: isActive || hoveredLink === 'Homepage' ? '#e5a60d' : '#3f2569',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '700',
              position: 'relative',
              paddingBottom: '6px',
              transition: 'color 0.3s ease',
              fontSize: deviceType === 'mobile' ? '1.1rem' : deviceType === 'tablet' ? '1.15rem' : '1rem',
              margin: deviceType !== 'desktop' ? '0.5rem 0' : '0'
            })}
          >
            <LayoutPanelLeft size={deviceType === 'mobile' ? 18 : 20} /> Inicio
          </NavLink>
        </motion.div>

        <motion.div {...linkMotion}>
          <NavLink
            to="/cliente/ShowCliente"
            className="nav-link"
            onClick={() => deviceType !== 'desktop' && setMobileMenuOpen(false)}
            onMouseEnter={() => setHoveredLink('cliente')}
            onMouseLeave={() => setHoveredLink(null)}
            style={({ isActive }) => ({
              color: isActive || hoveredLink === 'cliente' ? '#e5a60d' : '#3f2569',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '700',
              position: 'relative',
              paddingBottom: '6px',
              transition: 'color 0.3s ease',
              fontSize: deviceType === 'mobile' ? '1.1rem' : deviceType === 'tablet' ? '1.15rem' : '1rem',
              margin: deviceType !== 'desktop' ? '0.5rem 0' : '0'
            })}
          >
            <UsersRound size={deviceType === 'mobile' ? 18 : 20} /> Cliente
          </NavLink>
        </motion.div>

        {/* Ventas con Dropdown */}
        <div
          ref={dropdownRef}
          className="ventas-dropdown"
          style={{
            position: 'relative',
            paddingBottom: '6px',
            margin: deviceType !== 'desktop' ? '0.5rem 0' : '0',
            width: deviceType !== 'desktop' ? '100%' : 'auto'
          }}
        >
          <motion.div {...linkMotion}>
            <div
              onClick={toggleVentasDropdown}
              style={{
                color: location.pathname.includes('/Venta') || showVentasDropdown ? '#e5a60d' : '#3f2569',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '700',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
                fontSize: deviceType === 'mobile' ? '1.1rem' : deviceType === 'tablet' ? '1.15rem' : '1rem',
                width: deviceType !== 'desktop' ? '100%' : 'auto'
              }}
            >
              <ShoppingCart size={deviceType === 'mobile' ? 18 : 20} />
              <span className="ventas-tab nav-link" style={{ padding: 0 }}>
                Ventas
              </span>
              <FaChevronDown size={12} style={{
                transform: showVentasDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                marginLeft: 'auto'
              }} />
            </div>
          </motion.div>

          {showVentasDropdown && (
            <div style={{
              position: deviceType === 'desktop' ? 'absolute' : 'relative',
              top: deviceType === 'desktop' ? '100%' : '0',
              left: deviceType === 'desktop' ? '0' : deviceType === 'tablet' ? '1.5rem' : '1rem',
              backgroundColor: deviceType === 'desktop' ? 'white' : 'transparent',
              boxShadow: deviceType === 'desktop' ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
              borderRadius: '4px',
              padding: deviceType === 'desktop' ? '0.5rem 0' : '0.25rem 0',
              minWidth: deviceType === 'desktop' ? '200px' : 'auto',
              zIndex: 1001,
              marginTop: deviceType !== 'desktop' ? '0.5rem' : '0',
              marginLeft: deviceType !== 'desktop' ? (deviceType === 'tablet' ? '1.5rem' : '1rem') : '0',
              width: deviceType !== 'desktop' ? 'calc(100% - 2rem)' : 'auto'
            }}>
              <NavLink
                to="/Venta/VentaForm"
                className="nav-link"
                onClick={() => {
                  deviceType !== 'desktop' && setMobileMenuOpen(false);
                  setShowVentasDropdown(false);
                }}
                onMouseEnter={() => setHoveredLink('Nventa')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'Nventa' ? '#e5a60d' : '#3f2569',
                  display: 'block',
                  padding: deviceType === 'mobile' ? '0.5rem 1rem' : '0.75rem 1.25rem',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: deviceType === 'mobile' ? '1rem' : deviceType === 'tablet' ? '1.1rem' : '1rem',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease',
                  ':hover': {
                    backgroundColor: deviceType === 'desktop' ? '#f5f5f5' : 'transparent'
                  }
                })}
              >
                Nueva Venta
              </NavLink>

              {userData?.rol === 'Administrador' && (
                <>
                  <NavLink
                    to="/Venta/ShowVentas"
                    className="nav-link"
                    onClick={() => {
                      deviceType !== 'desktop' && setMobileMenuOpen(false);
                      setShowVentasDropdown(false);
                    }}
                    onMouseEnter={() => setHoveredLink('Hventa')}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={({ isActive }) => ({
                      color: isActive || hoveredLink === 'Hventa' ? '#e5a60d' : '#3f2569',
                      display: 'block',
                      padding: deviceType === 'mobile' ? '0.5rem 1rem' : '0.75rem 1.25rem',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: deviceType === 'mobile' ? '1rem' : deviceType === 'tablet' ? '1.1rem' : '1rem',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s ease',
                      ':hover': {
                        backgroundColor: deviceType === 'desktop' ? '#f5f5f5' : 'transparent'
                      }
                    })}
                  >
                    Historial de Ventas
                  </NavLink>
                  <NavLink
                    to="/Venta/ShowDetalleVenta"
                    className="nav-link"
                    onClick={() => {
                      deviceType !== 'desktop' && setMobileMenuOpen(false);
                      setShowVentasDropdown(false);
                    }}
                    onMouseEnter={() => setHoveredLink('Dventa')}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={({ isActive }) => ({
                      color: isActive || hoveredLink === 'Dventa' ? '#e5a60d' : '#3f2569',
                      display: 'block',
                      padding: deviceType === 'mobile' ? '0.5rem 1rem' : '0.75rem 1.25rem',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: deviceType === 'mobile' ? '1rem' : deviceType === 'tablet' ? '1.1rem' : '1rem',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s ease',
                      ':hover': {
                        backgroundColor: deviceType === 'desktop' ? '#f5f5f5' : 'transparent'
                      }
                    })}
                  >
                    Detalles de Ventas
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>

        {/* ADMIN-only */}
        {userData?.rol === 'Administrador' && (
          <>
            <motion.div {...linkMotion}>
              <NavLink
                to="/proveedor/ShowProveedor"
                className="nav-link"
                onClick={() => deviceType !== 'desktop' && setMobileMenuOpen(false)}
                onMouseEnter={() => setHoveredLink('proveedor')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'proveedor' ? '#e5a60d' : '#3f2569',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  position: 'relative',
                  paddingBottom: '6px',
                  transition: 'color 0.3s ease',
                  fontSize: deviceType === 'mobile' ? '1.1rem' : deviceType === 'tablet' ? '1.15rem' : '1rem',
                  margin: deviceType !== 'desktop' ? '0.5rem 0' : '0'
                })}
              >
                <Handshake size={deviceType === 'mobile' ? 18 : 20} /> Proveedor
              </NavLink>
            </motion.div>

            <motion.div {...linkMotion}>
              <NavLink
                to="/producto/ShowProducto"
                className="nav-link"
                onClick={() => deviceType !== 'desktop' && setMobileMenuOpen(false)}
                onMouseEnter={() => setHoveredLink('producto')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'producto' ? '#e5a60d' : '#3f2569',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  position: 'relative',
                  paddingBottom: '6px',
                  transition: 'color 0.3s ease',
                  fontSize: deviceType === 'mobile' ? '1.1rem' : deviceType === 'tablet' ? '1.15rem' : '1rem',
                  margin: deviceType !== 'desktop' ? '0.5rem 0' : '0'
                })}
              >
                <Package2 size={deviceType === 'mobile' ? 18 : 20} /> Productos
              </NavLink>
            </motion.div>

            <motion.div {...linkMotion}>
              <NavLink
                to="/TopProductosChart"
                className="nav-link"
                onClick={() => deviceType !== 'desktop' && setMobileMenuOpen(false)}
                onMouseEnter={() => setHoveredLink('dashboard')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'dashboard' ? '#e5a60d' : '#3f2569',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  position: 'relative',
                  paddingBottom: '6px',
                  transition: 'color 0.3s ease',
                  fontSize: deviceType === 'mobile' ? '1.1rem' : deviceType === 'tablet' ? '1.15rem' : '1rem',
                  margin: deviceType !== 'desktop' ? '0.5rem 0' : '0'
                })}
              >
                <ChartColumnBig size={deviceType === 'mobile' ? 18 : 20} /> Dashboard
              </NavLink>
            </motion.div>

            <motion.div {...linkMotion}>
              <NavLink
                to="/FormularioPrediccion"
                className="nav-link"
                onClick={() => deviceType !== 'desktop' && setMobileMenuOpen(false)}
                onMouseEnter={() => setHoveredLink('prediccion')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'prediccion' ? '#e5a60d' : '#3f2569',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  position: 'relative',
                  paddingBottom: '6px',
                  transition: 'color 0.3s ease',
                  fontSize: deviceType === 'mobile' ? '1.1rem' : deviceType === 'tablet' ? '1.15rem' : '1rem',
                  margin: deviceType !== 'desktop' ? '0.5rem 0' : '0'
                })}
              >
                <ChartSpline size={deviceType === 'mobile' ? 18 : 20} /> Prediccion
              </NavLink>
            </motion.div>

            <motion.div {...linkMotion}>
              <NavLink
                to="/PrediccionPorDni"
                className="nav-link"
                onClick={() => deviceType !== 'desktop' && setMobileMenuOpen(false)}
                onMouseEnter={() => setHoveredLink('PrediccionPorDni')}
                onMouseLeave={() => setHoveredLink(null)}
                style={({ isActive }) => ({
                  color: isActive || hoveredLink === 'PrediccionPorDni' ? '#e5a60d' : '#3f2569',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '700',
                  position: 'relative',
                  paddingBottom: '6px',
                  transition: 'color 0.3s ease',
                  fontSize: deviceType === 'mobile' ? '1.1rem' : deviceType === 'tablet' ? '1.15rem' : '1rem',
                  margin: deviceType !== 'desktop' ? '0.5rem 0' : '0'
                })}
              >
                <ChartNetwork size={deviceType === 'mobile' ? 18 : 20} /> Prediccion por C.C
              </NavLink>
            </motion.div>
          </>
        )}

        {/* UserDropdown en móvil y tableta */}
        {deviceType !== 'desktop' && userData && (
          <div style={{
            marginTop: '1rem',
            width: '100%',
            borderTop: '1px solid #e0e0e0',
            paddingTop: '1rem'
          }}>
            <UserDropdown
              userData={userData}
              onLogout={onLogout}
              mobileView={true}
              onItemClick={() => setMobileMenuOpen(false)}
            />
          </div>
        )}
      </div>

      {/* UserDropdown en desktop */}
      {deviceType === 'desktop' && userData && (
        <UserDropdown userData={userData} onLogout={onLogout} />
      )}
    </nav>
  );
};

export default Inicio;