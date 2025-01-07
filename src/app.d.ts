// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { type Session } from "$lib/server/db";

declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			user: { id: string; email: string } | null;
			session: Session | null;
		}
	}
}

export {};
