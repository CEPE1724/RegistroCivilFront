import * as React from 'react';
import Nav from './Nav';
import { fetchPerfil } from '../actions/fetchPerfil';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

export default function Layout({ children }) {
  const [userData, setUserData] = React.useState(null);

  const getUserData = async () => {
      try {
          const userPerfil = await fetchPerfil();
          setUserData(userPerfil);
      } catch (error) {
          console.error('Error al obtener los datos del perfil:', error.message);
      }
  };

  React.useEffect(() => {
      getUserData();
  }, []);

  return (
    
    <>
      {userData ? (
        <div>
          <Nav showButton={true} userData={userData} />
          <React.Fragment>
            <CssBaseline />
              <Container maxWidth="xl">
                {children}
              </Container>
          </React.Fragment>
        </div>
      ) : (
        <div>Loading...</div> // O cualquier indicador de carga que prefieras
      )}
    </>
  );
  
}


