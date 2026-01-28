import * as React from 'react';
import Nav from './Nav';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

function Layout({ children }) {
  console.log('🏗️ Layout.js RE-RENDER - children changed');
  
  // Layout es un componente presentacional que solo renderiza Nav + children
  // Nav se encargará de obtener userData desde el contexto
  return (
    <>
      <div className="print:hidden">
        <Nav showButton={true} />
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

// ✅ Memoizar Layout para evitar re-renders si children no cambió
export default React.memo(Layout);
