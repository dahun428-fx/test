export function regacyPartNumberCopy(partNumber: string) {
	const input = document.createElement('input');
	document.body.appendChild(input);
	input.value = partNumber;
	input.style.top = '0';
	input.style.left = '0';
	input.select();
	document.execCommand('copy');
	document.body.removeChild(input);
}
