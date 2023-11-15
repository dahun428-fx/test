/** Scroll into view hook */
export const scrollIntoView = (targetElement: string) => {
	const target = document.querySelector(`#${targetElement}`);

	target?.scrollIntoView({ behavior: 'smooth' });
};
