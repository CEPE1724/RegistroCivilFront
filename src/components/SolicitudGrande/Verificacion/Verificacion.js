import React from "react";
import { useState } from "react";
import TrabajoModal from './TrabajoModal';
import DomicilioModal from './DomicilioModal';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
  } from "@mui/material";

export function Verificacion() {

	const [isTrabajoModalOpen, setIsTrabajoModalOpen] = useState(false);
	const [isDomicilioModalOpen, setDomicilioModalOpen] = useState(false);

	const columns = [
		{ id: 'anular', label: 'Anular' },
		{ id: 'aprobar', label: 'Aprobar' },
		{ id: 'cobrador', label: 'Cobrador' },
		{ id: 'img', label: 'IMG', type: 'image' },
		{ id: 'imgD', label: 'IMG D', type: 'image' },
		{ id: 'estado', label: 'Estado' },
		{ id: 'numero', label: 'Número' },
		{ id: 'ruc', label: 'RUC' },
		{ id: 'nombre', label: 'Nombres' },
		{ id: 'almacen', label: 'Almacén' },
		{ id: 'domicilioAsignado', label: 'Domicilio Asignado' },
		{ id: 'domicilio', label: 'Domicilio' },
		{ id: 'trabajoAsignado', label: 'Trabajo Asignado' },
		{ id: 'trabajo', label: 'Trabajo' },
		{ id: 'fechaEnvio', label: 'Fecha Envío' },
		{ id: 'fechaRespuesta', label: 'Fecha Respuesta' },
		{ id: 'usuarioAsignado', label: 'Usuario Asignado' },
		{ id: 'verificador', label: 'Verificador' },
		{ id: 'opciones', label: 'Opciones', type: 'actions' },
	];

	const data = [
		{
			Anular: "Sí",
			Aprobar: "No",
			Cobrador: "Juan Pérez",
			IMG: "imagen_1.jpg",
			"IMG D": "imagen_1_detalle.jpg",
			Estado: "Pendiente",
			Número: "123456",
			RUC: "12345678901",
			Nombres: "Carlos Gómez",
			Almacén: "Almacén A",
			"Domicilio Asignado": "Calle Falsa 123",
			Domicilio: "Calle Real 456",
			"Trabajo Asignado": "Tarea 1",
			Trabajo: "Revisión",
			"Fecha Envío": "2025-02-01",
			"Fecha Respuesta": "2025-02-02",
			"Usuario Asignado": "Ana López",
			Verificador: "Pedro Sánchez",
			Opciones: ["Revisar", "Aprobar"]
		  },
		  {
			Anular: "No",
			Aprobar: "Sí",
			Cobrador: "Pedro García",
			IMG: "imagen_2.jpg",
			"IMG D": "imagen_2_detalle.jpg",
			Estado: "Completado",
			Número: "234567",
			RUC: "23456789012",
			Nombres: "María Rodríguez",
			Almacén: "Almacén B",
			"Domicilio Asignado": "Avenida Central 789",
			Domicilio: "Calle Luna 101",
			"Trabajo Asignado": "Tarea 2",
			Trabajo: "Entrega",
			"Fecha Envío": "2025-02-02",
			"Fecha Respuesta": "2025-02-03",
			"Usuario Asignado": "Luis Martínez",
			Verificador: "Sofía Díaz",
			Opciones: ["Revisar", "Anular"]
		  },
	]

  return (
    <>
      <div className="p-4 sm:p-6 bg-gray-50 overflow-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Tabla de Datos
        </h1>

		<div className="flex items-center gap-2">
        <button
          type="button"
		  onClick={ () => setIsTrabajoModalOpen(true) }
          className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 mb-4"
        >
          <span className="text-xs">Trabajo</span>
        </button>
		<button
          type="button"
		  onClick={ () => setDomicilioModalOpen(true) }
          className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 mb-4"
        >
          <span className="text-xs">Domicilio</span>
        </button>
      </div>

	  <div className="bg-white shadow-lg rounded-lg border border-gray-300">
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id} align="center">
                    {data[column?.label]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
      </div>

	  {isTrabajoModalOpen &&
		<TrabajoModal
			openModal={ () => setIsTrabajoModalOpen(true) }
			closeModal={ () => setIsTrabajoModalOpen(false) }
		/>
	  }
	  {isDomicilioModalOpen &&
		<DomicilioModal
			openModal={ () => setIsTrabajoModalOpen(true) }
			closeModal={ () => setDomicilioModalOpen(false) }
		/>
	  }
	  
    </>
  );
};
