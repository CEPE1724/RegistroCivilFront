import * as React from 'react';
import Nav from './Nav';
import { useAuth } from '../components/AuthContext/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

export default function Layout({ children }) {
  // Usamos el hook `useAuth` para obtener `userData` y otros valores del contexto
  const { userData, isLoggedIn } = useAuth();

  // Siempre mostramos el Nav incluso si userData está cargando o hay error de conexión
  return (
    <>
      <div className="print:hidden">
        <Nav showButton={true} userData={userData || { Nombre: 'Cargando...' }} />
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth="xl">
            {children}
          </Container>
        </React.Fragment>
      </div>
    </>
  );
}
