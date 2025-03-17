import React, { useState, useMemo } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icono de activado
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'; // Icono de desactivado
import Papa from 'papaparse'; // Importamos papaparse para leer archivos CSV

// Definición de la navegación
const NAVIGATION = [
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      { segment: 'sales', title: 'Sales', icon: <DescriptionIcon /> },
      { segment: 'traffic', title: 'Traffic', icon: <DescriptionIcon /> },
    ],
  },
];

// Hook para manejar la navegación
function useDemoRouter(initialPath) {
  const [pathname, setPathname] = useState(initialPath);

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

// Generar las horas de 7 AM a 10 PM
const hours = [];
for (let i = 7; i <= 22; i++) {
  hours.push(`${i}:00`);
}

// Días de la semana
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function CalendarPerson(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');
  const demoWindow = window ? window() : undefined;

  // Estado para manejar la visibilidad de los submenús
  const [open, setOpen] = useState({});
  const [selectedTitle, setSelectedTitle] = useState(''); // Estado para el título seleccionado
  const [schedule, setSchedule] = useState({}); // Estado para el horario interactivo

  // Función para alternar la visibilidad de los submenús
  const toggleMenu = (segment) => {
    setOpen((prevState) => ({
      ...prevState,
      [segment]: !prevState[segment],
    }));
  };

  // Función para manejar la selección de un ítem del menú
  const handleMenuClick = (title) => {
    setSelectedTitle(title); // Actualiza el título seleccionado
  };

  // Función para manejar la subida de archivo CSV
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data;
          const updatedSchedule = {};

          // Procesamos los datos del CSV
          data.forEach((row) => {
            const { Day, Hour, Status } = row;
            if (!days.includes(Day) || !hours.includes(Hour)) return; // Validar si el día y hora son válidos

            if (!updatedSchedule[Day]) updatedSchedule[Day] = {};
            updatedSchedule[Day][Hour] = Status === 'Active'; // Activo si 'Active', inactivo si 'Inactive'
          });

          // Actualizamos el estado con la programación
          setSchedule(updatedSchedule);
        },
        header: true, // Indicar que el archivo tiene cabeceras
      });
    }
  };

  // Función para manejar el click en los botones (selección de hora y día)
  const handleButtonClick = (day, hour) => {
    setSchedule((prevSchedule) => {
      const updatedSchedule = { ...prevSchedule };
      if (!updatedSchedule[day]) updatedSchedule[day] = {};
      updatedSchedule[day][hour] = !updatedSchedule[day][hour]; // Alterna la selección
      return updatedSchedule;
    });
  };

  return (
    <div className="flex flex-col bg-gray-100 overflow-x-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Barra lateral con fondo blanco y bordes */}
        <div className="flex flex-col w-full md:w-1/4 bg-white p-5 text-black border-r border-gray-300 shadow-lg">
          {NAVIGATION.map((item, index) => (
            <div key={index} className="mb-3">
              {item.kind === 'header' ? (
                <h3 className="font-bold text-lg text-gray-700">{item.title}</h3>
              ) : (
                <div>
                  {/* Botón de icono para cada sección con bordes y transición */}
                  <button
                    className="flex items-center space-x-2 w-full text-left text-blue-600 py-3 px-5 rounded-md hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => toggleMenu(item.segment)}
                  >
                    {/* Icono azul */}
                    <span className="text-blue-600">{item.icon}</span>
                    <span className="text-gray-700">{item.title}</span>
                  </button>

                  {/* Submenú desplazable con animación */}
                  {item.children && open[item.segment] && (
                    <div
                      className="pl-6 mt-2 transition-all ease-in-out duration-300 max-h-60 overflow-y-auto border-l-4 border-blue-500"
                      style={{ maxHeight: '300px' }}
                    >
                      {item.children.map((child, childIndex) => (
                        <button
                          key={childIndex}
                          className="flex items-center space-x-3 w-64 text-left text-blue-600 py-2 px-5 rounded-md hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                          onClick={() => handleMenuClick(child.title)} // Manejar la selección
                        >
                          {/* Icono azul en los submenús */}
                          <span className="text-blue-600">{child.icon}</span>
                          <span className="text-gray-700">{child.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contenedor principal con el calendario a la derecha */}
        <div className="flex-1 p-6 md:w-3/4">
          {/* Mostrar el título del menú seleccionado */}
          <div className="text-2xl font-semibold text-gray-700 mb-6">
            {selectedTitle ? `Selected: ${selectedTitle}` : 'Select an option'}
          </div>

          {/* Contenedor de la tabla simulada con días de la semana y horas */}
          <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-xl text-gray-700 mb-4">Weekly Schedule</h3>
            <div className="grid grid-cols-8 gap-4">
              {/* Espacio vacío para cabecera de horas */}
              <div></div>
              {days.map((day, index) => (
                <div key={index} className="text-center font-semibold text-gray-700">{day}</div>
              ))}
              {hours.map((hour, index) => (
                <React.Fragment key={index}>
                  <div className="text-center text-gray-700">{hour}</div>
                  {days.map((day, dayIndex) => (
                    <div key={dayIndex} className="text-center">
                      {/* Botón interactivo para seleccionar horario */}
                      <button
                        className={`w-full h-full text-sm font-semibold rounded-md transition-all duration-200 ${schedule[day] && schedule[day][hour] ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleButtonClick(day, hour)} // Maneja el click
                      >
                        {/* Icono de estado */}
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

          {/* Botón para subir archivo CSV */}
          <div className="mt-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="py-2 px-4 border border-blue-500 rounded-md cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
