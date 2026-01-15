import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { TextField } from "@mui/material";
import { IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import axios from "../../../configApi/axiosConfig";
import { APIURL } from "../../../configApi/apiConfig";
import { enqueueSnackbar } from "notistack";
import { FaListAlt, FaMoneyBillWave, FaMoneyCheckAlt, FaCommentDots } from "react-icons/fa";
import { useAuth } from "../../AuthContext/AuthContext"
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box } from '@mui/material';


// Definir el componente con forwardRef correctamente
export const FactoresCredito = forwardRef((props, ref) => {
  const { data, fetchCuotaCupo, estSol } = props;
  const [tipo, setTipo] = useState([]);
  const { userData, idMenu } = useAuth();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [loadingActualizar, setLoadingActualizar] = useState(false);
  const [formData, setFormData] = useState({
    tipoCliente: data.idTipoCliente || 0,
    tipo: "",
    tipoTrabajo: "",
    cuotaAsignada: data.CuotaAsignada || 0,
    cupo: data.Cupo || 0,
    calificacion: "",
    estadoSolicitud: "",
    observaciones: "",
  });
  // obtener los datos del formulario
  const getFormData = () => {
    return {
      cuotaAsignada: formData.cuotaAsignada,
      cupo: formData.cupo,
    };
  };

  const [cuotaOriginal, setCuotaOriginal] = useState("")
  const [cuotaActualizada, setCuotaActualizada] = useState("")
  const [cupoOriginal, setCupoOriginal] = useState("")
  const [observacion, setObservacion] = useState("")
  const [cupoActualizado, setCupoActualizado] = useState("")

  useEffect(() => {
    if (data?.CuotaAsignada && cuotaOriginal === "") {
      setCuotaOriginal(data.CuotaAsignada);
    }

    if (data?.Cupo && cupoOriginal === "") {
      setCupoOriginal(data.Cupo);
    }
  }, [data]);

  useEffect(() => {
    setCuotaActualizada(formData?.cuotaAsignada || "");
    setCupoActualizado(formData?.cupo || "");
  }, [formData]);

  ///// permisos 
  const [permisos, setPermisos] = useState([]);

  const permissionscomponents = async (idMenu, idUsuario) => {
    try {
      const url = APIURL.getacces(idMenu, idUsuario);
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setPermisos(data);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching permissions components:", error);
    }
  };

  const permisoEditar = (data) => {
    const permiso = permisos.find((p) => p.Permisos === `EDITAR VALORES DE CREDITO`);
    // Retornar true si no existe el permiso o si no está activo
    return !permiso || !permiso.Activo;
  };

  // Función para validar el formulario
  const validateForm = () => {
    if (!formData.cuotaAsignada || formData.cuotaAsignada <= 0) return false;
    if (!formData.cupo || formData.cupo <= 0) return false;
    return true;
  };



  // Expone las funciones al componente padre
  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      cuotaAsignada: Number(formData.cuotaAsignada),
      cupo: Number(formData.cupo)
    }),
    validateForm,
  }));
  useEffect(() => {
    fetchTipoCliente();
    permissionscomponents(idMenu, userData.idUsuario);
  }, []);

  const fetchTipoCliente = async () => {
    try {
      const response = await axios.get(APIURL.getTipoCliente());
      if (response.status === 200) {
        setTipo(
          response.data.map((item) => ({
            value: item.idTipoCliente,
            label: item.Nombre,
          }))
        );
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al obtener el tipo de cliente:", error);
      enqueueSnackbar("No se pudo cargar los tipos de clientes", {
        variant: "error",
      });
      //  setTipo([]);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    if (name === "cupo" && numericValue > 2500) {
      enqueueSnackbar("El cupo máximo permitido es 2500", { variant: "warning" });
      setFormData(prev => ({ ...prev, [name]: 2500 }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: numericValue }));
  };



  const handleBlur = (e) => {
    const { name, value } = e.target;
    const numValue = Number(value);

    if (name === "cuotaAsignada" && numValue < 30) {
      enqueueSnackbar("La cuota mínima permitida es 30", { variant: "warning" });
      setFormData(prev => ({
        ...prev,
        [name]: 30
      }));
    }
  };


  // Exponer la función handleSubmit al padre

  const fetchInsertarDatos = async (data) => {

    try {
      const url = APIURL.post_createtiemposolicitudeswebDto();

      await axios.post(url, {
        idCre_SolicitudWeb: data.idCre_SolicitudWeb,
        Tipo: 1,
        idEstadoVerificacionDocumental: 26,
        Usuario: userData.Nombre,
        Telefono: `Se actualizo Cuota de ${cuotaOriginal} a ${cuotaActualizada} y Cupo de ${cupoOriginal} a ${cupoActualizado}. Obs: ${observacion}`,

      });
    } catch (error) {
      console.error("Error al guardar los datos del cliente", error);
    }
  };

  const handleActualizar = async () => {
    if (loadingActualizar) return; // evita ejecuciones múltiples

    try {
      setLoadingActualizar(true); // bloquear botón

      const formData = getFormData();
      if (!validateForm()) {
        enqueueSnackbar("Datos incorrectos", { variant: "error" });
        return;
      }
      // Captura la respuesta aquí
      const response = await fetchCuotaCupo(formData);


      // Verifica la respuesta y muestra el mensaje adecuado
      if (response && response.success === false) {
        enqueueSnackbar(response.message || "Error al actualizar", { variant: "error" });
        return;
      }

      await fetchInsertarDatos(data)
      setOpenConfirmModal(false)
      enqueueSnackbar("Cuota/Cupo actualizados correctamente", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error al actualizar los datos", { variant: "error" });
      console.error("Error al guardar:", error);
    } finally {
      setLoadingActualizar(false); // liberar botón
    }
  };
  const isObservacionValida = observacion.trim().length >= 10 && observacion.trim().length <= 100;

  const hasChanges =
    (Number(cuotaOriginal) !== Number(cuotaActualizada) ||
      Number(cupoOriginal) !== Number(cupoActualizado)) &&
    isObservacionValida;

  return (
    <div>
      {/* Botón de impresión y selects superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 pt-0">
        {/* Tipo */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaListAlt className="mr-2 text-primaryBlue" />
            Tipo
          </label>
          <select
            name="tipo"
            className="solcitudgrande-style"
            value={data.idTipoCliente}
            onChange={handleChange}
            disabled
          >
            <option value="">Seleccione una opción</option>
            {tipo.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cuota Asignada */}
        <div className="flex flex-col w-full">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMoneyBillWave className="mr-2 text-primaryBlue" />
            Cuota Asignada
          </label>
          <input
            type="number"
            name="cuotaAsignada"
            placeholder="Cuota Asignada"
            className="solcitudgrande-style"
            value={formData.cuotaAsignada}
            onChange={handleChange}
            onBlur={handleBlur}
            readOnly={estSol !== 12}
          />
        </div>

        {/* Cupo */}
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1 flex items-center">
            <FaMoneyCheckAlt className="mr-2 text-primaryBlue" />
            Cupo
          </label>
          <input
            type="number"
            name="cupo"
            placeholder="Cupo"
            className="solcitudgrande-style"
            value={formData.cupo}
            onChange={handleChange}
            readOnly={estSol !== 12}
          />
        </div>

        <div className="flex justify-between items-center pl-8 pt-6">
          <IconButton
            color="primary"
            aria-label="Imprimir"
            onClick={() => window.print()}
            style={{ fontSize: '40px' }}
          >
            <PrintIcon />
          </IconButton>

          {(estSol === 12 || estSol === 10) && !permisoEditar() && (<div className="flex items-center">
            <button
              onClick={() => setOpenConfirmModal(true)}
              className="w-[150px] min-w-[120px] rounded-full hover:shadow-md duration-300 ease-in-out group bg-primaryBlue text-white border border-white hover:bg-white hover:text-primaryBlue hover:border-primaryBlue transition-colors text-xs px-8 py-2.5 focus:shadow-none flex items-center justify-center space-x-2">
              <SaveIcon className="text-lg" />
              <span className="text-xs">Actualizar</span>
            </button>
          </div>)}
        </div>
      </div>

      {/* Modal de confirmación */}
      <Dialog
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: { borderRadius: 12, padding: 20 }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1} color="orange">
            <WarningAmberIcon />
            <Typography variant="h6" fontWeight="bold">
              Confirmar actualización
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Estás por actualizar los siguientes valores:
          </Typography>

          <Box mt={3} bgcolor="#f9f9f9" p={2} borderRadius={2} border="1px solid #ddd">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Cuota Asignada
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography color="text.secondary">
                Anterior: <strong>${cuotaOriginal}</strong>
              </Typography>
              <Typography color="primary">
                Nuevo: <strong>${cuotaActualizada}</strong>
              </Typography>
            </Box>
          </Box>



          <Box mt={2} bgcolor="#f9f9f9" p={2} borderRadius={2} border="1px solid #ddd">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Cupo
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography color="text.secondary">
                Anterior: <strong>${cupoOriginal}</strong>
              </Typography>
              <Typography color="primary">
                Nuevo: <strong>${cupoActualizado}</strong>
              </Typography>
            </Box>
          </Box>

          <Box mt={3} bgcolor="#f9f9f9" p={2} borderRadius={2} border="1px solid #ddd">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Observación
            </Typography>

            <TextField
              value={observacion}
              onChange={(e) => setObservacion(e.target.value.toUpperCase())}
              variant="outlined"
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              inputProps={{ maxLength: 100 }}
              sx={{ mt: 1 }}
              placeholder="Escribe una observación clara y concisa"
              error={observacion.length > 0 && observacion.length < 10}
              helperText={
                observacion.length > 0 && observacion.length < 10
                  ? "La observación debe tener al menos 10 caracteres"
                  : `${observacion.length}/100 caracteres`
              }
            />
          </Box>


        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", mt: 1 }}>
          <Button
            onClick={() => setOpenConfirmModal(false)}
            variant="outlined"
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleActualizar}
            variant="contained"
            color="primary"
            disabled={!hasChanges || loadingActualizar}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );

});
