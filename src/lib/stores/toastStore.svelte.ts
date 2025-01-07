export type ToastType = "info" | "success" | "warning" | "error";

interface Toast {
	type: ToastType;
	message: string;
}

interface ToastInternal extends Toast {
	id: number;
}

export const toasts = $state<ToastInternal[]>([]);

export const addToast = (toast: Toast) => {
	const id = Math.floor(Math.random() * 10000);
	const defaults = { id, type: "info" };

	toasts.push({ ...defaults, ...toast });

	setTimeout(() => dismissToast(id), 5000);
};

export const dismissToast = (id: number) => {
	const index = toasts.findIndex((entry) => entry.id !== id);
	toasts.splice(index, 1);
};
