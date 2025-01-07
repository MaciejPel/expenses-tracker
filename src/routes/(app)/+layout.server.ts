import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, request, cookies }) => {
	if (!locals.user) {
		cookies.set("redirect", request.url, { path: "/" });
		redirect(302, "/sign-in");
	}
};
