export function regacyPartNumberCopy(partNumber: string) {
	const input = document.createElement('input');
	document.body.appendChild(input);
	input.hidden = true;
	input.value = partNumber;
	input.select();
	document.execCommand('copy');
	document.body.removeChild(input);
}
