"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


// Íconos SVG para los menús
const IconInbox = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v5m16 0h-2.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293h-3.172a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H4" /></svg>;
const IconProject = () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const IconPlus = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const IconTrash = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconEdit = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const IconArchive = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const IconRestore = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;
const IconUser = () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconMenu = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const IconClose = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default function Dashboard() {

  // Constantes para el control de usuarios, proyectos, tareas y los usuarios del json
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [usersDb, setUsersDb] = useState<any[]>([]); 
  
  // Constantes para controlar la vista de las tareas activas y archivadas
  const [currentView, setCurrentView] = useState<"tasks" | "archived">("tasks");
  const [filterProjectId, setFilterProjectId] = useState<string | null>(null); 

  // Constantes para crear el título de la tarea, a que proyecto pertenece la tarea y a que usuario está asignada la tarea
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState(""); 
  
  // Constantes para editar el título, proyecto y usuario asignado de la tarea
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskProjectId, setEditTaskProjectId] = useState("");
  const [editTaskAssignee, setEditTaskAssignee] = useState(""); 

  // Constantes para controlar la creación y nombre de cada proyecto
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // Estado para menu móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();

  // Validación de sesiones de la aplicación
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (!session) {
      router.push("/"); //Si no existe la sesión, regresa el usuario a la raíz del proyecto
    } else {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      fetchData(parsedUser.role, parsedUser.id); // Reconoce los datos almacenados
    }
  }, [router]);

  // Función asíncrona
  const fetchData = async (userRole: string, userId: string) => {
    try {
      const [projRes, taskRes, usersRes] = await Promise.all([
        axios.get("http://localhost:3001/projects"), // Extracción de información de proyectos 
        axios.get("http://localhost:3001/tasks"), // Extracción de información de tareas
        axios.get("http://localhost:3001/users") // Extracción de información de usuarios
      ]);
      setProjects(projRes.data);
      setUsersDb(usersRes.data);
      
      // Control de roles
      if (userRole === "gerente") { // Gerente
        setTasks(taskRes.data);
      } else {
        const filteredTasks = taskRes.data.filter((t: any) => t.assignedTo === userId); // Colaborador
        setTasks(filteredTasks);
      }
    } catch (error) { console.error(error); }
  };
  // Creación de tarea
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    if (!filterProjectId && !newTaskProject) {
        alert("Por favor, selecciona a qué proyecto pertenece esta tarea.");
        return;
    }
    
    const targetProject = filterProjectId || newTaskProject;
    const assignee = newTaskAssignee || user.id; 
    // Construcción de JSON
    const newTask = { 
        id: Date.now().toString(), 
        projectId: targetProject, 
        title: newTaskTitle, 
        status: "pendiente", 
        assignedTo: assignee 
    };
    
    try {
      const res = await axios.post("http://localhost:3001/tasks", newTask); // Actualización del listado de tareas
      // Limpieza de campos
      setTasks([...tasks, res.data]); 
      setNewTaskTitle(""); 
      setNewTaskProject(""); 
      setNewTaskAssignee("");
    } catch (error) { console.error(error); }
  };
  // Actualización de tareas
  const handleToggleStatus = async (task: any) => {
    const newStatus = task.status === 'pendiente' ? 'completado' : 'pendiente'; //Cambio de estado
    try {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t)); // Actualización visual
      await axios.patch(`http://localhost:3001/tasks/${task.id}`, { status: newStatus }); // Actualización en base de datos (JSON)
    } catch (error) { 
        console.error(error);
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: task.status } : t)); // Si se falla se revierte el estado
    }
  };
  // Eliminar tarea
  const handleDeleteTask = async (taskId: string) => {
    try { await axios.delete(`http://localhost:3001/tasks/${taskId}`); setTasks(tasks.filter(t => t.id !== taskId)); } catch (error) { console.error(error); }
  };
  //Funciones para iniciar, cancelar y guardar la edición de los textos de la tarea.
  const startEditingTask = (task: any) => { 
      setEditingTaskId(task.id); 
      setEditTaskTitle(task.title); 
      setEditTaskProjectId(task.projectId); 
      setEditTaskAssignee(task.assignedTo);
  };
  const cancelEditingTask = () => { 
      setEditingTaskId(null); setEditTaskTitle(""); setEditTaskProjectId(""); setEditTaskAssignee("");
  };
  const handleSaveEditTask = async (taskId: string) => {
      if (!editTaskTitle || !editTaskProjectId || !editTaskAssignee) return;
      try {
        const res = await axios.patch(`http://localhost:3001/tasks/${taskId}`, { 
            title: editTaskTitle, 
            projectId: editTaskProjectId,
            assignedTo: editTaskAssignee
        });
        setTasks(tasks.map(t => t.id === taskId ? { ...t, ...res.data } : t));
        cancelEditingTask();
      } catch (error) { console.error(error); }
  };
  // Creación de proyectos
  const handleQuickAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) { setIsAddingProject(false); return; }
    try { //Control de proyectos que no inicien archivados
      const res = await axios.post("http://localhost:3001/projects", { id: Date.now().toString(), name: newProjectName.trim(), isArchived: false });
      setProjects([...projects, res.data]);
      setNewProjectName(""); setIsAddingProject(false); 
    } catch (error) { console.error(error); }
  };
  // Función para archivar los proyectos
  const handleArchiveProject = async (projectId: string) => {
      if (!window.confirm("¿Archivar este proyecto? Dejará de verse en la lista principal.")) return;
      try {
          const res = await axios.patch(`http://localhost:3001/projects/${projectId}`, { isArchived: true });
          setProjects(projects.map(p => p.id === projectId ? { ...p, ...res.data } : p));
          if (filterProjectId === projectId) { setFilterProjectId(null); setCurrentView("tasks"); }
      } catch (error) { console.error(error); }
  };
  // Restauración de proyecto
  const handleRestoreProject = async (projectId: string) => {
      try {
          const res = await axios.patch(`http://localhost:3001/projects/${projectId}`, { isArchived: false }); //Cambio de estado del proyecto
          setProjects(projects.map(p => p.id === projectId ? { ...p, ...res.data } : p));
      } catch (error) { console.error(error); }
  };
  // Eliminación permanente del proyecto
  const handlePermanentDeleteProject = async (projectId: string) => {
      if (!window.confirm("⚠️ ¿ELIMINAR DEFINITIVAMENTE? Esta acción no se puede deshacer y las tareas asociadas quedarán huérfanas.")) return;
      try {
          await axios.delete(`http://localhost:3001/projects/${projectId}`);
          setProjects(projects.filter(p => p.id !== projectId));
      } catch (error) { console.error(error); }
  };
  //Pequeña pantalla de carga
  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-blue-600 font-bold uppercase tracking-widest">Iniciando sistema...</div>;
  // Filtros del sistema
  const activeProjects = projects.filter(p => !p.isArchived);
  const archivedProjects = projects.filter(p => p.isArchived);
  //Filtro de tarea dependiendo en el proyecto que estemos
  const visibleTasks = tasks
    .filter(t => {
      if (filterProjectId) return t.projectId === filterProjectId;
      else return activeProjects.some(p => p.id === t.projectId);
    })
    .sort((a,b) => a.status === 'completado' ? 1 : -1); // Muuestra todas las tareas completas al final de la lista
  
  const activeProjectName = filterProjectId ? projects.find(p => p.id === filterProjectId)?.name : "Inbox";
  //Notificación de la cantidad de tareas pendientes
  const activePendingTasksCount = tasks.filter(t => t.status === 'pendiente' && activeProjects.some(p => p.id === t.projectId)).length;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 flex font-sans antid">
      
      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Nenú Responsive*/}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#f4f4f4] border-r border-gray-200 p-4 flex flex-col justify-between h-screen overflow-y-auto transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                UDB <span className="text-blue-600 font-medium">PANEL</span>
            </h2>
            {/* Botón de cerrar solo en móvil */}
            <button className="md:hidden text-gray-500 hover:text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
              <IconClose />
            </button>
          </header>

          <nav className="space-y-1 flex-1">
            <button 
              onClick={() => { setFilterProjectId(null); setNewTaskProject(""); setCurrentView("tasks"); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!filterProjectId && currentView === 'tasks' ? "bg-blue-100/60 text-blue-800" : "text-gray-700 hover:bg-gray-200/50"}`}
            >
              <span className={!filterProjectId && currentView === 'tasks' ? "text-blue-600" : "text-gray-400"}><IconInbox /></span>
              Todos
              <span className="ml-auto text-xs font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                {activePendingTasksCount}
              </span>
            </button>

            <div className="pt-6 pb-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                Proyectos
                {user.role === 'gerente' && (
                    <button onClick={() => setIsAddingProject(true)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Añadir nuevo proyecto">
                        <IconPlus />
                    </button>
                )}
            </div>
            
            {isAddingProject && (
                <form onSubmit={handleQuickAddProject} className="px-2 mb-2">
                    <input autoFocus type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} onBlur={() => { if(!newProjectName) setIsAddingProject(false); }} placeholder="Nombre del proyecto..." className="w-full p-2 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </form>
            )}

            {activeProjects.map(p => (
                <div key={p.id} className="group relative w-full flex items-center">
                    <button 
                      onClick={() => { setFilterProjectId(p.id); setCurrentView("tasks"); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors pr-8 ${filterProjectId === p.id && currentView === 'tasks' ? "bg-gray-200 text-gray-950 font-semibold" : "text-gray-700 hover:bg-gray-200/50"}`}
                    >
                      <IconProject />
                      <span className="truncate">{p.name}</span>
                    </button>
                    {user.role === 'gerente' && (
                        <button onClick={() => handleArchiveProject(p.id)} className="absolute right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-yellow-600 transition-opacity p-1" title="Archivar proyecto"><IconArchive /></button>
                    )}
                </div>
            ))}
          </nav>

          {user.role === 'gerente' && (
              <div className="mt-8 pt-4 border-t border-gray-200 border-dashed">
                  <button 
                    onClick={() => { setCurrentView("archived"); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'archived' ? "bg-gray-200 text-gray-950" : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-800"}`}
                  >
                    <IconArchive />
                    Proyectos Archivados
                    {archivedProjects.length > 0 && (
                        <span className="ml-auto text-xs font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{archivedProjects.length}</span>
                    )}
                  </button>
              </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 px-2 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase text-lg border-2 border-white shadow-md">
            {user.username[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold capitalize text-gray-950 text-sm truncate">{user.username}</div>
            <button onClick={() => { localStorage.removeItem("userSession"); router.push("/"); }} className="text-xs text-red-500 hover:text-red-600 transition-colors font-medium p-0">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* PANEL CENTRAL */}
      <main className="flex-1 bg-white overflow-y-auto h-screen w-full">
        
        {currentView === "tasks" ? (
            <>
                <header className="border-b border-gray-100 p-4 md:p-6 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm md:shadow-none">
                  <div className="flex items-center gap-3">
                    {/* Botón Hamburguesa en Móvil */}
                    <button 
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="md:hidden p-1 text-gray-500 hover:text-gray-800 focus:outline-none"
                    >
                      <IconMenu />
                    </button>
                    <h1 className="text-xl md:text-2xl font-extrabold text-gray-1000 tracking-tight flex items-center gap-2">
                      {filterProjectId && <IconProject />}
                      <span className="truncate max-w-[150px] md:max-w-none">{activeProjectName}</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 bg-gray-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-medium">
                     <span className="hidden md:inline">Rendimiento:</span>
                     <span className="md:hidden">Rend:</span>
                     <span className="font-bold text-green-600">
                        {visibleTasks.length === 0 ? 0 : Math.round((visibleTasks.filter(t => t.status === 'completado').length / visibleTasks.length) * 100)}%
                     </span>
                  </div>
                </header>

                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    {user.role === "gerente" && (
                      <form onSubmit={handleQuickAdd} className="mb-6 md:mb-8 flex flex-col md:flex-row gap-3 items-center w-full">
                        <div className="relative w-full group flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500 transition-transform group-focus-within:scale-110">
                                <IconPlus />
                            </div>
                            <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder={filterProjectId ? `Añadir tarea...` : "Escribe una tarea..."} className="w-full p-3 pl-12 rounded-xl bg-gray-100/50 border border-gray-200 text-gray-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white focus:border-blue-300 transition-all shadow-inner hover:border-gray-300" disabled={editingTaskId !== null} />
                        </div>
                        
                        <div className="flex w-full md:w-auto gap-2">
                          {!filterProjectId && (
                              <select value={newTaskProject} onChange={(e) => setNewTaskProject(e.target.value)} className="flex-1 md:w-48 p-3 rounded-xl bg-gray-100/50 border border-gray-200 text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white focus:border-blue-300 transition-all cursor-pointer" disabled={editingTaskId !== null}>
                                  <option value="">Proyecto...</option>
                                  {activeProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                          )}
                          <select 
                              value={newTaskAssignee} 
                              onChange={(e) => setNewTaskAssignee(e.target.value)} 
                              className="flex-1 md:w-40 p-3 rounded-xl bg-gray-100/50 border border-gray-200 text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white focus:border-blue-300 transition-all cursor-pointer" 
                              disabled={editingTaskId !== null}
                          >
                              <option value="">Para mí</option>
                              {usersDb.filter(u => u.id !== user.id).map(u => (
                                  <option key={u.id} value={u.id}>{u.username}</option>
                              ))}
                          </select>
                        </div>

                        <button type="submit" disabled={editingTaskId !== null} className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors shadow-md">Crear</button>
                      </form>
                    )}

                    <div className="space-y-2">
                      {visibleTasks.map((task) => {
                        const isCompletada = task.status === 'completado';
                        const taskProject = projects.find(p => p.id === task.projectId);
                        const isEditing = editingTaskId === task.id;
                        const assignedUser = usersDb.find(u => u.id === task.assignedTo);
                        
                        return (
                          <div key={task.id} className="group flex items-start md:items-center gap-3 md:gap-4 p-4 bg-white hover:bg-gray-50/50 rounded-xl transition-colors border border-gray-100 shadow-sm hover:shadow-md">
                            {!isEditing && (
                                <button onClick={() => handleToggleStatus(task)} className={`mt-1 md:mt-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0 ${isCompletada ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-blue-500'}`}>
                                    {isCompletada && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                </button>
                            )}

                            <div className="flex-1 min-w-0">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2">
                                        <input type="text" value={editTaskTitle} onChange={(e) => setEditTaskTitle(e.target.value)} className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                                        <div className="flex flex-col md:flex-row gap-2">
                                            {!filterProjectId && (
                                                <select value={editTaskProjectId} onChange={(e) => setEditTaskProjectId(e.target.value)} className="w-full md:w-1/2 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                                    {activeProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                </select>
                                            )}
                                            <select value={editTaskAssignee} onChange={(e) => setEditTaskAssignee(e.target.value)} className="w-full md:w-1/2 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                                {usersDb.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1">
                                        <p className={`font-medium text-sm md:text-base break-words transition-all ${isCompletada ? 'text-gray-400 line-through' : 'text-gray-950'}`}>{task.title}</p>
                                        
                                        <div className="flex flex-wrap items-center gap-2 mt-1 w-full">
                                            {!filterProjectId && taskProject && (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                                    {taskProject.name}
                                                </span>
                                            )}
                                            {assignedUser && (
                                                <span className={`inline-flex items-center gap-1 text-[10px] md:text-xs font-medium px-2 py-0.5 rounded border ${
                                                    assignedUser.id === user.id 
                                                    ? 'text-blue-700 bg-blue-50 border-blue-200' 
                                                    : 'text-purple-700 bg-purple-50 border-purple-200'
                                                }`}>
                                                    <IconUser /> {assignedUser.id === user.id ? `Tú (${assignedUser.username})` : assignedUser.username}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`flex flex-col md:flex-row items-center gap-1 transition-opacity ${isEditing ? 'opacity-100' : 'opacity-100 md:opacity-0 group-hover:opacity-100'}`}>
                                {isEditing ? (
                                    <div className="flex flex-col md:flex-row gap-1 w-full mt-2 md:mt-0">
                                      <button onClick={() => handleSaveEditTask(task.id)} className="w-full md:w-auto p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-bold">Guardar</button>
                                      <button onClick={cancelEditingTask} className="w-full md:w-auto p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs font-bold">Cancelar</button>
                                    </div>
                                ) : (
                                    user.role === 'gerente' && (
                                        <div className="flex gap-1">
                                          <button onClick={() => handleDeleteTask(task.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Eliminar tarea"><IconTrash /></button>
                                          <button onClick={() => startEditingTask(task)} className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Editar tarea"><IconEdit /></button>
                                        </div>
                                    )
                                )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {visibleTasks.length === 0 && (
                      <div className="text-center py-12 md:py-16 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 mt-4">
                        <div className="text-4xl md:text-5xl mb-3 md:mb-4">🎉</div>
                        <p className="font-bold text-gray-600 text-sm md:text-base">¡Todo limpio en {activeProjectName}!</p>
                      </div>
                    )}
                </div>
            </>
        ) : (
            <>
                <header className="border-b border-gray-100 p-4 md:p-6 flex items-center gap-3 sticky top-0 bg-white z-10 shadow-sm md:shadow-none">
                  <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-1 text-gray-500 hover:text-gray-800">
                    <IconMenu />
                  </button>
                  <h1 className="text-xl md:text-2xl font-extrabold text-gray-1000 tracking-tight flex items-center gap-2">
                    <IconArchive />
                    Bóveda de Archivados
                  </h1>
                </header>

                <div className="p-4 md:p-8 max-w-4xl mx-auto">
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 md:p-4 rounded-xl mb-6 md:mb-8 text-xs md:text-sm">
                        <strong>Modo Histórico:</strong> Estos proyectos están ocultos de la operación diaria. Puedes restaurarlos para volver a trabajar en ellos o eliminarlos definitivamente.
                    </div>

                    <div className="space-y-3">
                        {archivedProjects.map(project => (
                            <div key={project.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <IconProject />
                                    <span className="font-bold text-gray-800 truncate">{project.name}</span>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <button onClick={() => handleRestoreProject(project.id)} className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs md:text-sm font-semibold transition-colors"><IconRestore /> Restaurar</button>
                                    <button onClick={() => handlePermanentDeleteProject(project.id)} className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs md:text-sm font-semibold transition-colors"><IconTrash /> Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}

      </main>
    </div>
  );
}