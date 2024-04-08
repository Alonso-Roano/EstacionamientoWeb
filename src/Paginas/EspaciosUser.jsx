import React, { useEffect, useState } from "react";
import "../CSS/Dashboard.css";
import Dashboards from "./Dasboards";
import Usuarios from "./Usuarios";
import Registros from "./Registros";
import Espacios from "./Espacios";
import "../CSS/Modales.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";


function EspaciosUser() {
    const [sensorData, setSensorData] = useState([]);
    const [nombre, setNombre] = useState("");

    useEffect(() => {
        const socket = io("http://10.10.50.96:3000");

        socket.on("updateData", (updatedData) => {
            const sortedData = updatedData.sort((a, b) => {
                const sensorIdANum = parseInt(a.sensorId.replace('sensor', ''), 10);
                const sensorIdBNum = parseInt(b.sensorId.replace('sensor', ''), 10);
                return sensorIdANum - sensorIdBNum;
            });
        
            const replacedData = sortedData.map(item => ({
                ...item,
                sensorId: item.sensorId.replace('sensor', 'Espacio ')
            }));
        
            setSensorData(replacedData);
            console.log(replacedData);
        });

        socket.emit("getData");

        return () => {
            socket.disconnect();
        };
    }, []);

    const renderEspacio = (espacio) => (
        <td key={espacio.sensorId}>
            <div className="lin"><p>{espacio.sensorId}</p></div>
            <div className={`auto ${espacio.isOccupied ? "" : "oc"}`}>
                <img src="/auto.png" alt="" />
            </div>
        </td>
    );

    const espaciosDisponibles = sensorData.filter(e => !e.isOccupied).length;


    const navigate = useNavigate();
    useEffect(() => {
        const autenticado = localStorage.getItem("token");
        if (!autenticado) {
            navigate("/login")
        }else{
        const [header, payload, signature] = autenticado.split('.');
        var decodedPayload = JSON.parse(atob(payload));
        const fetch = async () => {
            try {
                const respuesta = await axios.get(`${api}/api/auth/find-user/${decodedPayload.id}`);
                setNombre(respuesta.data.fullName)
            } catch (error) {
                //console.log(error);
            }
        };
        fetch()
    }
    }, []);


    return (
        <>

            <main className="principal">
                <section className="contenedores contenedores2">
                    <div className="titulo">
                        <p>{nombre}</p>
                        <button onClick={() => { localStorage.clear("token"); window.location.href = '/login' }} >Cerrar sesion</button>
                    </div>
                    <div className="contenidoE">
                    <main className="dashboards">
                <h5>Espacios en tiempo real:</h5>
                <div className="Espacios">
                    <table>
                        <tbody>
                            <tr className="fila1">
                                {sensorData.slice(0, 6).map(renderEspacio)}
                            </tr>
                            <tr>
                                <td colSpan={6} className="cen">
                                    <div className="lin2">Espacios disponibles: {espaciosDisponibles}</div>
                                </td>
                            </tr>
                            <tr className="fila3">
                                {sensorData.slice(6, 8).map(renderEspacio)}
                                <td className="entrada"><div className="lin"> <p>Entrada</p></div></td>
                                <td className="entrada"><div className="lin"><p>Salida</p></div></td>
                                {sensorData.slice(8, 10).map(renderEspacio)}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button className="app">Descarga nuestra App</button>
            </main>
                    </div>
                </section>

            </main>
        </>
    );
}

export default EspaciosUser;