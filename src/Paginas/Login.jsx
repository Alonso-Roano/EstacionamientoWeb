import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Login.css"
import axios from "axios";
const api = import.meta.env.VITE_APP_API;
import swal from "sweetalert2";
export default function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        const autenticado = localStorage.getItem("token");
        if (autenticado) {
            navigate("/");
        }

    }, []);
    const [body, setBody] = useState({
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        if ((name === "email" || name === "password") && value.startsWith(" ")) {
            return;
        }
        if (value.includes("/")) {
            return;
        }
        if ((name === "email" || name === "password") && /[&$+,´:;=?#|'<>^*()%-]/.test(value)) {
            return;
        }
        setBody({
            ...body,
            [name]: value,
        });
    };
    const handleInicioSesion = async () => {
        if (!body.email || !body.password) {
            swal.fire({
                title: '¡Error!',
                text: 'Rellene todos los campos',
                icon: 'error',
            });
            return;
        }

        try {
            const respuesta = await axios.post(`${api}/api/auth/login`, body);
            
                if (respuesta.data.roles=="guard") {
                    const token = respuesta.data.token;
                localStorage.setItem("token", token);
                window.location.href = '/';
                }else{
                    const token = respuesta.data.token;
                localStorage.setItem("token", token);
                window.location.href = '/espacios';
                }
        } catch (error) {
                swal.fire({
                    title: '¡Error!',
                    text: 'Usuario o contraseña incorrectos',
                    icon: 'error',
                });
        }
    };
    return (
        <>
            <ul class="circles">
                {Array.from({ length: 10 }).map((_, i) => (
                    <li key={i}></li>
                ))}
            </ul>
            <main className="Inicio">
                <div className="logo-inicio">
                    <img src="/logo-estacionamiento.png" alt="" />
                    <h1>Bienvenido</h1>
                    <h3>Parking Academy</h3>
                </div>
                <aside>
                    <div className="login">
                        <h2>Iniciar sesion</h2>
                        <span>
                            <i class="nf nf-md-email"></i>
                            <input type="emial"
                                placeholder="Correo"
                                name="email"
                                value={body.email}
                                onChange={handleChange} />
                        </span>
                        <span>
                            <i class="nf nf-md-lock"></i>
                            <input type="text"
                                placeholder="Contraseña"
                                name="password"
                                value={body.password}
                                onChange={handleChange} />
                        </span>
                        <button onClick={() => handleInicioSesion()}>Iniciar sesion</button>
                    </div>

                </aside>
            </main>
        </>
    );
}