// src/features/learn/LearnPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/shared/components/layout/Header";
import { Footer } from "@/shared/components/layout/Footer";
import AlgorithmVisualizer from "@/features/problem/components/AlgorithmVisualizer";
import type { LeetCodeProblem } from "@/shared/types";
import { 
  BookOpen, 
  ArrowLeft, 
  Code, 
  Sparkles, 
  Cpu, 
  Layers, 
  Compass,
  ArrowRight,
  Bookmark,
  Activity,
  GitBranch,
  Timer
} from "lucide-react";

interface AlgorithmDoc {
  id: string;
  problemId: string;
  name: string;
  category: string;
  shortDesc: string;
  icon: React.ReactNode;
  theory: string[];
  useCases: string[];
  complexity: {
    time: string;
    space: string;
    timeExplain: string;
    spaceExplain: string;
  };
  mockProblem: LeetCodeProblem;
  exerciseName: string;
  exerciseDesc: string;
}

const ACTIVE_ALGORITHMS: AlgorithmDoc[] = [
  {
    id: "hashset",
    problemId: "lc217",
    name: "Búsqueda en Conjuntos (HashSet)",
    category: "Estructuras de Datos",
    shortDesc: "Utiliza una tabla hash sin duplicados para comprobar de forma instantánea O(1) si ya hemos visto un elemento antes.",
    icon: <Layers className="text-sky-400" size={24} />,
    theory: [
      "Un **HashSet** (o Conjunto Hash) es una estructura de datos que almacena elementos únicos y no ordenados.",
      "Funciona bajo el capó mapeando los elementos a índices en memoria mediante una **función hash**. Esto permite realizar inserciones, búsquedas y eliminaciones en un tiempo constante promedio de **O(1)**.",
      "Cuando escaneamos una lista buscando valores duplicados, la estrategia clásica de fuerza bruta requiere comparar cada número con todos los demás, resultando en un tiempo O(N²).",
      "Al utilizar un HashSet, guardamos cada número que visitamos. Antes de guardarlo, comprobamos si ya existe en el conjunto. Si ya está, confirmamos un duplicado en tiempo récord. Si no está, lo añadimos y continuamos."
    ],
    useCases: [
      "Eliminar elementos duplicados de una lista o colección de datos de forma eficiente.",
      "Comprobación ultrarrápida de membresía (saber si un elemento existe en una lista negra, base de datos en caché, etc.).",
      "Resolver problemas de intersección y diferencia de conjuntos en tiempo lineal."
    ],
    complexity: {
      time: "O(N)",
      space: "O(N)",
      timeExplain: "Recorremos el arreglo de tamaño N una sola vez en el peor de los casos.",
      spaceExplain: "En el peor caso, almacenaremos todos los elementos únicos en el conjunto hash."
    },
    mockProblem: {
      topicId: "arrays",
      subTopicId: "arrays",
      id: "lc217",
      name: "Contains Duplicate (HashSet Demo)",
      url: "https://leetcode.com/problems/contains-duplicate/",
      difficulty: "Easy",
      tags: ["arrays", "hashset"],
      status: "Not Started",
      isPriority: false,
      description: "HashSet duplication visualizer.",
      testCases: [],
      userSolutions: {}
    },
    exerciseName: "Contains Duplicate (LC 217)",
    exerciseDesc: "Dado un arreglo de números enteros, devuelve true si cualquier valor aparece al menos dos veces en el arreglo, y false si todos los elementos son distintos."
  },
  {
    id: "twopointers",
    problemId: "lc125",
    name: "Técnica de Dos Punteros (Two Pointers)",
    category: "Algoritmos de Búsqueda",
    shortDesc: "Escanea colecciones lineales utilizando dos índices que se desplazan de forma convergente o paralela para optimizar memoria.",
    icon: <Compass className="text-emerald-400" size={24} />,
    theory: [
      "La técnica de **Dos Punteros** utiliza dos variables de índice para recorrer una estructura de datos lineal (como un arreglo o cadena) simultáneamente.",
      "En problemas de validación de palíndromos, colocamos un puntero en el extremo izquierdo (`L`) y otro en el extremo derecho (`R`).",
      "En cada paso, comparamos los caracteres a los que apuntan `L` y `R`. Si coinciden, movemos `L` hacia la derecha y `R` hacia la izquierda (hacia el centro).",
      "Si encontramos una discrepancia, la cadena no puede ser un palíndromo y paramos inmediatamente. La ventaja clave es que no necesitamos espacio de memoria adicional para invertir la cadena, logrando un uso de memoria **O(1)** óptimo."
    ],
    useCases: [
      "Validación de cadenas reflexivas (palíndromos) e inversión de arreglos in-place.",
      "Búsqueda de pares que sumen un valor objetivo en arreglos previamente ordenados (Two Sum II).",
      "Algoritmos de particionamiento como el paso clave en QuickSort o la ordenación in-place."
    ],
    complexity: {
      time: "O(N)",
      space: "O(1)",
      timeExplain: "Cada elemento es visitado a lo sumo una vez por los punteros que convergen al centro.",
      spaceExplain: "Solo se utilizan dos variables de índice numéricas en memoria."
    },
    mockProblem: {
      topicId: "two-pointers",
      subTopicId: "two-pointers",
      id: "lc125",
      name: "Valid Palindrome (Two Pointers Demo)",
      url: "https://leetcode.com/problems/valid-palindrome/",
      difficulty: "Easy",
      tags: ["strings", "two-pointers"],
      status: "Not Started",
      isPriority: false,
      description: "Two pointers palindrome visualizer.",
      testCases: [],
      userSolutions: {}
    },
    exerciseName: "Valid Palindrome (LC 125)",
    exerciseDesc: "Dada una cadena de texto, devuelve true si, después de convertir todas las letras mayúsculas en minúsculas y eliminar todos los caracteres no alfanuméricos, se lee igual hacia adelante que hacia atrás."
  },
  {
    id: "hashmap",
    problemId: "lc242",
    name: "Mapas de Frecuencia (HashMap)",
    category: "Estructuras de Datos",
    shortDesc: "Contabiliza y contrasta el número de ocurrencias de cada carácter o valor para verificar la igualdad exacta de caracteres.",
    icon: <Cpu className="text-indigo-400" size={24} />,
    theory: [
      "Un **HashMap** (o Mapa de Asociación) almacena pares clave-valor. Al igual que el HashSet, utiliza una función hash para ofrecer búsquedas y escrituras en tiempo constante promedio **O(1)**.",
      "Para determinar si dos cadenas son anagramas (tienen exactamente las mismas letras con las mismas frecuencias), podemos registrar cuántas veces aparece cada letra.",
      "Construimos dos mapas de frecuencia: uno para la cadena `S` y otro para la cadena `T` escaneando las letras secuencialmente.",
      "Finalmente, comparamos ambos mapas. Si cada carácter tiene exactamente el mismo conteo en ambos mapas, las cadenas son anagramas válidos."
    ],
    useCases: [
      "Contar la frecuencia de elementos en colecciones grandes (caracteres en texto, logs del sistema, etc.).",
      "Mapeo de correspondencias entre entidades (por ejemplo, emparejar IDs con objetos complejos en caché).",
      "Optimización de búsquedas donde se requiere asociar datos complementarios en tiempo lineal (Two Sum)."
    ],
    complexity: {
      time: "O(N)",
      space: "O(K)",
      timeExplain: "Recorremos ambas cadenas para construir los mapas y luego recorremos las claves únicas.",
      spaceExplain: "El espacio depende de la cantidad de caracteres únicos (K) en el alfabeto (máximo 26 para letras en inglés)."
    },
    mockProblem: {
      topicId: "arrays",
      subTopicId: "arrays",
      id: "lc242",
      name: "Valid Anagram (HashMap Demo)",
      url: "https://leetcode.com/problems/valid-anagram/",
      difficulty: "Easy",
      tags: ["strings", "hashmap"],
      status: "Not Started",
      isPriority: false,
      description: "HashMap frequency visualizer.",
      testCases: [],
      userSolutions: {}
    },
    exerciseName: "Valid Anagram (LC 242)",
    exerciseDesc: "Dadas dos cadenas s y t, devuelve true si t es un anagrama de s, y false en caso contrario. Un anagrama es una palabra formada por la transposición de las letras de otra."
  }
];

const FUTURE_ALGORITHMS = [
  {
    name: "Búsqueda Binaria",
    category: "Algoritmos de Búsqueda",
    desc: "Divide a la mitad el rango de búsqueda repetidamente en colecciones ordenadas logrando O(log N).",
    badge: "Próximamente"
  },
  {
    name: "Ventana Deslizante",
    category: "Técnicas de Arreglos",
    desc: "Mantiene un subarreglo activo con dos punteros para calcular rangos dinámicos óptimos.",
    badge: "Próximamente"
  },
  {
    name: "DFS y BFS (Grafos)",
    category: "Estructuras de Árboles / Grafos",
    desc: "Recorridos en profundidad y anchura para navegar árboles y grafos de decisión lineal.",
    badge: "Próximamente"
  },
  {
    name: "Punteros Rápidos y Lentos",
    category: "Algoritmos de Listas",
    desc: "Utiliza dos punteros a diferentes velocidades (Liebre y Tortuga) para detectar ciclos.",
    badge: "Próximamente"
  },
  {
    name: "Programación Dinámica",
    category: "Optimización de Código",
    desc: "Divide problemas complejos en subproblemas solapados guardando estados en caché.",
    badge: "Próximamente"
  },
  {
    name: "Ordenación Avanzada",
    category: "Algoritmos de Ordenamiento",
    desc: "Visualización de los pasos internos de MergeSort y QuickSort dividiendo datos.",
    badge: "Próximamente"
  }
];

const LearnPage: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmDoc | null>(null);
  const [activeTab, setActiveTab] = useState<"theory" | "usecases" | "exercise">("theory");

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-300 flex flex-col">
      <Header />
      
      <main className="container mx-auto max-w-5xl p-4 sm:p-8 flex-grow">
        {!selectedAlgo ? (
          /* Catalog view */
          <div className="space-y-10 animate-fade-in">
            {/* Landing Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-950/80 p-6 sm:p-10 border border-slate-700/40 shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-950/60 text-sky-400 border border-sky-800/40">
                  <Sparkles size={12} /> Academia de Algoritmos
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Aprende Algoritmos de Forma Visual e Interactiva
                </h2>
                <p className="text-sm sm:text-md text-slate-400 leading-relaxed">
                  Domina las estructuras de datos y los patrones de resolución más populares de LeetCode. 
                  Explora la teoría detallada, comprende sus casos de uso reales y ejecuta simulaciones paso a paso 
                  sin necesidad de escribir código.
                </p>
              </div>
            </div>

            {/* Active section header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-sky-500" size={20} />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Módulos de Aprendizaje Activos</h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">Explora y prueba las simulaciones animadas completas en tiempo real.</p>
              
              {/* Active Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ACTIVE_ALGORITHMS.map((algo) => (
                  <button 
                    key={algo.id}
                    onClick={() => {
                      setSelectedAlgo(algo);
                      setActiveTab("theory");
                    }}
                    className="text-left w-full group bg-slate-800/30 hover:bg-slate-850/50 backdrop-blur-md border border-slate-800/80 hover:border-sky-500/40 rounded-xl p-5 shadow-xl transition-all duration-350 cursor-pointer flex flex-col justify-between hover:shadow-sky-500/5 relative overflow-hidden font-inherit"
                  >
                    {/* Hover border glow */}
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-350" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                          {algo.icon}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950/80 text-sky-400 border border-sky-900/30">
                          {algo.category}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5">
                        <h4 className="text-md font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                          {algo.name}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {algo.shortDesc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold mt-6 group-hover:translate-x-1 transition-transform">
                      Comenzar a aprender <ArrowRight size={14} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inactive placeholders */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="text-indigo-400" size={20} />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Próximos Temas Teóricos</h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">Módulos en fase de preparación que se añadirán próximamente al catálogo didáctico.</p>
              
              {/* Inactive cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {FUTURE_ALGORITHMS.map((algo, index) => (
                  <div 
                    key={index}
                    className="bg-slate-950/20 border border-slate-850/60 rounded-xl p-4 flex flex-col justify-between opacity-70 relative select-none"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase tracking-wide font-bold text-slate-500">{algo.category}</span>
                        <span className="text-[8px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300/80 border border-slate-700/20">
                          {algo.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-400">{algo.name}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{algo.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Detail learning dashboard (Split Layout) */
          <div className="space-y-6 animate-fade-in">
            {/* Breadcrumb / Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <button 
                onClick={() => setSelectedAlgo(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition-all border border-slate-700/50"
              >
                <ArrowLeft size={14} /> Volver al catálogo
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-850 text-sky-400 border border-sky-950">
                  {selectedAlgo.category}
                </span>
              </div>
            </div>

            {/* Algortihm Title & Summary */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{selectedAlgo.name}</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{selectedAlgo.shortDesc}</p>
            </div>

            {/* Split layout: Document vs visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left column: Documentation & Theory (7 cols) */}
              <div className="lg:col-span-6 bg-slate-850/40 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[580px]">
                {/* Internal Doc tab bar */}
                <div className="flex border-b border-slate-800 bg-slate-900/50 p-1.5 gap-1">
                  <button 
                    onClick={() => setActiveTab("theory")}
                    className={`flex-grow py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                      activeTab === "theory" 
                        ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/10" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                    }`}
                  >
                    1. Explicación Teórica
                  </button>
                  <button 
                    onClick={() => setActiveTab("usecases")}
                    className={`flex-grow py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                      activeTab === "usecases" 
                        ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/10" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                    }`}
                  >
                    2. Casos de Uso
                  </button>
                  <button 
                    onClick={() => setActiveTab("exercise")}
                    className={`flex-grow py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                      activeTab === "exercise" 
                        ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/10" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                    }`}
                  >
                    3. Ejercicios & Práctica
                  </button>
                </div>

                {/* Tab content wrapper */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    {activeTab === "theory" && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center gap-1.5 text-xs text-sky-400 font-bold uppercase tracking-wider mb-2">
                          <Bookmark size={14} /> Conceptos Fundamentales
                        </div>
                        {selectedAlgo.theory.map((paragraph, idx) => (
                          <p key={idx} className="text-xs text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                      </div>
                    )}

                    {activeTab === "usecases" && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">
                          <Activity size={14} /> ¿Cuándo aplicar este patrón?
                        </div>
                        <ul className="space-y-3">
                          {selectedAlgo.useCases.map((useCase, idx) => (
                            <li key={idx} className="flex gap-3 text-xs text-slate-300 leading-relaxed items-start">
                              <span className="w-5 h-5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{useCase}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === "exercise" && (
                      <div className="space-y-5 animate-fade-in">
                        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">
                          <Code size={14} /> Aplicación en Ejercicios Reales
                        </div>
                        
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-sky-400">Problema Sugerido</span>
                            <h4 className="text-sm font-extrabold text-slate-200">{selectedAlgo.exerciseName}</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {selectedAlgo.exerciseDesc}
                          </p>
                          <div className="pt-2">
                            <Link 
                              to={`/problem/${selectedAlgo.problemId}`}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-sky-500/20 active:scale-95 transition-all"
                            >
                              Resolver este ejercicio ahora <Code size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Complexity Card Box */}
                  <div className="mt-8 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg relative overflow-hidden">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Timer size={14} className="text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Complejidad Temporal</span>
                      </div>
                      <div className="text-lg font-bold text-white font-mono">{selectedAlgo.complexity.time}</div>
                      <p className="text-[9px] text-slate-400 leading-normal mt-1">{selectedAlgo.complexity.timeExplain}</p>
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg relative overflow-hidden">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Cpu size={14} className="text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Complejidad Espacial</span>
                      </div>
                      <div className="text-lg font-bold text-white font-mono">{selectedAlgo.complexity.space}</div>
                      <p className="text-[9px] text-slate-400 leading-normal mt-1">{selectedAlgo.complexity.spaceExplain}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right column: Interactive visualizer (5 cols) */}
              <div className="lg:col-span-6 bg-slate-850/30 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden min-h-[580px]">
                <div className="absolute top-0 left-0 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Simulación del Algoritmo en Tiempo Real
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-sky-950/40 text-sky-400 border border-sky-850/30">
                      <Activity size={10} /> Interactivo
                    </span>
                  </div>
                  
                  <div className="flex-grow">
                    <AlgorithmVisualizer problem={selectedAlgo.mockProblem} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LearnPage;
