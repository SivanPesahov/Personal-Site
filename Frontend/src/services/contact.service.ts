import api from "./api.service";

/**
 * Payload לחיווי פנייה
 */
export type PostContactInput = {
  name: string;
  email: string;
  message: string;
  /** טוקן CAPTCHA (אופציונלי בשלב זה; יתווסף בצד-הלקוח בהמשך) */
  captchaToken?: string;
};

/**
 * POST /api/contact
 * מחזיר את תשובת ה־API כפי שהיא (בדרך כלל { data, error } מהבקאנד).
 * זריקת שגיאה במקרה של שגיאת API (כשקיים error).
 */
export async function postContact(input: PostContactInput): Promise<{
  data: unknown;
  error: unknown;
}> {
  const payload: Record<string, unknown> = {
    name: input.name,
    email: input.email,
    message: input.message,
  };

  // הוספת שדה ה־CAPTCHA רק אם התקבל
  if (input.captchaToken) {
    payload["captcha_token"] = input.captchaToken;
  }

  // שים לב: api.service כבר מוגדר עם baseURL מתוך ה־ENV, כמו בשאר ה־services
  const res = (await api.post("/api/contact", payload)) as unknown as {
    data: unknown;
    error: unknown;
  };

  // אם השרת החזיר error במבנה האחיד שלנו – נרים שגיאה כדי שהקריאה בצד ה־UI תוכל לתפוס
  if (res && (res as any).error) {
    const err = (res as any).error;
    const msg = err?.message || JSON.stringify(err) || "Contact request failed";
    throw new Error(msg);
  }

  return res;
}
