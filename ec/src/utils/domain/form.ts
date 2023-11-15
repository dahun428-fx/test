/**
 * Post form data to url
 * @param url {string}
 * @param payloads {T[]}
 */
export const postFormData = <T>(url: string, payloads: T[]) => {
	if (!payloads.length || url.trim() === '') {
		return;
	}

	const form = document.createElement('form');
	form.action = url;
	form.method = 'post';

	payloads.forEach(payload => {
		const input = document.createElement('input');
		input.name = 'prd';
		input.value = JSON.stringify(payload);
		input.type = 'hidden';
		form.appendChild(input);
	});

	document.body.appendChild(form);
	form.submit();
};
