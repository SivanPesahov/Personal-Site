export const IS_PROD = import.meta.env.PROD;

// הגדרה דרך Vite: VITE_API_BASE (למשל: http://localhost:8000 בפיתוח, https://api.sivan.dev בפרודקשן)
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  "http://localhost:8000";

// מפתח האתר ל־CAPTCHA בצד לקוח (hCaptcha/Turnstile)
export const CAPTCHA_SITE_KEY =
  (import.meta.env.VITE_CAPTCHA_SITE_KEY as string | undefined) ?? "";

// פונקציה עוזרת לבניית כתובת מלאת ל־endpoint
export const apiUrl = (path: string) => {
  const base = API_BASE.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
};
