import * as m from "$lib/paraglide/messages.js";

export const numberToMonth: { [key: number]: () => string } = {
	1: m.january,
	2: m.february,
	3: m.march,
	4: m.april,
	5: m.may,
	6: m.june,
	7: m.july,
	8: m.august,
	9: m.september,
	10: m.october,
	11: m.november,
	12: m.december,
};

export const categoriesTranslations: { [key: string]: () => string } = {
	grocery: m.grocery,
	tax: m.tax,
	subscription: m.subscription,
	tech: m.tech,
	gift: m.gift,
	other: m.other,
};

export const errTranslations: { [key: string]: { [key: string]: () => string } } = {
	email: { requirements: m.error_email_requirements, taken: m.error_email_taken },
	password: { requirements: m.error_password_requirements },
	"repeat-password": { "no-match": m.error_repeat_password_no_match },
	id: { requirements: m.error_id_requirements },
	name: { requirements: m.error_name_requirements },
	cost: { requirements: m.error_cost_requirements },
	category: { requirements: m.error_category_requirements },
	note: { requirements: m.error_note_requirements },
	paid_at: { requirements: m.error_paid_at_requirements },
	other: {
		unauthorized: m.something_went_wrong,
		"not-found": m.error_other_not_found,
		general: m.error_other_general,
		"invalid-year": m.invalid_year,
		"invalid-month": m.invalid_month,
	},
};

export function dateToHumanReadable(date: Date = new Date()): string {
	return `${date.getFullYear().toString()}-${(date.getMonth() + 1)
		.toString()
		.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}
