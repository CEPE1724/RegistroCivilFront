import React from "react";

const DomicilioModal = ({ openModal, closeModal }) => {
  if (!openModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Domicilio</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div>
              <label className="font-semibold">Tipo de Vivienda (Meses)</label>
              <input
                type="text"
                placeholder="Tipo de Vivienda (Meses)"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
              />
            </div>

            <div>
              <label className="font-semibold">Tipo de Vivienda</label>
              <div className="flex flex-col mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="dependiente"
                    className="form-radio"
                  />
                  <span>Casa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="independiente"
                    className="form-radio"
                  />
                  <span>Mixta</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="informal"
                    className="form-radio"
                  />
                  <span>Media agua</span>
                </label>
				<label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="informal"
                    className="form-radio"
                  />
                  <span>Villa</span>
                </label>
				<label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="informal"
                    className="form-radio"
                  />
                  <span>Departamento</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold">Estado Vivienda</label>
              <div className="flex flex-col mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="dependiente"
                    className="form-radio"
                  />
                  <span>Bueno</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="independiente"
                    className="form-radio"
                  />
                  <span>Muy Bueno</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="informal"
                    className="form-radio"
                  />
                  <span>Malo</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold">Zona Vivienda</label>
              <div className="flex flex-col mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="dependiente"
                    className="form-radio"
                  />
                  <span>Urbano</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="independiente"
                    className="form-radio"
                  />
                  <span>Rural</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold">Propiedad</label>
              <div className="flex flex-col mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="dependiente"
                    className="form-radio"
                  />
                  <span>Propio</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="independiente"
                    className="form-radio"
                  />
                  <span>Familiar</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="informal"
                    className="form-radio"
                  />
                  <span>Arrendado</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold">Acceso</label>
              <div className="flex flex-col mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="dependiente"
                    className="form-radio"
                  />
                  <span>Facil</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="independiente"
                    className="form-radio"
                  />
                  <span>Dificil</span>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div>
              <label className="font-semibold">Cobertura de señal</label>
              <div className="flex flex-col mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="llammadaMovil"
                    className="form-radio"
                  />
                  <span>Llamada Movil</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="housing"
                    value="WhatsApp"
                    className="form-radio"
                  />
                  <span>WhatsAp</span>
                </label>
              </div>
            </div>

            <div>
              <div>
                <label className="font-semibold">Teléfono Laboral</label>
                <input
                  type="number"
                  placeholder="Teléfono Laboral"
                  className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4">
            <div>
              <label className="font-semibold">Punto de Referencia</label>
              <textarea
                placeholder="Punto de Referencia"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                rows="4"
              />
            </div>

            <div>
              <label className="font-semibold">Persona Entrevistada</label>
              <textarea
                placeholder="Persona entrevistada"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                rows="4"
              />
            </div>

            <div>
              <label className="font-semibold">Obserbacion</label>
              <textarea
                placeholder="Punto de Referencia"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                rows="4"
              />
            </div>

            <div>
              <label className="font-semibold">Vecino Entrevistado</label>
              <textarea
                placeholder="Vecino Enrevistado"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                rows="4"
              />
            </div>

			<div>
              <label className="font-semibold">Calle Principal</label>
              <textarea
                placeholder="Calle Principal"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                rows="4"
              />
            </div>

			<div>
              <label className="font-semibold">Calle Secundaria</label>
              <textarea
                placeholder="Calle Secundaria"
                className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                rows="4"
              />
            </div>

			<div>
                <label className="font-semibold">GPS</label>
                <input
                  type="number"
                  placeholder="GPS"
                  className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
            </div>

			<div>
                <label className="font-semibold">Latitud</label>
                <input
                  type="number"
                  placeholder="Latitudl"
                  className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
            </div>

			<div>
                <label className="font-semibold">Longitud</label>
                <input
                  type="number"
                  placeholder="Longitud"
                  className="block bg-[#F9FAFB] w-full rounded-md border-2 border-blue-500 px-4 py-2 shadow-sm"
                />
              </div>

          </div>

          {/* <div className="grid grid-cols-2 gap-4">
          </div> */}

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

export default DomicilioModal;
