export function formatPageDisp(page: string | undefined) {
	return (page ?? '').replace(/^\*\*.*/g, '');
}
