import React from 'react';

export function GestorTelefonico() {
 
    return (
        <div>
            <h1>Gestor Telefónico</h1>
                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" />
                </div>
                <div>
                    <label htmlFor="telefono">Teléfono:</label>
                    <input type="text" id="telefono" name="telefono" />
                </div>
                <div>
                    <label htmlFor="direccion">Dirección:</label>
                    <input type="text" id="direccion" name="direccion" />
                </div>
                <button type="submit">Enviar</button>
        </div>
    );
};
