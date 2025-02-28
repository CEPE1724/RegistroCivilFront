import React, { useState, useEffect } from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

export function DatosConyuge() {

    const optTipoDoc = [
        { value: 1, label: "Cedula" },
        { value: 2, label: "Pasaporte" },
    ];
    const optNacionalidad = [
        { value: 0, label: "Ecuador" },
        { value: 1, label: "nacionalidad 1" },
        { value: 2, label: "nacionalidad 2" }
    ];
    const optSexo = [
        { value: 0, label: "Masculino" },
        { value: 1, label: "Femenino" },
        { value: 2, label: "Otro" }
    ];
    const optNivEducacion = [
        { value: 0, label: "Primaria" },
        { value: 1, label: "Secundaria" },
        { value: 2, label: "Tecnico" },
        { value: 3, label: "Tecnologo" },
        { value: 4, label: "Profesional" },
        { value: 5, label: "Postgrado" },
        { value: 6, label: "Otro" }
    ];
    const optProfesion = [
        { value: 0, label: "Profesion 1" },
        { value: 1, label: "Profesion 2" },
        { value: 2, label: "Profesion 3" }
    ];


    return (
        <div>
            <h1>Datos conyuge Daniel</h1>
            {/* Primera Fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Tipo Documento */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Tipo Documento</label>
                    <select
                        className="p-2 border rounded"
                    >
                        <option value="">Seleccione una opción</option>
                        {optTipoDoc.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Numero Documento */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Documento</label>
                    <input
                        type="text"
                        placeholder="Documento"
                        className="p-2 border rounded"
                    />
                </div>
                {/* Nombres */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Nombres</label>
                    <input
                        type="text"
                        placeholder="Nombres"
                        className="p-2 border rounded"
                    />
                </div>
                {/* Fecha nacimiento */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">F. Nacimiento</label>
                    <input
                        type="date"
                        className="p-2 border rounded"
                    />
                </div>
            </div>
            {/* Segunda fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Nacionalidad */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Nacionalidad</label>
                    <select
                        className="p-2 border rounded"
                    >
                        <option value="">Seleccione una opción</option>
                        {optNacionalidad.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Sexo */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Sexo</label>
                    <select
                        className="p-2 border rounded"
                    >
                        <option value="">Seleccione una opción</option>
                        {optSexo.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Nivel Educacion */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Nivel Educacion</label>
                    <select
                        className="p-2 border rounded"
                    >
                        <option value="">Seleccione una opción</option>
                        {optNivEducacion.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Profesion */}
                <div className="flex flex-col">
                    <label className="text-lightGrey text-xs mb-2">Profesión</label>
                    <select
                        className="p-2 border rounded"
                    >
                        <option value="">Seleccione una opción</option>
                        {optProfesion.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
