/** Scroll into view hook */
export const scrollIntoView = (targetElement: string) => {
	const target = document.querySelector(`#${targetElement}`);

	target?.scrollIntoView({ behavior: 'smooth' });
};

/** Scroll to element hook */
export const scrollToElement = (
	targetElement: string,
	offset: number | undefined = 0
) => {
	return new Promise<void>(resolve => {
		const element = document.getElementById(targetElement);

		if (element) {
			const targetOffset =
				element.getBoundingClientRect().top + window.pageYOffset;

			const offsetTop = targetOffset - offset;

			if (!offsetTop) {
				return;
			}

			window.scrollTo({
				top: offsetTop,
				behavior: 'smooth',
			});
		}

		setTimeout(resolve, 500);
	});
};
