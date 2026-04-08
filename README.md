# 🚀 UDB PANEL - Panel de Gestión de Operaciones

Creación de aplicación con React para la gestión de proyectos y control de tareas, responsive y control de roles.

## ⚙️ Arquitectura Técnica
* **Frontend:** React / Next.js
* **Estilos:** Tailwind CSS (Diseño responsivo estilo TickTick)
* **Peticiones HTTP:** Axios
* **Base de Datos Simulada:** JSON Server
* **Despliegue UI:** Vercel

## 🔥 Características Principales
1.  **Autenticación y Roles:** Control de acceso mediante `localStorage`.
2.  **Operaciones CRUD (Tareas):** Creación rápida en línea (Quick Add), edición in-place, cambio de estados dinámicos y eliminación.
3.  **Delegación de tareas:** Asignación de tareas a miembros específicos del equipo.
4.  **Eliminación de Proyectos:** Creación de proyectos y creación de sección de "Archivados" sin destruir los datos históricos, con posibilidada de restauración.
5.  **Métricas en Tiempo Real:** Cálculo matemático del rendimiento de la operación basado en tareas visibles y completadas.

## 🌐 Enlaces Oficiales
* **Repositorio (GitHub):** [https://github.com/alkindi-rivas/DPS-Primer-Proyecto-React.git]
* **Despliegue UI (Vercel):** [https://dps-primer-proyecto-react.vercel.app/]

> ⚠️ **Aviso de Evaluación:** El enlace de Vercel muestra el despliegue exitoso de la interfaz gráfica y la arquitectura en React. Sin embargo, dado que el proyecto requiere operaciones CRUD mediante `json-server`, la autenticación y gestión de datos **deben evaluarse clonando este repositorio y ejecutándolo en localhost**, siguiendo las instrucciones detalladas abajo.

## 🛠️ Instrucciones de Despliegue Local

Para ejecutar este entorno operativo en tu máquina local y probar la persistencia de datos, sigue exactamente estos pasos en tu terminal:

**1. Clonar el repositorio y acceder al directorio:**
\`\`\`bash
git clone [https://github.com/alkindi-rivas/DPS-Primer-Proyecto-React.git]
cd [DPS-Primer-Proyecto-React]
\`\`\`

**2. Instalar dependencias del sistema:**
\`\`\`bash
npm install
\`\`\`

**3. Levantar el servidor de Base de Datos:**
\`\`\`bash
npx json-server --watch db.json --port 3001
\`\`\`

**4. Levantar la Interfaz Gráfica:**
\`\`\`bash
npm run dev
\`\`\`

> 💡 **Nota Estratégica:** El frontend estará disponible en `http://localhost:3000`. Para visualizar las opciones del json estará disponible en `http://localhost:3001` Recuerde usar las credenciales configuradas en el archivo `db.json` para acceder como gerente o colaborador.