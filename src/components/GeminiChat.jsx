import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Form, InputGroup, Spinner } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import ReactMarkdown from "react-markdown";

const API_BASE = "http://localhost:8080/api/gemini/chat";
const USUARIO_ID = "user-123";
const AI_NAME = "Asistente IA – Gemini";

// Saludo reutilizable
const SALUDO = { remitente: "bot", texto: "👋 ¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?" };

// Snackbar simple
function Snackbar({ text, show, type = "success" }) {
    if (!show) return null;
    const bg =
        type === "success" ? "#2e7d32" :
            type === "warning" ? "#ad6800" :
                type === "danger" ? "#c62828" :
                    "#2f2f2f";
    return (
        <div
            style={{
                position: "absolute",
                bottom: 70,
                left: "50%",
                transform: "translateX(-50%)",
                background: bg,
                color: "#fff",
                padding: "8px 14px",
                borderRadius: 10,
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                fontSize: 14,
                maxWidth: 420,
                textAlign: "center",
                pointerEvents: "none",
            }}
        >
            {text}
        </div>
    );
}

const GeminiChat = () => {
    const [prompt, setPrompt] = useState("");
    const [mensajes, setMensajes] = useState([SALUDO]);

    const [cargando, setCargando] = useState(false);
    const [cargandoHistorial, setCargandoHistorial] = useState(false);
    const [estaAbierto, setEstaAbierto] = useState(false);

    const [conversacionId, setConversacionId] = useState(() => {
        const guardado = localStorage.getItem("conversationId") || localStorage.getItem("conversacionId");
        return guardado ? Number(guardado) : null;
    });

    const [conversaciones, setConversaciones] = useState([]); // [{id,titulo,actualizadaEn}]

    // Estado del snackbar
    const [snack, setSnack] = useState({ show: false, text: "", type: "success" });
    const snackTimerRef = useRef(null);

    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);

    const showSnack = (text, type = "success", ms = 2500) => {
        setSnack({ show: true, text, type });
        if (snackTimerRef.current) clearTimeout(snackTimerRef.current);
        snackTimerRef.current = setTimeout(() => setSnack(s => ({ ...s, show: false })), ms);
    };

    useEffect(() => {
        return () => {
            if (snackTimerRef.current) clearTimeout(snackTimerRef.current);
        };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [prompt]);

    // Cargar lista de conversaciones al abrir el widget
    useEffect(() => {
        if (estaAbierto) {
            cargarConversaciones();
            // Si hay conversacionId y aún no tenemos sus mensajes (por ejemplo tras recargar la página), puedes cargar:
            if (conversacionId && mensajes.length <= 1) {
                cargarMensajes(conversacionId);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [estaAbierto]);

    const cargarConversaciones = async () => {
        try {
            const res = await fetch(`${API_BASE}/conversations?userId=${encodeURIComponent(USUARIO_ID)}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setConversaciones(data);
        } catch (e) {
            console.error("Error cargando conversaciones:", e);
            showSnack("No se pudieron cargar las conversaciones.", "warning");
        }
    };

    const cargarMensajes = async (id) => {
        setCargandoHistorial(true);
        try {
            const res = await fetch(`${API_BASE}/conversations/${id}/messages`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const adaptados = data.map((m) => ({
                remitente: m.rol === "USUARIO" ? "user" : "bot",
                texto: m.contenido,
            }));
            // Si no hay mensajes en la conversación, mostramos el saludo
            setMensajes(adaptados.length ? adaptados : [SALUDO]);
        } catch (e) {
            console.error("Error cargando mensajes:", e);
            showSnack("No se pudo cargar el historial.", "warning");
        } finally {
            setCargandoHistorial(false);
        }
    };

    const seleccionarConversacion = async (id) => {
        setConversacionId(id);
        localStorage.setItem("conversacionId", String(id));
        localStorage.setItem("conversationId", String(id)); // compat
        await cargarMensajes(id);
    };

    const nuevaConversacion = () => {
        setConversacionId(null);
        localStorage.removeItem("conversacionId");
        localStorage.removeItem("conversationId");
        setMensajes([SALUDO]);
        // Si no quieres snack aquí, comenta la línea siguiente:
        showSnack("Nueva conversación iniciada.", "info", 2000);
    };

    // Eliminar desde el ítem del sidebar
    const eliminarConversacionItem = async (e, id) => {
        e.stopPropagation(); // no seleccionar la conversación al hacer clic en la papelera
        try {
            const res = await fetch(`${API_BASE}/conversations/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setConversaciones((prev) => prev.filter((c) => c.id !== id));
            if (id === conversacionId) {
                nuevaConversacion(); // limpia chat y resetea id
            }
            showSnack("Conversación eliminada.", "success", 2500);
        } catch (e2) {
            console.error("No se pudo eliminar:", e2);
            showSnack("No se pudo eliminar la conversación.", "danger", 3000);
        }
    };

    const enviar = async () => {
        if (!prompt.trim() || cargando) return;

        const mensajeUsuario = { remitente: "user", texto: prompt };
        setMensajes((prev) => [...prev, mensajeUsuario]);
        setCargando(true);

        try {
            const res = await fetch(`${API_BASE}/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuarioId: USUARIO_ID,
                    conversacionId: conversacionId, // null => backend crea una nueva
                    mensaje: prompt,
                }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `HTTP ${res.status}`);
            }

            const data = await res.json();
            const respuestaBot = data?.respuesta || "🤖 Sin respuesta del servidor.";
            setMensajes((prev) => [...prev, { remitente: "bot", texto: respuestaBot }]);

            if (data?.conversacionId) {
                setConversacionId(data.conversacionId);
                localStorage.setItem("conversacionId", String(data.conversacionId));
                localStorage.setItem("conversationId", String(data.conversacionId));
            }
            // Refresca lista para título/orden
            cargarConversaciones();
        } catch (e) {
            console.error(e);
            const msg = String(e?.message || "");
            if (msg.includes("429") || msg.toLowerCase().includes("resource_exhausted")) {
                showSnack("Servicio saturado. Intenta en unos segundos.", "warning");
            } else {
                showSnack("Error al conectar con el servidor.", "danger");
            }
        } finally {
            setCargando(false);
            setPrompt("");
        }
    };

    const alPresionarTecla = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            enviar();
        }
    };

    return (
        <>
            {/* Botón flotante */}
            <Button
                onClick={() => setEstaAbierto(!estaAbierto)}
                style={{
                    position: "fixed",
                    bottom: "25px",
                    right: "25px",
                    zIndex: 1000,
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#007AFF",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                }}
            >
                <i className="bi bi-chat-dots" style={{ fontSize: "1.8rem", color: "white" }}></i>
            </Button>

            {/* Ventana del chat con sidebar */}
            {estaAbierto && (
                <Card
                    style={{
                        position: "fixed",
                        bottom: "60px", // deja visible la franja azul superior
                        right: "25px",
                        width: "780px",
                        height: "560px",
                        borderRadius: "15px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                        zIndex: 999,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        border: "none",
                    }}
                >
                    {/* Snackbar minimalista */}
                    <Snackbar text={snack.text} show={snack.show} type={snack.type} />

                    {/* Encabezado: nombre fijo de la IA */}
                    <Card.Header
                        className="d-flex justify-content-between align-items-center"
                        style={{
                            backgroundColor: "#004080",
                            color: "white",
                            fontWeight: "bold",
                            padding: "10px 12px",
                            minHeight: "55px",
                            maxHeight: "55px",
                        }}
                    >
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {AI_NAME}
                        </span>

                    </Card.Header>

                    {/* Cuerpo con sidebar + mensajes */}
                    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                        {/* Sidebar */}
                        <aside
                            style={{
                                width: 260,
                                background: "#f0f4ff",
                                borderRight: "1px solid #e3e7f3",
                                padding: 10,
                                overflowY: "auto",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 8,
                                }}
                            >
                                <strong style={{ fontSize: 13, color: "#1f3b7c" }}>Tus conversaciones</strong>
                                <Button size="sm" variant="outline-primary" onClick={nuevaConversacion}>
                                    Nueva
                                </Button>
                            </div>

                            {conversaciones.length === 0 && (
                                <div style={{ fontSize: 12, opacity: 0.7 }}>No tienes conversaciones aún.</div>
                            )}

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {conversaciones.map((c) => {
                                    const activa = c.id === conversacionId;
                                    return (
                                        <div
                                            key={c.id}
                                            onClick={() => seleccionarConversacion(c.id)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 8,
                                                padding: "8px 10px",
                                                borderRadius: 8,
                                                border: "1px solid " + (activa ? "#8bb3ff" : "#e3e7f3"),
                                                background: activa ? "#e8f0ff" : "#fff",
                                                cursor: "pointer",
                                            }}
                                            title={c.titulo}
                                        >
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <div
                                                    style={{
                                                        fontWeight: 600,
                                                        fontSize: 13,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {c.titulo || `Conversación ${c.id}`}
                                                </div>
                                                <div style={{ fontSize: 11, opacity: 0.6 }}>
                                                    {new Date(c.actualizadaEn).toLocaleString()}
                                                </div>
                                            </div>

                                            {/* Icono de papelera por conversación */}
                                            <button
                                                onClick={(e) => eliminarConversacionItem(e, c.id)}
                                                title="Eliminar conversación"
                                                style={{
                                                    border: "none",
                                                    background: "transparent",
                                                    color: "#b40000",
                                                    padding: 4,
                                                    borderRadius: 6,
                                                    cursor: "pointer",
                                                }}
                                                aria-label={`Eliminar conversación ${c.id}`}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </aside>

                        {/* Zona de mensajes */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                            <Card.Body
                                style={{
                                    backgroundColor: "#f4f7fc",
                                    padding: "15px",
                                    overflowY: "auto",
                                    flexGrow: 1,
                                }}
                            >
                                {cargandoHistorial && (
                                    <div
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "12px",
                                            padding: "10px 14px",
                                            marginBottom: "10px",
                                            fontSize: "0.85rem",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        <Spinner animation="border" size="sm" /> Cargando historial...
                                    </div>
                                )}
                                {mensajes.map((m, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            backgroundColor: m.remitente === "user" ? "#d1f5d3" : "#ffffff",
                                            borderRadius: "12px",
                                            padding: "10px 14px",
                                            marginBottom: "10px",
                                            alignSelf: m.remitente === "user" ? "flex-end" : "flex-start",
                                            maxWidth: "85%",
                                            marginLeft: m.remitente === "user" ? "auto" : 0,
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                            fontSize: "0.92rem",
                                        }}
                                    >
                                        <ReactMarkdown>{m.texto}</ReactMarkdown>
                                    </div>
                                ))}
                                {cargando && (
                                    <div
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "12px",
                                            padding: "10px 14px",
                                            maxWidth: "70%",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                            fontSize: "0.92rem",
                                        }}
                                    >
                                        <Spinner animation="border" size="sm" /> Pensando...
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </Card.Body>

                            {/* Input */}
                            <Card.Footer style={{ backgroundColor: "#f4f7fc", padding: "10px 15px" }}>
                                <InputGroup>
                                    <Form.Control
                                        as="textarea"
                                        ref={textareaRef}
                                        rows={1}
                                        placeholder="Escribe un mensaje..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={alPresionarTecla}
                                        style={{
                                            resize: "none",
                                            borderRadius: "10px",
                                            fontSize: "0.9rem",
                                            maxHeight: "120px",
                                            overflowY: "auto",
                                        }}
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={enviar}
                                        disabled={cargando}
                                        style={{ marginLeft: "10px", borderRadius: "10px", padding: "8px 12px" }}
                                    >
                                        {cargando ? <Spinner animation="border" size="sm" /> : <i className="bi bi-send-fill"></i>}
                                    </Button>
                                </InputGroup>
                            </Card.Footer>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
};

export default GeminiChat;