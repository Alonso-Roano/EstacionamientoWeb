import React from "react";
import { Link } from "react-router-dom";
export default function Page404() {
    return (
        <>
            <main className="error">
                <div>
                    <h1 className="error_cuatro">Error 404</h1>
                    <h2>Pagina no encontrada</h2>
                    <Link to={"/"}><h3>Volver</h3></Link>
                </div>
            </main>
        </>
    );
}