import type { Handle } from "@sveltejs/kit";
import { i18n } from "$lib/i18n";
import { sequence } from "@sveltejs/kit/hooks";
import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken,
} from "$lib/server/auth";
import { themes } from "$lib/constants";

const paraglide: Handle = i18n.handle();

export const theme: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get("theme");

	if (!theme || !themes.includes(theme)) {
		return await resolve(event);
	}

	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('data-theme=""', `data-theme="${theme}"`);
		},
	});
};

const auth: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get("auth_session") ?? null;

	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) setSessionTokenCookie(event, token, session.expiresAt);
	else deleteSessionTokenCookie(event);

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

export const handle = sequence(paraglide, theme, auth);
