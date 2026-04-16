"use client"; // Le dice a React que este componente se ejecutará en el navegador del usuario.

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // === ESTADOS (STATE) ===
  // Variables especiales de React. Si estas variables cambian, la vista se actualiza automáticamente.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // useRouter nos sirve para llevar al usuario a otra pantalla una vez que termine.
  const router = useRouter();

  // === FUNCIONES (MÉTODOS) ===
  // Función conectada al botón del formulario.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Detiene el comportamiento natural del navegador de recargar la página.
    setError(""); // Esconde cualquier error que se mostró antes.

    try {
      // Pide al servidor de "login" que inicie sesión.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Envía el correo y clave escritos.
      });

      if (res.ok) {
        // La API guardó la cookie (token). Ahora vamos al Dashboard.
        router.push("/dashboard");
      } else {
        // La API dice que credenciales son incorrectas. Extraemos y mostramos el error.
        const data = await res.json();
        setError(data.error || "Ocurrió un error al iniciar sesión.");
      }
    } catch (err) {
      console.log(err);
      setError("Error de conexión al servidor.");
    }
  };

  // === INTERFAZ (UI) ===
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
        
        {/* TÍTULO */}
        <h1 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-2">Bienvenido de Vuelta</h1>
        <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8">Inicia sesión en Transformers</p>

        {/* MENSAJE DE ERROR CONDICIONAL */}
        {/* Esto solo se dibuja (renderiza) en la pantalla si la variable "error" tiene algún texto. */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* CAMPO CORREO */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email} // Conecta la cajita de texto con la variable "email"
              onChange={(e) => setEmail(e.target.value)} // Copia lo que el usuario escribe hacia la variable.
              required
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* CAMPO CONTRASEÑA */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* BOTÓN INGRESAR */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            Ingresar
          </button>
        </form>

        {/* LINK A REGISTRO */}
        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          ¿No tienes una cuenta aún?{" "}
          <button 
            type="button" 
            onClick={() => router.push('/register')} 
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Regístrate aquí
          </button>
        </p>

      </div>
    </div>
  );
}
