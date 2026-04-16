"use client"; // Le dice a React que este componente se ejecutará en el navegador del usuario (cliente).

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  // === ESTADOS (STATE) ===
  // useState nos permite guardar datos. Aquí guardamos lo que el usuario escribe y si hay algún error.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // useRouter nos permite navegar (cambiar de página) programáticamente.
  const router = useRouter();

  // === FUNCIONES (MÉTODOS) ===
  // Esta función se ejecuta cuando el usuario le da click al botón "Registrarse".
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de los formularios).
    setError(""); // Limpiamos cualquier error previo.

    try {
      // Usamos fetch para enviar los datos a nuestra propia API creada en Next.js.
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Convertimos nuestros datos a formato JSON para enviarlos
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        // ¡Éxito! Si todo salió bien, enviamos al usuario a la página de login.
        router.push("/login");
      } else {
        // Si hay error (ej. el correo ya existe), tomamos el mensaje de error de la API.
        const data = await res.json();
        setError(data.error || "Ocurrió un error al registrar.");
      }
    } catch (err) {
      console.log(err);
      setError("Error de conexión al servidor.");
    }
  };

  // === INTERFAZ (UI) ===
  // Aquí devolvemos el código HTML (JSX) mezclado con estilos de TailwindCSS.
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
        
        {/* TÍTULO */}
        <h1 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-2">Crear Cuenta</h1>
        <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8">Comienza a usar Transformers</p>

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* EL FORMULARIO */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* CAMPO DE NOMBRE */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nombre</label>
            <input
              type="text"
              value={name} // Conectamos el input a nuestro state "name"
              onChange={(e) => setName(e.target.value)} // Cada vez que el usuario teclea, actualiza "name"
              required // Hace que este campo sea obligatorio
              placeholder="Juan Pérez"
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* CAMPO DE CORREO */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email} // Conectamos al state "email"
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* CAMPO DE CONTRASEÑA */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password} // Conectamos al state "password"
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* BOTÓN SUBMIT */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            Registrarse
          </button>
        </form>

        {/* LINK AL LOGIN */}
        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          ¿Ya tienes una cuenta?{" "}
          <button 
            type="button" 
            onClick={() => router.push('/login')} 
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Inicia Sesión
          </button>
        </p>

      </div>
    </div>
  );
}
