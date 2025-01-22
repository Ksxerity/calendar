import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-custom-green',
    'bg-custom-lightgreen',
    'bg-custom-blue',
    'bg-custom-red',
    'bg-custom-orange',
    'bg-custom-yellow',
    'bg-custom-purple',
    'text-custom-green',
    'text-custom-lightgreen',
    'text-custom-blue',
    'text-custom-red',
    'text-custom-orange',
    'text-custom-yellow',
    'text-custom-purple',
  ],
  theme: {
    screens: {
      md: '1920px',
      lg: '2560px',
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-green': 'var(--green-background)',
        'custom-lightgreen': 'var(--lightgreen-background)',
        'custom-blue': 'var(--blue-background)',
        'custom-red': 'var(--red-background)',
        'custom-orange': 'var(--orange-background)',
        'custom-yellow': 'var(--yellow-background)',
        'custom-purple': 'var(--purple-background)',
      },
    },
  },
  plugins: [],
});
