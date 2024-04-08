import React, { useEffect, useState } from "react";
import "../CSS/Dashboard.css";
import Dashboards from "./Dasboards";
import Usuarios from "./Usuarios";
import Registros from "./Registros";
import Espacios from "./Espacios";
import "../CSS/Modales.css";
import axios from "axios";
const api = import.meta.env.VITE_APP_API;
import { Link, useNavigate } from "react-router-dom";


function Dashboard() {
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const autenticado = localStorage.getItem("token");;
        if (!autenticado) {
            navigate("/login")
        }else{
        const [header, payload, signature] = autenticado.split('.');
        var decodedPayload = JSON.parse(atob(payload))
        const fetch = async () => {
            try {
                const respuesta = await axios.get(`${api}/api/auth/find-user/${decodedPayload.id}`);
                if(respuesta.data.roles !== "guard") navigate("/espacios");
                setNombre(respuesta.data.fullName)
            } catch (error) {
                //console.log(error);
            }
        };
        fetch()}
    }, []);

    const [clases, setClases] = useState("navegacion ocultar");
    const mostrar = () => {
        setClases("navegacion mostrar");
    };

    const ocultar = () => {
        setClases("navegacion ocultar");
    };
    const components = (componente) => {
        setComponentes(componente);
        ocultar();
    };
    const [componentes, setComponentes] = useState(
        <Dashboards components={components} />
    );

    return (
        <>

            <main className="principal">
                <aside className={clases}>
                    <div className="head">
                        <div className="contenido">
                            <img src="/logo-estacionamiento.png" alt="" />
                            <h3>Parking Academy</h3>

                            <span onClick={() => components(<Dashboards components={components} />)}>
                                <i className="nf nf-md-view_dashboard" id="puntero"></i>
                                <p className="opciones2"> Dashboard </p>
                                <div className="triangleleft"></div>
                            </span>
                            <span onClick={() => components(<Espacios components={components} />)}>
                                <i className="nf nf-md-car" id="puntero"></i>
                                <p className="opciones2"> Espacios </p>
                                <div className="triangleleft"></div>
                            </span>
                            <span onClick={() => components(<Usuarios />)}>
                                <i className="nf nf-fa-user_circle" id="puntero"></i>
                                <p className="opciones2"> Usuarios </p>
                                <div className="triangleleft"></div>
                            </span>
                            <span onClick={() => components(<Registros />)}>
                                <i className="nf nf-md-clipboard_list" id="puntero"></i>
                                <p className="opciones2"> Registros de entrada</p>
                                <div className="triangleleft"></div>
                            </span>
                        </div>
                    </div>
                </aside>
                <i className="nf nf-cod-menu" id="mostrar" onClick={mostrar}></i>
                <section className="contenedores" onClick={ocultar}>
                    <div className="titulo">
                        <p>{nombre}</p>
                        <button onClick={() => { localStorage.clear("token"); window.location.href = '/login' }} >Cerrar sesion</button>
                    </div>
                    <div className="contenidoE">{componentes}</div>
                </section>
            </main>
        </>
    );
}

export default Dashboard;