flowchart TD
    A[<b>👨‍💻 Desarrollador</b><br/>Escribe código en React] --> B[<b>🐙 GitHub Repo</b><br/>Código fuente del proyecto]
    B -->|git push| C[<b>⚙️ GitHub Actions</b><br/>Pipeline CI/CD]
    
    C -->|Conecta vía SSH + llaves SSL| D[<b>🐧 Servidor AlmaLinux</b><br/>Entorno de producción]
    
    D -->|Descarga repositorio + ejecuta docker-compose| E[<b>🐳 Docker</b><br/>Construye imagen desde Dockerfile]
    
    E -->|Inicia contenedor| F[<b>🧩 React App Build</b><br/>Contenido servido estáticamente]
    
    F -->|Servido por| G[<b>🌐 Nginx Proxy</b><br/>Servidor web / reverse proxy]
    
    G -->|Entrega contenido| H[<b>💻 Navegador del Usuario</b><br/>Visualiza la aplicación React]
    
    %% Estilos
    classDef github fill:#24292e,stroke:#888,stroke-width:1px,color:#fff;
    classDef actions fill:#2088ff,stroke:#007bff,color:#fff;
    classDef linux fill:#303030,stroke:#999,color:#fff;
    classDef docker fill:#0db7ed,stroke:#006c8c,color:#fff;
    classDef nginx fill:#009639,stroke:#007b33,color:#fff;
    classDef user fill:#f0f0f0,stroke:#ccc,color:#000;

    class B github;
    class C actions;
    class D linux;
    class E,F docker;
    class G nginx;
    class H user;
