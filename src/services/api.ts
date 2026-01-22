import type { Recipe, Ingredient } from "../types/recipe";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new ApiError(response.status, error.message || "Request failed");
  }

  const result: ApiResponse<T> = await response.json();
  return result.data;
}

// Recipes API
export const recipesApi = {
  getAll: async (search?: string): Promise<Recipe[]> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return fetchApi<Recipe[]>(`/recipes${query}`);
  },

  getById: async (id: string): Promise<Recipe> => {
    return fetchApi<Recipe>(`/recipes/${id}`);
  },

  create: async (data: {
    title: string;
    ingredients: Ingredient[];
    instructions: string;
    imageDataUrl?: string;
  }): Promise<Recipe> => {
    const payload = {
      ...data,
      ingredients: data.ingredients.map((ing) => ing.name),
    };
    return fetchApi<Recipe>("/recipes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (
    id: string,
    data: Partial<{
      title: string;
      ingredients: Ingredient[];
      instructions: string;
      imageDataUrl?: string;
    }>
  ): Promise<Recipe> => {
    const payload = data.ingredients
      ? { ...data, ingredients: data.ingredients.map((ing) => ing.name) }
      : data;
    return fetchApi<Recipe>(`/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    await fetchApi<void>(`/recipes/${id}`, {
      method: "DELETE",
    });
  },
};

// Auth API
export const authApi = {
  register: async (username: string, email: string, password: string) => {
    return fetchApi<{ token: string; user: { id: string; username: string; email: string } }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      }
    );
  },

  login: async (email: string, password: string) => {
    return fetchApi<{ token: string; user: { id: string; username: string; email: string } }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
  },
};

// Upload API
export const uploadApi = {
  uploadImage: async (file: File): Promise<{ imageDataUrl: string }> => {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("authToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new ApiError(response.status, error.message || "Upload failed");
    }

    const result = await response.json();
    return result.data;
  },
};

