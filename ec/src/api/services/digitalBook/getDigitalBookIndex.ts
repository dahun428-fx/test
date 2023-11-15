import fetchJsonp from 'fetch-jsonp';
import { config } from '@/config';
import { NotFoundError } from '@/errors/app/NotFoundError';
import { GetDigitalBookIndexResponse } from '@/models/api/digitalBook/GetDigitalBookIndexResponse';

/**
 * Get digital book page index
 * @param digitalBookCode
 */
export async function getDigitalBookIndex(
	digitalBookCode: string
): Promise<GetDigitalBookIndexResponse> {
	const data = await fetchJsonp(
		`${
			config.web.digitalCatalog.origin
		}/book/data/page.php?${new URLSearchParams({
			target: digitalBookCode,
		}).toString()}`,
		{
			timeout: 29000,
		}
	).then(res => {
		if (res.ok) {
			return res.json();
		}
		// noop
	});
	if (data === undefined) {
		throw new NotFoundError('digital book index', digitalBookCode);
	}

	const { _totalNumberOfPage, ...pageIndexes } = data;

	const bookIndexes: Record<string, number> = {};
	const pageList: string[] = [];

	for (const [page, index] of Object.entries(pageIndexes)) {
		if (Number.isNaN(Number(index))) {
			continue;
		}
		const numIndex = Number(index);
		bookIndexes[page] = numIndex;
		pageList[numIndex] = page;
	}

	return {
		totalCount: _totalNumberOfPage,
		bookIndexes,
		pageList,
	};
}
