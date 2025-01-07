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
	tech: m.tech,
	gift: m.gift,
	other: m.other,
};

export function dateToHumanReadable(date: Date = new Date()): string {
	return `${date.getFullYear().toString()}-${(date.getMonth() + 1)
		.toString()
		.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}
