"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.get("http://localhost:3001/users");
      const users = res.data;
      
      const user = users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("userSession", JSON.stringify(user));
        router.push("/dashboard");
      } else {
        setError("Credenciales incorrectas. El acceso ha sido denegado.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor. Verifica que json-server esté corriendo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-xl shadow-xl w-full max-w-sm border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-wide">EMKT <span className="text-blue-600">Hub</span></h1>
          <p className="text-gray-500 text-sm mt-2">Acceso restringido</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-6 text-center">
            {error}
          </div>
        )}
        
        <div className="mb-5">
          <label className="block text-gray-600 text-xs font-bold mb-2 uppercase tracking-wider">Usuario</label>
          <input 
            type="text" 
            className="w-full p-3 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Ej. alkindi"
            required 
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-gray-600 text-xs font-bold mb-2 uppercase tracking-wider">Contraseña</label>
          <input 
            type="password" 
            className="w-full p-3 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required 
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}