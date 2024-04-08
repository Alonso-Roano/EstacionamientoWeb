import React, { useEffect, useState } from "react";
import "../CSS/Dashboards.css";
import Espacios from "./Espacios";
import Registros from "./Registros";
import Usuarios from "./Usuarios";
import Swal from "sweetalert2";
import axios from "axios";
const api = import.meta.env.VITE_APP_API;

function Dashboards({ components }) {
    const [Agregar, setAgregar] = useState(false);
    const [espacios, setEspacios] = useState(0);
    const [registross, setRegistros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [Editar, setEditar] = useState(false);
    const [body, setBody] = useState({
        Nombre: "",
        Fecha: "",
        Proposito: "",
    });
    const redirigir = (componente) => {
        components(componente);
    };
    useEffect(() => {
        const fetch = async () => {
            try {
                const respuesta = await axios.get(`${api}/api/parking-slot/get-all-slots`);
                let espacioso=contarEspaciosOcupados(respuesta.data);
                setEspacios(espacioso);
                const respuesta2 = await axios.get(`${api}/api/parking-slot/get-history`);
                setRegistros(respuesta2.data);
                const respuesta3 = await axios.get(`${api}/api/auth/get-all-users`);
                const usuariosActivos = respuesta3.data.filter(usuario => usuario.isActive === true);
                setUsuarios(usuariosActivos);
            } catch (error) {
                //console.log(error);
            }
        };
        fetch()
    }, []);
    function contarEspaciosOcupados(datos) {
        var listaDatos = datos; 
        var espaciosOcupados = 0;
        listaDatos.forEach(function(elemento) {
            if (elemento.isOccupied) {
                espaciosOcupados++;
            }
        });
        return espaciosOcupados;
    }
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
                <aside className="proyectos">

                    <div className="tarjeta" onClick={() => redirigir(<Espacios></Espacios>)}>
                        <h2 className="linea">Vehiculos estacionados</h2>
                        <span className="tarjeta-cont">
                            <i className="nf nf-md-car" id="puntero"></i>
                            <p>{espacios}/10</p>
                        </span>
                    </div>
                    <div className="tarjeta" onClick={() => redirigir(<Registros></Registros>)}>
                        <h2 className="linea">Registros de entrada</h2>
                        <span className="tarjeta-cont">
                            <i className="nf nf-md-open_in_app" id="puntero"></i>
                            <p>{registross.length}</p>
                        </span>
                    </div>
                    <div className="tarjeta" onClick={() => redirigir(<Usuarios></Usuarios>)}>
                        <h2 className="linea">Usuarios</h2>
                        <span className="tarjeta-cont">
                            <i className="nf nf-fa-user_circle_o" id="puntero"></i>
                            <p>{usuarios.length - 1}</p>
                        </span>
                    </div>
                </aside>
                <span className="plumilla">
                    <button>Abrir plumilla entrada</button>
                    <button>Abrir plumilla salida</button>
                </span>
                <h4>Ultimos registros:</h4>
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
                        {registross.slice(0, 10).map((registro, index) => (
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

export default Dashboards;