import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import themes from "daisyui/src/theming/themes";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: { extend: {} },
	plugins: [daisyui],
	daisyui: {
		logs: false,
		themes: [
			{
				light: {
					...themes["light"],
					primary: "#facc15",
					secondary: "#60a5fa",
					accent: "#34d399",
					"base-100": "#e5e5e5",
					"base-200": "#f5f5f5",
					"base-300": "#fafafa",
					"base-content": "#262626",
					"secondary-content": "#262626",
					"--rounded-box": "0",
					"--rounded-btn": "0",
					"--rounded-badge": "0",
				},
				dark: {
					...themes["dark"],
					primary: "#facc15",
					secondary: "#60a5fa",
					accent: "#34d399",
					"base-100": "#262626",
					"base-200": "#171717",
					"base-300": "#0a0a0a",
					"base-content": "#e5e5e5",
					"--rounded-box": "0",
					"--rounded-btn": "0",
					"--rounded-badge": "0",
				},
			},
		],
	},
} satisfies Config;
