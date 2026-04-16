"use client"; // Este componente corre en el navegador (cliente)

import { useState } from "react";
import { useRouter } from "next/navigation";

// Definimos la "forma" (tipo) de los datos que nos devolverá el servidor
type ResultItem = {
  text: string;
  similarity: string;
};

export default function DashboardPage() {
  // === ESTADOS (STATE) ===
  const [query, setQuery] = useState(""); // Guarda la palabra o texto que el usuario escribe
  const [loading, setLoading] = useState(false); // Guarda 'true' si estamos esperando respuesta del servidor
  
  // Guardamos las respuestas del servidor
  const [transformerOutput, setTransformerOutput] = useState<string | null>(null); // El texto devuelto por el transformer
  const [vectorResults, setVectorResults] = useState<ResultItem[] | null>(null); // Los resultados de la base de datos comparados por vector

  const router = useRouter();

  // === FUNCIONES (MÉTODOS) ===
  
  // Esta función se activa cuando damos click en "Cerrar Sesión"
  const handleLogout = () => {
    // Si estuviéramos borrando cookies aquí lo haríamos. Por simplicidad solo redirigimos.
    router.push("/login"); 
  };

  // Esta función se activa al enviar el formulario (cuando apretamos "Analizar Texto")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return; // Si no hay nada escrito, no hacemos nada

    setLoading(true); // Cambiamos a cargando para mostrar el mensaje de "Pensando..."

    try {
      // Llamamos al endpoint que se encarga de Vectorizar usar Transformers
      const res = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }), // Enviamos la palabra que escribimos
      });

      if (res.ok) {
        const data = await res.json();
        // Recibimos los datos y los guardamos en las variables correspondientes
        setTransformerOutput(data.transformacion);
        setVectorResults(data.results);
      } else {
        alert("Ocurrió un error al analizar el texto.");
      }
    } catch (error) {
      console.log(error);
      alert("Error de conexión con la IA.");
    } finally {
      // Pase lo que pase (éxito o error), dejamos de cargar
      setLoading(false);
    }
  };

  // === INTERFAZ (UI) ===
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 font-sans">
      
      {/* BARRA SUPERIOR (HEADER) */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Panel de Transformers</h1>
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-4 py-2 rounded-lg transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: EL INPUT */}
        <div className="col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 h-fit">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Ingresa tu consulta</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: inteligencia artificial..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {/* Si loading es true, el botón dice "Pensando..." y se desactiva */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              {loading ? "Pensando..." : "Analizar Texto"}
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: LOS RESULTADOS (OUTPUTS) */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          
          {/* OUTPUT 1: TRANSFORMER */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 min-h-[200px]">
             <div className="flex items-center mb-4">
                 <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Respuesta del Transformer</h2>
             </div>
             
             {/* Mostramos el texto del transformer o un mensaje si aún no hay nada */}
             {loading ? (
                <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800 h-24 rounded-xl"></div>
             ) : transformerOutput ? (
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                  {transformerOutput}
                </p>
             ) : (
                <p className="text-zinc-400 text-sm flex items-center h-full">Los resultados aparecerán aquí...</p>
             )}
          </div>

          {/* OUTPUT 2: VECTORES DB */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 min-h-[200px]">
             <div className="flex items-center mb-4">
                 <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Similitud de Vectores (Base de Datos)</h2>
             </div>
             
             {/* Mostramos los resultados de similitud o un mensaje por defecto */}
             {loading ? (
                <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800 h-24 rounded-xl"></div>
             ) : vectorResults && vectorResults.length > 0 ? (
                <ul className="space-y-3">
                  {/* .map() es como un bucle "for" en React. Por cada resultado dibujamos una cosita. */}
                  {vectorResults.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-700 dark:text-zinc-300 w-3/4 truncate pr-4">{item.text}</span>
                      <span className="font-mono text-sm bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-md font-medium">
                        {item.similarity}
                      </span>
                    </li>
                  ))}
                </ul>
             ) : vectorResults?.length === 0 ? (
                <p className="text-zinc-400 text-sm">No hay coincidencias anteriores en la BD.</p>
             ) : (
                <p className="text-zinc-400 text-sm flex items-center h-full">Los resultados aparecerán aquí...</p>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
