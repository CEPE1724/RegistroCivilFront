

import React from 'react';
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

export  function DatosConyuge() {
    return (
        <div>
            <h1>Datos conyuge Daniel</h1>
            <TextField 
                id="outlined-basic"
                label="Nombre"
                variant="outlined"
            />
            <TextField
                id="outlined-basic"
                label="Apellido"
                variant="outlined"
            />
        </div>
    )
}
