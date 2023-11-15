/**
 * CAD download API error class
 */
export class CadDownloadApiError extends Error {
	status: number;

	constructor(status?: number) {
		super('CAD download API error.');
		this.name = 'CadDownloadApiError';
		this.status = status ?? 500;
	}
}
