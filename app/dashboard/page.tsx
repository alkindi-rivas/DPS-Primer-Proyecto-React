"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<"tareas" | "proyectos">("tareas");

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskProject, setNewTaskProject] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskProjectId, setEditTaskProjectId] = useState("");

  const [newProjectName, setNewProjectName] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectName, setEditProjectName] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (!session) {
      router.push("/"); 
    } else {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      fetchData(parsedUser.role, parsedUser.id);
    }
  }, [router]);

  const fetchData = async (userRole: string, userId: string) => {
    try {
      const [projRes, taskRes] = await Promise.all([
        axios.get("http://localhost:3001/projects"),
        axios.get("http://localhost:3001/tasks")
      ]);
      setProjects(projRes.data);
      if (userRole === "gerente") {
        setTasks(taskRes.data);
      } else {
        const filteredTasks = taskRes.data.filter((t: any) => t.assignedTo === userId);
        setTasks(filteredTasks);
      }
    } catch (error) { console.error(error); }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskProject) return;
    const newTask = { id: Date.now().toString(), projectId: newTaskProject, title: newTaskTitle, status: "pendiente", assignedTo: user.id };
    try {
      const res = await axios.post("http://localhost:3001/tasks", newTask);
      setTasks([...tasks, res.data]); 
      setNewTaskTitle(""); setNewTaskProject("");
    } catch (error) { console.error(error); }
  };

  const handleUpdateStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pendiente' ? 'completado' : 'pendiente';
    try {
      await axios.patch(`http://localhost:3001/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) { console.error(error); }
  };

  const startEditingTask = (task: any) => { setEditingTaskId(task.id); setEditTaskTitle(task.title); setEditTaskProjectId(task.projectId); };
  const cancelEditingTask = () => { setEditingTaskId(null); setEditTaskTitle(""); setEditTaskProjectId(""); };

  const handleSaveEditTask = async (taskId: string) => {
    if (!editTaskTitle || !editTaskProjectId) return;
    try {
      const res = await axios.patch(`http://localhost:3001/tasks/${taskId}`, { title: editTaskTitle, projectId: editTaskProjectId });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, ...res.data } : t));
      cancelEditingTask();
    } catch (error) { console.error(error); }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("¿Eliminar esta tarea de la matriz?")) return;
    try { await axios.delete(`http://localhost:3001/tasks/${taskId}`); setTasks(tasks.filter(t => t.id !== taskId)); } catch (error) { console.error(error); }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;
    try {
      const res = await axios.post("http://localhost:3001/projects", { id: Date.now().toString(), name: newProjectName });
      setProjects([...projects, res.data]); setNewProjectName("");
    } catch (error) { console.error(error); }
  };

  const startEditingProject = (project: any) => { setEditingProjectId(project.id); setEditProjectName(project.name); };
  const cancelEditingProject = () => { setEditingProjectId(null); setEditProjectName(""); };

  const handleSaveEditProject = async (projectId: string) => {
    if (!editProjectName) return;
    try {
      const res = await axios.patch(`http://localhost:3001/projects/${projectId}`, { name: editProjectName });
      setProjects(projects.map(p => p.id === projectId ? { ...p, ...res.data } : p));
      cancelEditingProject();
    } catch (error) { console.error(error); }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("ATENCIÓN: ¿Eliminar este proyecto? Las tareas asociadas podrían quedar huérfanas.")) return;
    try { await axios.delete(`http://localhost:3001/projects/${projectId}`); setProjects(projects.filter(p => p.id !== projectId)); } catch (error) { console.error(error); }
  };

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-blue-600 font-bold uppercase tracking-widest">Verificando credenciales...</div>;

  // CÁLCULO ESTRATÉGICO DE RENDIMIENTO
  const completedTasks = tasks.filter(t => t.status === 'completado').length;
  const totalTasks = tasks.length;
  const performance = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // DETERMINAR COLOR DEL INDICADOR
  let performanceColor = "text-green-500";
  if (performance < 50) performanceColor = "text-red-500";
  else if (performance < 80) performanceColor = "text-yellow-500";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col md:flex-row">
      
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-6 flex flex-col justify-between shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-wide">EMKT <span className="text-blue-600">Hub</span></h2>
          <nav className="space-y-3">
            <button onClick={() => setActiveTab("tareas")} className={`w-full text-left block p-3 rounded font-semibold transition-all ${activeTab === "tareas" ? "bg-blue-50 text-blue-700 border border-blue-100" : "hover:bg-gray-100 text-gray-600"}`}>📊 Dashboard (Tareas)</button>
            <button onClick={() => setActiveTab("proyectos")} className={`w-full text-left block p-3 rounded font-semibold transition-all ${activeTab === "proyectos" ? "bg-blue-50 text-blue-700 border border-blue-100" : "hover:bg-gray-100 text-gray-600"}`}>📁 Mis Proyectos</button>
          </nav>
        </div>
        
        <div className="mt-8 md:mt-0 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Operador Activo</div>
          <div className="font-bold capitalize text-green-600 truncate">{user.username} <span className="text-gray-400 text-sm font-normal">({user.role})</span></div>
          <button onClick={() => { localStorage.removeItem("userSession"); router.push("/"); }} className="mt-4 text-sm w-full text-left text-red-500 hover:text-red-600 transition-colors font-medium flex items-center gap-2">Cerrar Sesión</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        
        {activeTab === "tareas" && (
          <div className="animate-fadeIn">
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Vista General de Tareas</h1>
              <p className="text-gray-500 mt-2 text-sm md:text-base">{user.role === 'gerente' ? "Modo Gerente: Control absoluto de la operación." : "Modo Usuario: Tareas asignadas a ti."}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Proyectos Activos</h3><span className="text-4xl font-black text-blue-600">{projects.length}</span></div>
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Tareas Visibles</h3><span className="text-4xl font-black text-yellow-500">{tasks.length}</span></div>
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                 <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Rendimiento</h3>
                 {/* EL NÚMERO AHORA ES DINÁMICO */}
                 <span className={`text-4xl font-black ${performanceColor}`}>{performance}%</span>
               </div>
            </div>
            
            {user.role === "gerente" && (
              <form onSubmit={handleCreateTask} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/2">
                  <label className="block text-gray-600 text-xs font-bold mb-2 uppercase tracking-wider">Nueva Tarea</label>
                  <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Ej. Realizar reporte SEO" className="w-full p-3 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500" required />
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-gray-600 text-xs font-bold mb-2 uppercase tracking-wider">Proyecto</label>
                  <select value={newTaskProject} onChange={(e) => setNewTaskProject(e.target.value)} className="w-full p-3 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500" required>
                    <option value="">Selecciona un proyecto...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded shadow-md">Crear</button>
              </form>
            )}

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Registro de Operaciones</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider"><th className="p-4 rounded-tl-lg font-semibold w-1/3">Tarea</th><th className="p-4 font-semibold w-1/4">Proyecto</th><th className="p-4 font-semibold w-1/6">Estado</th><th className="p-4 rounded-tr-lg font-semibold text-right">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tasks.map((task) => {
                      const isEditing = editingTaskId === task.id;
                      const projectName = projects.find(p => p.id === task.projectId)?.name || "Desconocido";
                      return (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{isEditing ? <input type="text" value={editTaskTitle} onChange={(e) => setEditTaskTitle(e.target.value)} className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"/> : task.title}</td>
                          <td className="p-4 text-gray-600">{isEditing ? <select value={editTaskProjectId} onChange={(e) => setEditTaskProjectId(e.target.value)} className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select> : projectName}</td>
                          <td className="p-4"><button onClick={() => handleUpdateStatus(task.id, task.status)} className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${task.status === 'completado' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`} disabled={isEditing}>{task.status}</button></td>
                          <td className="p-4 text-right space-x-3">
                            {isEditing ? (
                              <><button onClick={() => handleSaveEditTask(task.id)} className="text-green-600 hover:text-green-800 font-medium text-sm">Guardar</button><button onClick={cancelEditingTask} className="text-gray-500 hover:text-gray-700 font-medium text-sm">Cancelar</button></>
                            ) : (
                              user.role === 'gerente' && (
                                <><button onClick={() => startEditingTask(task)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</button><button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Eliminar</button></>
                              )
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "proyectos" && (
          <div className="animate-fadeIn">
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Gestión de Proyectos</h1>
              <p className="text-gray-500 mt-2 text-sm md:text-base">Administración de las carpetas base del sistema.</p>
            </header>

            {user.role === "gerente" && (
              <form onSubmit={handleCreateProject} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full flex-1">
                  <label className="block text-gray-600 text-xs font-bold mb-2 uppercase tracking-wider">Nuevo Proyecto</label>
                  <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="Ej. Lanzamiento Web Cliente" className="w-full p-3 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500" required />
                </div>
                <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded shadow-md">Crear Proyecto</button>
              </form>
            )}

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Directorio de Proyectos</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider"><th className="p-4 rounded-tl-lg font-semibold">ID Proyecto</th><th className="p-4 font-semibold w-1/2">Nombre del Proyecto</th><th className="p-4 rounded-tr-lg font-semibold text-right">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projects.map((project) => {
                      const isEditing = editingProjectId === project.id;
                      return (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="p-4 text-gray-500 text-sm">#{project.id}</td>
                          <td className="p-4 font-medium text-gray-900">{isEditing ? <input type="text" value={editProjectName} onChange={(e) => setEditProjectName(e.target.value)} className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"/> : project.name}</td>
                          <td className="p-4 text-right space-x-3">
                            {isEditing ? (
                              <><button onClick={() => handleSaveEditProject(project.id)} className="text-green-600 font-medium text-sm">Guardar</button><button onClick={cancelEditingProject} className="text-gray-500 font-medium text-sm">Cancelar</button></>
                            ) : (
                              user.role === 'gerente' && (
                                <><button onClick={() => startEditingProject(project)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Renombrar</button><button onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Eliminar</button></>
                              )
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}