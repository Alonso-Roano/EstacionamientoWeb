import React, { useState, useEffect } from "react";
import "../CSS/Espacios.css";
import io from "socket.io-client";

function Espacios() {
    const [sensorData, setSensorData] = useState([]);

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

    return (
        <>
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
            </main>
        </>
    );
}

export default Espacios;
