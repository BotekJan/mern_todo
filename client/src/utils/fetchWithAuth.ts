export async function fetchWithAuth<T = any>(
    url: string,
    options: {
        method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        body?: any;
        headers?: Record<string, string>;
    } = {}
): Promise<T> {
    const accessToken = localStorage.getItem("accessToken");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
        if (res.status === 401) {
            console.error("Unauthorized");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json() as Promise<T>;
}