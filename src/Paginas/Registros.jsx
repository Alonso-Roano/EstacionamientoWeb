import React, { useEffect, useState } from "react";
import "../CSS/Dashboards.css";
import Swal from "sweetalert2";
import QRCode from 'qrcode.react';
import axios from "axios";
const api = import.meta.env.VITE_APP_API;
function Registros() {
    const [Agregar, setAgregar] = useState(false);
    const [Editar, setEditar] = useState(false);
    const [registross, setRegistros] = useState([]);
    const [body, setBody] = useState({
        Nombre: "",
        Fecha: "",
        Proposito: "",
    });
    const redirigir = (componente) => {
        components(componente);
    };
    useEffect(() => {
        
        fetch()
    }, []);
    const fetch = async () => {
        try {
            const respuesta2 = await axios.get(`${api}/api/parking-slot/get-history`);
            setRegistros(respuesta2.data);
        } catch (error) {
            //console.log(error);
        }
    };
    const registros = [
        { id: 1, matricula: '001', nombre: 'Juan Pérez', rango: 'Empleado', entrada: '08:00', salida: '17:00' },
        { id: 2, matricula: '002', nombre: 'Ana Gómez', rango: 'Gerente', entrada: '09:00', salida: '18:00' },
        { id: 3, matricula: '003', nombre: 'Carlos Sánchez', rango: 'Supervisor', entrada: '08:00', salida: '17:00' },
        { id: 4, matricula: '004', nombre: 'Laura Martínez', rango: 'Empleado', entrada: '08:30', salida: '17:30' },
        { id: 5, matricula: '005', nombre: 'Miguel López', rango: 'Director', entrada: '07:45', salida: '16:45' },
        { id: 6, matricula: '006', nombre: 'Carmen Díaz', rango: 'Empleado', entrada: '09:15', salida: '18:15' },
        { id: 7, matricula: '007', nombre: 'Fernando Ruiz', rango: 'Gerente', entrada: '08:45', salida: '17:45' },
        { id: 8, matricula: '008', nombre: 'Daniela Castillo', rango: 'Supervisor', entrada: '10:00', salida: '19:00' },
        { id: 9, matricula: '009', nombre: 'Alejandro Méndez', rango: 'Empleado', entrada: '11:00', salida: '20:00' },
        { id: 10, matricula: '010', nombre: 'Sofía González', rango: 'Director', entrada: '07:30', salida: '16:30' }
    ];
    const cambioEntrada = ({ target }) => {
        const { name, value } = target;
        if ((name === "Nombre" || name == "Fecha" || name == "Proposito") && value.startsWith(" ")) {
            return;
        }
        if (value.includes("/")) {
            return;
        }
        if ((name === "Nombre" || name == "Fecha" || name == "Proposito") && /[&$+,´:;=?@#|'<>.^*()%-]/.test(value)) {
            return;
        }

    };
    const borrar = async () => {
        const { value: confirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se borrara el proyecto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, estoy seguro',
            cancelButtonText: 'Cancelar',
        });

        if (confirmed) {
        }
    }

    return (
        <>
            <main className="dashboards">
                <h4>Registros de entrada:</h4>
                <table class="tabla-registros">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Accion</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registross.map((registro, index) => (
                            <tr key={index}>
                                <td>{registro.fullName}</td>
                                <td>{registro.email}</td>
                                <td>{registro.entry_time?"Entrada":"Salida"}</td>
                                <td>{registro.entry_time ? new Date(registro.entry_time).toLocaleDateString() : new Date(registro.departure_time).toLocaleDateString()}</td>
                                <td>{registro.entry_time ? new Date(registro.entry_time).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true}) : new Date(registro.departure_time).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </>
    );
}

export default Registros;