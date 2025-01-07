import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth/index.js";
import { fail, redirect } from "@sveltejs/kit";

export const load = () => {
	redirect(302, "/");
};

export const actions = {
	default: async (event) => {
		if (!event.locals.session) return fail(401, { field: "other", reaason: "unauthorized" });

		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);

		redirect(302, "/sign-in");
	},
};
