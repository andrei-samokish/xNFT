/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js,ts,tsx}"],
	theme: {
		colors: {
			primary: "#303030",
			secondary: "#BB86FC",
			white: "#FFFFFF",
			grey: "#7D7D7D",
			error: "#E01616",
		},
		extend: {
			fontFamily: {
				montserrat: ["Montserrat", "sans-serif"],
			},
		},
	},
	plugins: [],
};
