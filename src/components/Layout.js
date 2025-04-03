import * as React from 'react';
import Nav from './Nav';
import { useAuth } from '../components/AuthContext/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

export default function Layout({ children }) {
  // Usamos el hook `useAuth` para obtener `userData` y otros valores del contexto
  const { userData, isLoggedIn } = useAuth();

 console.log(userData);
 

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
        <div>Loading...</div> 
      )}
    </>
  );
}
