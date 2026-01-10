import { useState } from "react";

interface Presentation {
  id: number;
  headline: string;
  description: string;
  image: string;
}

const presentationList: Presentation[] = [
  {
    id: 1,
    headline: "ORGANIZAR",
    description:
      "Organiza tu día, enfoca tu mente y avanza sin estrés. Este gestor de tareas te ayuda a ordenar tus pendientes de forma simple y visual.Clasifica tus tareas, define prioridades y sigue tu progreso paso a paso.Porque cuando todo está organizado, trabajar se vuelve más fácil y productivo.",
    image: "/images/orden.jpg",
  },
  {
    id: 2,
    headline: "AVANZAR",
    description:
      "Avanza cada día, paso a paso, hacia tus metas. Con este gestor de tareas, cada acción cuenta. Organiza tus pendientes, marca lo completado y observa tu progreso crecer. Porque avanzar no es solo hacer, es hacerlo con claridad y propósito.",
    image: "/images/avanzar.jpg",
  },
  {
    id: 3,
    headline: "FINALIZAR",
    description:
      "Finaliza tus tareas y siente el logro de cada meta. Con nuestro gestor de tareas, marcar algo como completado es más que un clic: es ver tu progreso, celebrar tu esfuerzo y mantener el control de tu día. Porque terminar bien cada actividad te acerca a tus objetivos.",
    image: "/images/finalizar.jpg",
  },
];
