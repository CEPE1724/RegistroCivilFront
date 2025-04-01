import React from "react";

const TrabajoModal = ({ openModal, closeModal }) => {
  if (!openModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl sm:max-w-3xl md:max-w-2xl lg:max-w-7xl p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Trabajo</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            <label className="font-semibold">Tipo de Vivienda</label>
            <div className="flex flex-wrap sm:flex-row sm:space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="housing"
                  value="dependiente"
                  className="form-radio"
                />
                <span>Dependiente</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="housing"
                  value="independiente"
                  className="form-radio"
                />
                <span>Independiente</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="housing"
                  value="informal"
                  className="form-radio"
                />
                <span>Informal</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="font-semibold">Tiempo de Trabajo (Meses)</label>
              <input
                type="number"
                placeholder="Tiempo de Trabajo (Meses)"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
            <div>
              <label className="font-semibold">Tiempo de Trabajo (Años)</label>
              <input
                type="number"
                placeholder="Tiempo de Trabajo (Años)"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
            <div>
              <label className="font-semibold">Ingresos Mensuales</label>
              <input
                type="number"
                placeholder="Ingresos Mensuales"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
            <div>
              <label className="font-semibold">Actividad Laboral</label>
              <input
                type="text"
                placeholder="Actividad Laboral"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="font-semibold">Teléfono Laboral</label>
              <input
                type="text"
                placeholder="Teléfono Laboral"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
            <div>
              <label className="font-semibold">Latitud</label>
              <input
                type="text"
                placeholder="Latitud"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
            <div>
              <label className="font-semibold">Longitud</label>
              <input
                type="text"
                placeholder="Longitud"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
            <div>
              <label className="font-semibold">GPS</label>
              <input
                type="text"
                placeholder="GPS"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">
                Punto de Referencia Laboral
              </label>
              <input
                type="text"
                placeholder="Punto de Referencia Laboral"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
            <div>
              <label className="font-semibold">Persona Entrevistada</label>
              <input
                type="text"
                placeholder="Persona Entrevistada"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Calle Principal</label>
              <input
                type="text"
                placeholder="Calle Principal"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
            <div>
              <label className="font-semibold">Calle Secundaria</label>
              <input
                type="text"
                placeholder="Calle Secundaria"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={closeModal}
            className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-gray-400 text-white border border-white hover:bg-white hover:text-gray-400 hover:border-gray-400 text-xs px-6 py-2.5 mb-4"
          >
            Salir
          </button>
          <button
            onClick={closeModal}
            className="rounded-full hover:shadow-md transition duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue text-xs px-6 py-2.5 mb-4"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrabajoModal;