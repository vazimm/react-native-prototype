const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const API_BASE_URL =
  configuredUrl || "https://blog-api-dnfx.onrender.com";
