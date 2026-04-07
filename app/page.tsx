"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  // Manejo de estados para el formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Consultamos la API simulada usando Axios
      const res = await axios.get("http://localhost:3001/users");
      const users = res.data;
      
      // Buscamos si existe una coincidencia exacta
      const user = users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (user) {
        // Almacenamiento de sesión en localStorage (Requerimiento de rúbrica)
        localStorage.setItem("userSession", JSON.stringify(user));
        
        // Redirigimos al área protegida
        router.push("/dashboard");
      } else {
        setError("Credenciales incorrectas. El acceso ha sido denegado.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor. Verifica que json-server esté corriendo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-sm border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide">UDB <span className="text-blue-500">PROYECTOS</span></h1>
          <p className="text-gray-400 text-sm mt-2">Acceso restringido</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded mb-6 text-center">
            {error}
          </div>
        )}
        
        <div className="mb-5">
          <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">Usuario</label>
          <input 
            type="text" 
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Ej. alkindi"
            required 
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">Contraseña</label>
          <input 
            type="password" 
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required 
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}