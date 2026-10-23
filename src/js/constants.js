/**
 * Configuration des couleurs et classes pour les variants HTML/CSS
 */
export const VARIANT_COLORS = {
  html: {
    text: "text-orange-600",
    hover: "hover:text-orange-600",
    bg: "bg-orange-600",
    bgLight: "bg-orange-50",
    border: "border-orange-600",
  },
  css: {
    text: "text-blue-600",
    hover: "hover:text-blue-600",
    bg: "bg-blue-600",
    bgLight: "bg-blue-50",
    border: "border-blue-600",
  },
  default: {
    text: "text-slate-600",
    hover: "hover:text-slate-600",
    bg: "bg-white",
    bgLight: "bg-slate-50",
    border: "border-slate-300",
  },
};

/**
 * Configuration des seuils pour la classification des écarts
 */
export const GAP_THRESHOLDS = {
  excellent: { max: 10, class: "text-green-600" },
  good: { max: 25, class: "text-yellow-500" },
  warning: { max: 40, class: "text-orange-500" },
  critical: { max: Infinity, class: "text-red-500" },
};

/**
 * Configuration du scroll et de la navigation
 */
export const SCROLL_CONFIG = {
  sectionDetectionOffset: 150,
  scrollTopButtonThreshold: 500,
};

/**
 * Configuration des cercles de progression
 */
export const PROGRESS_CIRCLE = {
  mainRadius: 52,
  averageRadius: 44,
  strokeWidth: {
    main: 8,
    average: 4,
    background: 20,
  },
};

/**
 * Configuration de l'API
 */
export const getApiBaseUrl = () => {
  // En production sur Render, on utilise toujours l'URL de production
  return import.meta.env.PROD
    ? "https://project-analysis-backend.onrender.com"
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
};
