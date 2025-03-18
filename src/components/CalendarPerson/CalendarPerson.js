import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icono de activado
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'; // Icono de desactivado
import Papa from 'papaparse'; // Importamos papaparse para leer archivos CSV
import { ModalAnalista } from './ModalAnalista';
import { fetchFechaAnalista } from "../../components/SolicitudGrande/DatosCliente/apisFetch";
import { useSnackbar } from 'notistack';
import { SelectField } from "../../components/Utils";
import { APIURL } from '../../configApi/apiConfig';

const hours = [];
for (let i = 8; i <= 21; i++) {
  hours.push(`${i}:00`);
}

let days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function CalendarPerson(props) {
  const { window } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [fechaAnalista, setFechaAnalista] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedAnalista, setSelectedAnalista] = useState('');
  const [schedule, setSchedule] = useState({});
  const [diaActual, setDiaActual] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchFechaAnalista(enqueueSnackbar, setFechaAnalista);
  }, []);
  const getWeekDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const weekDates = [];

    // Ajustar el inicio a lunes
    const dayOfWeek = start.getDay();
    const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek; // Ajustar al lunes más cercano
    start.setDate(start.getDate() + diff);

    // Crear una lista de fechas para los días de la semana
    while (start <= end) {
      const currentDate = new Date(start);
      weekDates.push({ day: daysOfWeek[start.getDay() - 1], date: currentDate.getDate() });
      start.setDate(start.getDate() + 1);
    }

    return weekDates;
  };


  // Filtrar fechas en el rango seleccionado
  const FechaDia = useMemo(() => {
    if (!selectedDate) return [];

    // Convierte la fecha seleccionada a un formato Date
    const selectedRange = fechaAnalista.find(
      (range) => range.DesdeHasta === selectedDate
    );

    if (!selectedRange) return [];

    const { Desde, Hasta } = selectedRange;
    const weekDates = getWeekDates(Desde, Hasta);
    return weekDates;
  }, [selectedDate, fechaAnalista]);

  const handleMenuClick = (title, item) => {
    console.log('item', item);
    setSelectedTitle(title);
    setSelectedAnalista(item.idAnalistaCredito);
  };




  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data;
          const updatedSchedule = { ...schedule }; // Copiar el estado actual para actualizarlo correctamente

          data.forEach((row) => {
            const { Day, Hour, Status } = row;
            if (!days.includes(Day) || !hours.includes(Hour)) return;

            // Validación para no permitir horarios pasados
            const currentDate = new Date();
            const currentDayName = currentDate.toLocaleDateString('es-ES', { weekday: 'long' });
            const currentHour = currentDate.getHours();

            const dayIndex = days.indexOf(Day);
            const currentDayIndex = days.indexOf(currentDayName) + 1;

            // Verificar si el horario no es pasado
            if (dayIndex > currentDayIndex || (dayIndex === currentDayIndex && parseInt(Hour) > currentHour)) {
              if (!updatedSchedule[Day]) updatedSchedule[Day] = {};

              // Alternar el estado entre Active e Inactive (igual que en handleButtonClick)
              updatedSchedule[Day][Hour] = Status === 'Active' ? 'Active' : 'Inactive';

              // Llamar a la API para guardar el horario actualizado
              fetchsaveHorario(Day, Hour, updatedSchedule[Day][Hour]);
            }
          });

          // Actualizar el estado con el horario procesado desde el archivo
          setSchedule(updatedSchedule); // Asegurarse de actualizar correctamente el estado
        },
        header: true,
      });
    }
  };


  const handleButtonClick = (day, hour) => {
    const currentDate = new Date();
    const currentDayName = currentDate.toLocaleDateString('es-ES', { weekday: 'long' });
    const currentHour = currentDate.getHours();

    const dayIndex = days.indexOf(day);
    const currentDayIndex = days.indexOf(currentDayName) + 1;

    if (dayIndex > currentDayIndex || (dayIndex === currentDayIndex && parseInt(hour) > currentHour)) {
      setSchedule((prevSchedule) => {
        const updatedSchedule = { ...prevSchedule };
        if (!updatedSchedule[day]) updatedSchedule[day] = {};
        const isActive = updatedSchedule[day][hour] === 'Active'; // Comprobar si ya está activo
        updatedSchedule[day][hour] = isActive ? 'Inactive' : 'Active'; // Cambiar entre "Active" e "Inactive"
        return updatedSchedule;
      });

      fetchsaveHorario(day, hour);
    } else {
      enqueueSnackbar('No se puede modificar horarios pasados', { variant: 'warning' });
    }
  };

  const fetchsaveHorario = async (day, hour) => {
    try {
      // Extraer solo la parte de la hora (antes del ':')
      const hourInt = parseInt(hour.split(':')[0], 10);  // Convierte a número entero

      const currentScheduleState = schedule[day] && schedule[day][hour] === 'Active' ? 'Inactive' : 'Active';
      const iEstadoValue = currentScheduleState === 'Active' ? 1 : 0;

      const url = APIURL.posthorarioanalista();
      const response = await axios.post(url, {
        idAnalistaCredito: selectedAnalista,
        Hora: hourInt,  // Usamos el valor de hour como entero
        Dia: day,
        Estado: currentScheduleState,  // "Active" o "Inactive"
        iEstado: iEstadoValue,  // 1 para "Active" y 0 para "Inactive"
        idFechaAnalista: parseInt(selectedDate, 10),  // Convertir a número entero
      });

      enqueueSnackbar('Horario guardado exitosamente!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error al guardar el horario', { variant: 'error' });
    }
  };

  const fetchMenuData = async () => {
    try {
      const url = APIURL.analistacredito();
      const response = await axios.get(url);
      setMenuData(response.data);
    } catch (error) {
      console.error('Error al obtener los datos del menú:', error);
    }
  };

  const handleInputChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    fetchMenuData();
  }, [isModalOpen]);

  return (
    <div className="flex flex-col bg-gray-100 overflow-x-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col w-full md:w-1/4 bg-white p-5 text-black border-r border-gray-300 shadow-lg">
          <button
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 transition ease-in-out delay-75 hover:bg-blue-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
            onClick={openModal}
          >
            Agregar
          </button>

          <h3 className="font-bold text-lg text-gray-700 mt-5">Analistas</h3>
          {menuData.length > 0 ? (
            menuData.map((item, index) => (
              <div key={index} className="mb-3">
                <button
                  className="flex items-center space-x-2 w-full text-left text-blue-600 py-3 px-5 rounded-md hover:bg-gray-200"
                  onClick={() => handleMenuClick(item.Nombre, item)}
                >
                  <span className="text-gray-700">{item.Nombre} </span>
                </button>
              </div>
            ))
          ) : (
            <p>No se encontraron datos para el menú</p>
          )}
        </div>

        <div className="flex-1 p-6 md:w-3/4">
          <div className="text-2xl font-semibold text-gray-700 mb-6">
            {selectedTitle ? `Analista: ${selectedTitle}` : 'S/N'}
            {selectedAnalista ? ` - ${selectedAnalista}` : ''}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Horario</h2>
              <SelectField
                label="Fecha"
                value={selectedDate}
                onChange={handleInputChange}
                options={fechaAnalista}
              />
            </div>
          </div>

          {(selectedTitle && selectedDate) && (
            <div className="bg-white shadow-lg rounded-lg p-4 mb-6">

              <div className="grid grid-cols-8 gap-4">
                <div> </div>
                {days.map((day, index) => (
                  <div key={index} className="text-center font-semibold text-gray-700">{day}</div>
                ))}
                {hours.map((hour, index) => (
                  <React.Fragment key={index}>
                    <div className="text-center text-gray-700">{hour}</div>
                    {days.map((day, dayIndex) => (
                      <div key={dayIndex} className="text-center">
                        <button
                          className={`w-full h-full text-sm font-semibold rounded-md transition-all duration-200 ${schedule[day] && schedule[day][hour] === 'Active'
                            ? 'bg-green-500 text-white'  // Color verde si está activo
                            : 'bg-gray-200'  // Color gris si está inactivo
                            }`}
                          onClick={() => handleButtonClick(day, hour)}
                        >
                          {schedule[day] && schedule[day][hour] ? (
                            <CheckCircleIcon className="text-white" />
                          ) : (
                            <RadioButtonUncheckedIcon className="text-gray-600" />
                          )}
                        </button>

                      </div>
                    ))}
                  </React.Fragment>
                ))}

              </div>
            </div>
          )}


          <div className="mt-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="py-2 px-4 border border-blue-500 rounded-md cursor-pointer"
            />
          </div>

          <ModalAnalista isOpen={isModalOpen} onClose={closeModal} />
        </div>
      </div>
    </div>
  );
}
