
import React, { useEffect, useState } from "react";
import "../CSS/Dashboards.css";
import swal from "sweetalert2";
import QRCode from 'qrcode.react';
import axios from "axios";
const api = import.meta.env.VITE_APP_API;

function Usuarios() {
    const registros = [
        { id: 1, matricula: '001', nombre: 'Juan Pérez', rango: 'Empleado' },
        { id: 2, matricula: '002', nombre: 'Ana Gómez', rango: 'Gerente' },
        { id: 3, matricula: '003', nombre: 'Carlos Sánchez', rango: 'Supervisor' },
        { id: 4, matricula: '004', nombre: 'Laura Martínez', rango: 'Empleado' },
        { id: 5, matricula: '005', nombre: 'Miguel López', rango: 'Director' },
        { id: 6, matricula: '006', nombre: 'Carmen Díaz', rango: 'Empleado' },
        { id: 7, matricula: '007', nombre: 'Fernando Ruiz', rango: 'Gerente' },
        { id: 8, matricula: '008', nombre: 'Daniela Castillo', rango: 'Supervisor' },
        { id: 9, matricula: '009', nombre: 'Alejandro Méndez', rango: 'Empleado' },
        { id: 10, matricula: '010', nombre: 'Sofía González', rango: 'Director' }
    ];
    const [Agregar, setAgregar] = useState(false);
    const [id, setId] = useState("");
    const [idUser, setIdUser] = useState("");
    const [Editar, setEditar] = useState(false);
    const [QR, setQR] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [body, setBody] = useState({
        email: "",
        password: "",
        fullName: "",
        tuition: "",
        roles: ""
    });
    
    const [body2, setBody2] = useState({
        email: "",
        password: "",
        fullName: "",
        tuition: "",
        roles: "",
        picture:""
    });
    useEffect(() => {
        fetch()
    }, []);
    const fetch = async () => {
        try {
            const respuesta2 = await axios.get(`${api}/api/auth/get-all-users`);
            const autenticado = localStorage.getItem("token");;
            const [header, payload, signature] = autenticado.split('.');
            let decodedPayload = JSON.parse(atob(payload))
            setId(decodedPayload.id)
            setUsuarios(respuesta2.data);
        } catch (error) {
            //console.log(error);
        }
    };
    const borrar = async (valor) => {
        const { value: confirmed } = await swal.fire({
            title: '¿Estás seguro?',
            text: 'Se borrara el usuario',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, estoy seguro',
            cancelButtonText: 'Cancelar',
        });

        if (confirmed) {
            const id = valor;
            try {
                const autenticado = localStorage.getItem("token");
                const respuesta = await axios.patch(
                    `${api}/api/auth/update/${id}`,
                    {
                        isActive: false,
                    },
                );
                    swal.fire(
                        'Usuario eliminado correctamente'
                    );
                    fetch();
            } catch (error) {
                //console.log(error)
            }
        }
    }
    const handleInicioSesion = async () => {
        if (body.roles == "0" || !body.fullName || !body.tuition || !body.email || !body.password) {
            swal.fire({
                title: '¡Error!',
                text: 'Rellene todos los campos',
                icon: 'error',
            });
            return;
        }
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(body.password)) {
            swal.fire({
                title: '¡Error!',
                text: 'La contraseña debe tener al menos 8 caracteres, contener al menos un número, una mayúscula y una minúscula.',
                icon: 'error',
            });
            return;
        }

        try {
            const respuesta = await axios.post(`${api}/api/auth/register`, body);
            swal.fire({
                icon: 'success',
                title: 'Usuario creado con éxito',
            });
            setAgregar(false)
            setBody({
                email: "",
                password: "",
                fullName: "",
                tuition: "",
                roles: ""
            });
            fetch();
        } catch (error) {
            console.error("Error al iniciar sesión: " + error);
            swal.fire({
                title: '¡Error!',
                text: 'Error al iniciar sesión. El usuario ya existe.',
                icon: 'error',
            });
        }
    };
    const handleEditar = async () => {
        const datosFiltrados = Object.fromEntries(
            Object.entries(body2).filter(([key, value]) => value !== "" && value !== null && value !== undefined && value !== "0")
        );
    
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if(body2.password){
            if (!passwordRegex.test(body.password)) {
                swal.fire({
                    title: '¡Error!',
                    text: 'La contraseña debe tener al menos 8 caracteres, contener al menos un número, una mayúscula y una minúscula.',
                    icon: 'error',
                });
                return;
            }
        }        

        if (Object.keys(datosFiltrados).length === 0) {
            swal.fire({
                title: '¡Error!',
                text: 'Rellene al menos un campo.',
                icon: 'error',
            });
            return;
        }
    
        try {
            console.log(datosFiltrados);
            const respuesta = await axios.patch(`${api}/api/auth/update/${idUser}`, datosFiltrados);
            swal.fire({
                icon: 'success',
                title: 'Usuario editado con éxito',
            });
            setEditar(false);
            setBody2({
                email: "",
                password: "",
                fullName: "",
                tuition: "",
                roles: "",
                picture: "",
            });
            fetch();
        } catch (error) {
            console.log(error)
            // console.error("Error al iniciar sesión: " + error);
            swal.fire({
                title: '¡Error!',
                text: 'Error al actualizar.',
                icon: 'error',
            });
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if ((name === "fullName" || name === "tuition" || name === "email" || name === "password") && value.startsWith(" ")) {
            return;
        }
        if (value.includes("/")) {
            return;
        }
        if ((name === "fullName" || name === "tuition" || name === "email" || name === "password") && /[&$+,´:;=?#|'<>^*()%-]/.test(value)) {
            return;
        }
        setBody({
            ...body,
            [name]: value,
        });
    };
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        if ((name === "fullName" || name === "tuition" || name === "picture" || name === "email" || name === "password") && value.startsWith(" ")) {
            return;
        }
        if (value.includes("/")) {
            return;
        }
        if ((name === "fullName" || name === "tuition" || name === "picture" || name === "email" || name === "password") && /[&$+,´:;=?#|'<>^*()%-]/.test(value)) {
            return;
        }
        setBody2({
            ...body2,
            [name]: value,
        });
    };


    return (
        <>
            {Editar && (
                <>
                    <span className="opaco" onClick={() => setEditar(false)}>

                    </span>
                    <div className="modal">
                        <h1>Editar Usuario</h1>
                        <button
                            className="salir"
                            onClick={() => { setBody2({
                                email: "",
                                password: "",
                                fullName: "",
                                tuition: "",
                                roles: "",
                                picture: "",
                            }); setEditar(false); }}
                        >
                            <i className="nf nf-oct-x text-2xl"></i>
                        </button>
                        <div className="entrada">
                            <input
                                type="text"
                                placeholder="Matricula"
                                name="tuition"
                                value={body2.tuition}
                                onChange={handleChange2}
                            />
                        </div>
                        <div className="entrada">
                            <input
                                type="text"
                                placeholder="Nombre"
                                name="fullName"
                                value={body2.fullName}
                                onChange={handleChange2}
                            />
                        </div>
                        <div className="entrada">
                            <input
                                type="text"
                                placeholder="Correo"
                                name="email"
                                value={body2.email}
                                onChange={handleChange2}
                            />
                        </div>
                        <div className="entrada">
                            <input
                                type="text"
                                placeholder="Contraseña"
                                name="password"
                                value={body2.password}
                                onChange={handleChange2}
                            />
                        </div>
                        
                        <div className="entrada">
                            <input
                                type="text"
                                placeholder="url de fotografia"
                                name="picture"
                                value={body2.picture}
                                onChange={handleChange2}
                            />
                        </div>
                        
                        <select name="roles" value={body2.roles} onChange={handleChange2} >
                            <option value="0">Escoge el rango</option>
                            <option value="guard">Guardia</option>
                            <option value="teacher">Maestro</option>
                            <option value="student">Estudiante</option>
                        </select>
                        <button
                            className="app"
                            onClick={() => handleEditar()}
                        >
                            EDITAR USUARIO
                        </button>
                    </div></>
            )}
            {Agregar && (
                <>
                    <span className="opaco" onClick={() => setAgregar(false)}>

                    </span>
                    <div className="modal">
                        <h1>Agregar Usuario</h1>
                        <button
                            className="salir"
                            onClick={() => {
                                setBody({
                                    email: "",
                                    password: "",
                                    fullName: "",
                                    tuition: "",
                                    roles: ""
                                }); setAgregar(false);
                            }}
                        >
                            <i className="nf nf-oct-x text-2xl"></i>
                        </button>
                        <div className="entrada">
                            <input
                                type="text"
                                placeholder="Matricula"
                                name="tuition"
                                value={body.tuition}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="entrada">
                            <input
                                type="text"
                                placeholder="Nombre"
                                name="fullName"
                                value={body.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="entrada">
                            <input
                                type="text"
                                placeholder="Correo"
                                name="email"
                                value={body.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="entrada">
                            <input
                                type="text"
                                placeholder="Contraseña"
                                name="password"
                                value={body.password}
                                onChange={handleChange}
                            />
                        </div>
                        <select name="roles" value={body.roles} onChange={handleChange} >
                            <option value="0">Escoge el rango</option>
                            <option value="guard">Guardia</option>
                            <option value="teacher">Maestro</option>
                            <option value="student">Estudiante</option>
                        </select>
                        <button
                            className="app"
                            onClick={() => handleInicioSesion()}
                        >
                            AGREGAR USUARIO
                        </button>
                    </div></>
            )}
            <main className="dashboards">
                <h4>Usuarios registrados:</h4>
                <button className="app2" onClick={() => setAgregar(true)}>Agregar nuevo usuario</button>
                <table class="tabla-registros">
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Matrícula</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rango</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((registro, index) => (
                            registro.isActive == true && (
                            registro.id !== id && (
                            <tr key={index}>
                                <td><img className="imagen" src={"" + registro.picture} alt="" srcset="" /> </td>
                                <td>{registro.tuition}</td>
                                <td>{registro.fullName}</td>
                                <td>{registro.email}</td>
                                <td>{registro.roles == "student" ? "Estudiante" : registro.roles == "teacher" ? "Maestro" : "Guardia"}</td>
                                <td>
                                    <span className="acciones">
                                        <button className="ta-editar" onClick={() => {setBody2({
                                                                                        email: registro.email,
                                                                                        fullName: registro.fullName,
                                                                                        tuition: registro.tuition,
                                                                                        roles: registro.roles,
                                                                                        picture: registro.picture,
                                                                                    });setEditar(true); setIdUser(registro.id)}}>Editar</button>
                                        <button className="ta-borrar" onClick={() => borrar(registro.id)}>Eliminar</button>
                                    </span>

                                </td>
                            </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </main>
        </>
    );
}

export default Usuarios;