import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Papa from "papaparse";
import { ModalAnalista } from "./ModalAnalista";
import { fetchFechaAnalista } from "../../components/SolicitudGrande/DatosCliente/apisFetch";
import { useSnackbar } from "notistack";
import { SelectField } from "../../components/Utils";
import { APIURL } from "../../configApi/apiConfig";

// Horas de 8:00 a 21:00
const hours = [];
for (let i = 8; i <= 21; i++) {
  hours.push(`${i}:00`);
}

const days = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"];

export function CalendarPerson(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [fechaAnalista, setFechaAnalista] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedAnalista, setSelectedAnalista] = useState("");
  const [schedule, setSchedule] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [fileInputLabel, setFileInputLabel] = useState("Importar horarios (CSV)");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Se obtiene el rango de fechas desde la API (por ejemplo, [ { idFechaAnalista, DesdeHasta, Desde, Hasta }, ... ])
  useEffect(() => {
    fetchFechaAnalista(enqueueSnackbar, setFechaAnalista);
  }, [enqueueSnackbar]);

  // A partir de la fecha "Desde" y "Hasta" de la API se genera la grilla semanal.
  const getWeekDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const weekDates = [];

    // Ajustamos para que la semana inicie en lunes
    const dayOfWeek = start.getDay();
    const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    start.setDate(start.getDate() + diff);

    while (start <= end) {
      const currentDate = new Date(start);
      weekDates.push({
        day: days[start.getDay() === 0 ? 6 : start.getDay() - 1],
        date: currentDate.getDate(),
        fullDate: new Date(currentDate), // representa el día a medianoche
      });
      console.log("[getWeekDates] pushing day =>", currentDate.toString());
      start.setDate(start.getDate() + 1);
    }
    return weekDates;
  };

  // Se construye la grilla de días a partir del rango seleccionado
  const fechaDias = useMemo(() => {
    if (!selectedDate) return [];

    console.log("fechaAnalista");
    console.log(fechaAnalista);
    console.log("selectedDate");
    console.log(selectedDate);

    const selectedRange = fechaAnalista.find(
      (range) => range.value === selectedDate
    );

    if (!selectedRange) return [];

    const { Desde, Hasta } = selectedRange;
    console.log("[useMemo] Rango seleccionado =>", selectedRange);
    const result = getWeekDates(selectedRange.desde, selectedRange.hasta);
    console.log("[useMemo] resultado getWeekDates =>", result);
    return result;
  }, [selectedDate, fechaAnalista]);

  const handleMenuClick = (title, item) => {
    setSelectedTitle(title);
    setSelectedAnalista(item.idAnalistaCredito);
  };

  // Función que determina si una celda es editable.
  const isEditableCell = (fullDate, hour) => {
    if (!fullDate) {
      console.log("[isEditableCell] Sin fullDate, retorna false");
      return false;
    }
    const now = new Date();

    const cellYear = fullDate.getFullYear();
    const cellMonth = fullDate.getMonth();
    const cellDay = fullDate.getDate();

    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDay = now.getDate();

    // Comparación a nivel de fecha
    if (cellYear < nowYear) {
      console.log("[isEditableCell] Año pasado, retorna false");
      return false;
    }
    if (cellYear > nowYear) {
      console.log("[isEditableCell] Año futuro, retorna true");
      return true;
    }
    if (cellMonth < nowMonth) {
      console.log("[isEditableCell] Mes pasado, retorna false");
      return false;
    }
    if (cellMonth > nowMonth) {
      console.log("[isEditableCell] Mes futuro, retorna true");
      return true;
    }
    if (cellDay < nowDay) {
      console.log("[isEditableCell] Día pasado, retorna false");
      return false;
    }
    if (cellDay > nowDay) {
      console.log("[isEditableCell] Día futuro, retorna true");
      return true;
    }

    // Si es el mismo día, comparamos la hora
    const [hStr, mStr = "0"] = hour.split(":");
    const cellTime = new Date(fullDate);
    cellTime.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);
    const result = cellTime.getTime() > now.getTime();
    return result;
  };

  useEffect(() => {
	const fetchHorariosAPI = async () => {
	  if (selectedAnalista && selectedDate) {
		const url = `${APIURL.get_horariosanalistas()}/analista/${selectedAnalista}/fecha/${selectedDate}`;
		console.log("[fetchHorariosAPI] URL:", url);
		
		try {
		  const { data: horarios } = await axios.get(url);
		  console.log("[fetchHorariosAPI] Data:", horarios);
		  
		  const newSchedule = horarios.reduce((acc, { Dia, Hora, Estado }) => {
			const hourStr = `${Hora}:00`;
			acc[Dia] = acc[Dia] || {};
			acc[Dia][hourStr] = Estado;
			return acc;
		  }, {});
		  
		  setSchedule(newSchedule);
		} catch (error) {
		  console.error("[fetchHorariosAPI] Error:", error);
		  enqueueSnackbar("Error al cargar los horarios del analista", { variant: "error" });
		}
	  }
	};
	
	fetchHorariosAPI();
  }, [selectedAnalista, selectedDate]);
  

  // Manejo de carga del archivo CSV
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileInputLabel(file.name);
    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const data = result.data;
        const updatedSchedule = { ...schedule };
        let processedCount = 0;
        const validRows = data.filter(
          (row) => row.Day && row.Hour && row.Status
        );

        validRows.forEach((row) => {
          const { Day, Hour, Status } = row;
          if (!days.includes(Day) || !hours.includes(Hour)) {
            console.log("[handleFileUpload] Day u Hour no válidos =>", row);
            return;
          }
          console.log(fechaDias);
          const fechaDia = fechaDias.find((fd) => fd.day === Day);

          // Solo importamos la celda si es editable
          if (fechaDia && !isEditableCell(fechaDia.fullDate, Hour)) {
            console.log("[handleFileUpload] No editable => se omite");
            return;
          }

          if (!updatedSchedule[Day]) updatedSchedule[Day] = {};
          updatedSchedule[Day][Hour] =
            Status === "Active" ? "Active" : "Inactive";
          processedCount++;
          fetchsaveHorario(Day, Hour, updatedSchedule[Day][Hour]);
        });

        setSchedule(updatedSchedule);
        setIsLoading(false);
        enqueueSnackbar(
          `Se importaron ${processedCount} horarios correctamente`,
          { variant: "success" }
        );
      },
      error: (error) => {
        console.error("Error al procesar el archivo:", error);
        enqueueSnackbar("Error al procesar el archivo", { variant: "error" });
        setIsLoading(false);
        setFileInputLabel("Importar horarios (CSV)");
      },
    });
  };

  // Al hacer clic en una celda se alterna su estado (si es editable)
  const handleButtonClick = (day, hour) => {
    const fechaDia = fechaDias.find((fd) => fd.day === day);

    if (fechaDia && !isEditableCell(fechaDia.fullDate, hour)) {
      enqueueSnackbar("No se puede modificar horarios pasados", {
        variant: "warning",
      });
      return;
    }

    setSchedule((prevSchedule) => {
      const updatedSchedule = { ...prevSchedule };
      if (!updatedSchedule[day]) updatedSchedule[day] = {};
      const isActive = updatedSchedule[day][hour] === "Active";
      updatedSchedule[day][hour] = isActive ? "Inactive" : "Active";
      return updatedSchedule;
    });

    fetchsaveHorario(day, hour);
  };

  // Guarda el horario a través de la API
  const fetchsaveHorario = async (day, hour, status) => {
    try {
      const hourInt = parseInt(hour.split(":")[0], 10);

      const currentStatus =
        status ||
        (schedule[day] && schedule[day][hour] === "Active"
          ? "Inactive"
          : "Active");
      const iEstadoValue = currentStatus === "Active" ? 1 : 0;

      const url = APIURL.posthorarioanalista();
      await axios.post(url, {
        idAnalistaCredito: selectedAnalista,
        Hora: hourInt,
        Dia: day,
        Estado: currentStatus,
        iEstado: iEstadoValue,
        idFechaAnalista: parseInt(selectedDate, 10),
      });

      if (!status) {
        enqueueSnackbar("Horario guardado exitosamente", {
          variant: "success",
          preventDuplicate: true,
        });
      }
    } catch (error) {
      console.error("Error al guardar el horario:", error);
      enqueueSnackbar("Error al guardar el horario", { variant: "error" });
    }
  };

  // Carga la lista de analistas para el menú lateral
  const fetchMenuData = async () => {
    try {
      const url = APIURL.analistacredito();
      const response = await axios.get(url);
      setMenuData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos del menú:", error);
      enqueueSnackbar("Error al cargar analistas", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, [isModalOpen]);

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      {/* Cabecera */}
      <h1 className="text-2xl font-bold text-center mb-4 mt-4">
        Calendario de Disponibilidad
      </h1>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Panel lateral de analistas */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-lg m-4 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-800">Analistas</h2>
            <button
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-md"
              onClick={openModal}
              title="Agregar analista"
            >
              <PersonAddIcon />
            </button>
          </div>
          <div className="overflow-y-auto max-h-96 p-2">
            {menuData.length > 0 ? (
              menuData.map((item, index) => (
                <div
                  key={index}
                  className={`mb-2 rounded-md ${
                    selectedAnalista === item.idAnalistaCredito
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <button
                    className="flex items-center w-full text-left py-3 px-4 rounded-md transition-colors"
                    onClick={() => handleMenuClick(item.Nombre, item)}
                  >
                    <span
                      className={`${
                        selectedAnalista === item.idAnalistaCredito
                          ? "font-medium text-blue-800"
                          : "text-gray-700"
                      }`}
                    >
                      {item.Nombre}
                    </span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-500">
                No se encontraron analistas
              </p>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-4">
          {/* Cabecera de contenido */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedTitle ? (
                    <>
                      <span className="text-blue-700">Analista:</span>{" "}
                      {selectedTitle}
                      <span className="text-sm text-gray-500 ml-2">
                        ID: {selectedAnalista}
                      </span>
                    </>
                  ) : (
                    "Seleccione un analista"
                  )}
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-64">
                  <SelectField
                    label="Fecha"
                    value={selectedDate}
                    onChange={(e) =>
                      setSelectedDate(parseInt(e.target.value, 10))
                    }
                    options={fechaAnalista.map((item) => ({
                      label: item.label,
                      value: item.value,
                    }))}
                  />
                </div>
                <label className="flex items-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer transition-colors border border-gray-300">
                  <UploadFileIcon className="text-blue-600" />
                  <span className="text-sm truncate max-w-xs">
                    {fileInputLabel}
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Calendario */}
          {selectedTitle && selectedDate ? (
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-max">
                    <div className="grid grid-cols-8 gap-2">
                      {/* Cabecera del calendario */}
                      <div className="p-2 font-medium text-gray-500 bg-gray-50 rounded-tl-md"></div>
                      {days.map((day, index) => {
                        const fechaDia = fechaDias.find((fd) => fd.day === day);
                        const dayEditable = fechaDia
                          ? isEditableCell(fechaDia.fullDate, hours[0])
                          : false;
                        return (
                          <div
                            key={index}
                            className={`p-2 text-center font-semibold rounded-t-md ${
                              !dayEditable
                                ? "bg-gray-200 text-gray-500"
                                : "bg-blue-50 text-blue-800"
                            }`}
                          >
                            <div>{day}</div>
                            {fechaDia && (
                              <div className="text-xs text-gray-500">
                                {fechaDia.date}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {/* Filas de horas */}
                      {hours.map((hour, hourIndex) => (
                        <React.Fragment key={hourIndex}>
                          <div className="p-2 text-center bg-gray-50 font-medium text-gray-700">
                            {hour}
                          </div>
                          {days.map((day, dayIndex) => {
                            const fechaDia = fechaDias.find((fd) => fd.day === day);
                            const editable = fechaDia
                              ? isEditableCell(fechaDia.fullDate, hour)
                              : false;
                            const isActive = schedule[day]?.[hour] === "Active";
                            return (
                              <div key={dayIndex} className="text-center p-1">
                                <button
                                  className={`w-full h-10 rounded-md transition-all duration-200 flex items-center justify-center ${
									isActive 
									  ? (editable 
										   ? "bg-green-500 hover:bg-green-600 shadow-sm" 
										   : "bg-green-400 cursor-not-allowed")
									  : !editable
										? "bg-gray-100 cursor-not-allowed opacity-50"
										: "bg-gray-200 hover:bg-gray-300"
								  }`}
                                  onClick={() => handleButtonClick(day, hour)}
                                  disabled={!editable}
                                  title={
                                    !editable
                                      ? "Horario pasado"
                                      : isActive
                                      ? "Disponible"
                                      : "No disponible"
                                  }
                                >
                                  {isActive ? (
                                    <CheckCircleIcon className="text-white" />
                                  ) : (
                                    <RadioButtonUncheckedIcon className="text-gray-600" />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Leyenda */}
              <div className="flex flex-wrap gap-4 mt-6 text-sm bg-gray-50 p-3 rounded-md">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded-full mr-2"></div>
                  <span>No disponible</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 opacity-50 rounded-full mr-2"></div>
                  <span>Horario pasado</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-blue-800 mb-4 text-5xl opacity-30 flex align-center justify-center">
                <CalendarIcon />
              </div>
              <p className="text-gray-500">
                Seleccione un analista y una fecha para configurar el horario
              </p>
            </div>
          )}
        </div>
      </div>
      <ModalAnalista isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

// Componente de icono de calendario para el estado vacío
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
  </svg>
);
