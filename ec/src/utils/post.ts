type Payload = {
	url: string;
	query: Record<string, string>;
	/** iframe "name" attribute */
	target?: string;
};

/**
 * Transit page with POST
 */
export const post = ({ url, query, target }: Payload) => {
	const form = document.createElement('form');
	form.action = url;
	form.method = 'post';
	if (target) {
		form.target = target;
	}

	Object.entries(query).forEach(([key, value]) => {
		const input = document.createElement('input');
		input.name = key;
		input.value = value;
		input.type = 'hidden';
		form.appendChild(input);
	});

	document.body.appendChild(form);
	form.submit();
};

type PayloadRemove = {
	formId: string;
	url: string;
	query: Record<string, string>;
	/** iframe "name" attribute */
	target?: string;
};

/**
 * Transit page with POST and Remove Form
 */
export const postAndRemove = ({
	formId,
	url,
	query,
	target,
}: PayloadRemove) => {
	const previousForm = document.getElementById(formId);
	if (previousForm) {
		try {
			document.body.removeChild(previousForm);
		} catch {}
	}

	const form = document.createElement('form');
	form.id = formId;
	form.action = url;
	form.method = 'post';
	if (target) {
		form.target = target;
	}

	Object.entries(query).forEach(([key, value]) => {
		const input = document.createElement('input');
		input.name = key;
		input.value = value;
		input.type = 'hidden';
		form.appendChild(input);
	});

	document.body.appendChild(form);
	form.submit();
};
