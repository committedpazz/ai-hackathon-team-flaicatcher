const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

interface RequestOptions {
	method: "GET" | "POST" | "PATCH" | "DELETE";
	body?: string;
}

async function request<TResponse>(path: string, options: RequestOptions): Promise<TResponse> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: options.method,
		body: options.body,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const body: unknown = await response.json().catch(() => null);
		const message =
			body && typeof body === "object" && "message" in body
				? String((body as { message: unknown }).message)
				: response.statusText;
		throw new ApiError(response.status, message);
	}

	if (response.status === 204) {
		return undefined as TResponse;
	}

	return (await response.json()) as TResponse;
}

export const apiClient = {
	get: <TResponse>(path: string): Promise<TResponse> => request<TResponse>(path, { method: "GET" }),
	post: <TResponse>(path: string, body?: unknown): Promise<TResponse> =>
		request<TResponse>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
	patch: <TResponse>(path: string, body?: unknown): Promise<TResponse> =>
		request<TResponse>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
	delete: <TResponse>(path: string): Promise<TResponse> => request<TResponse>(path, { method: "DELETE" }),
};
