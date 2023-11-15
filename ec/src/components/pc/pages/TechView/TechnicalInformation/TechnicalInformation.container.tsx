import { Canceler } from 'axios';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { TechnicalInformation as Presenter } from './TechnicalInformation';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { searchTechFullText } from '@/api/services/searchTechFullText';
import { config } from '@/config';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { SearchTechFullTextRequest } from '@/models/api/msm/ect/fullText/SearchTechFullTextRequest';
import { SearchTechFullTextResponse } from '@/models/api/msm/ect/fullText/SearchTechFullTextResponse';

type Props = {
	keywordFromUrl: string;
};

const DEFAULT_PAGE = 1;

/**
 * Technical information
 */
export const TechnicalInformation: React.VFC<Props> = ({ keywordFromUrl }) => {
	const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
	const [pageSize, setPageSize] = useState(config.pagination.techView.size);
	const [keyword, setKeyword] = useState(keywordFromUrl);
	const [technicalInformationResponse, setTechnicalInformationResponse] =
		useState<SearchTechFullTextResponse | null>(null);

	const [loading, startLoading, endLoading] = useBoolState(false);

	const isFirstLoad = useRef(true);
	const cancelerRef = useRef<Canceler>();
	const keywordRef = useRef('');

	const { generateToken } = useApiCancellation();

	const resetState = () => {
		keywordRef.current = '';
		setKeyword('');
		setTechnicalInformationResponse(null);
		setCurrentPage(DEFAULT_PAGE);
	};

	const load = useCallback(
		async (conditions: Partial<SearchTechFullTextRequest> = {}) => {
			try {
				cancelerRef.current?.();

				const keywordTrim = keyword.trim();
				if (!keywordTrim) {
					resetState();
					return;
				}

				if (isFirstLoad.current) {
					startLoading();
					isFirstLoad.current = false;
				}

				keywordRef.current = keywordTrim;
				const technicalInformationResponse = await searchTechFullText(
					{
						keyword: keywordTrim,
						pageSize,
						page: currentPage,
						...conditions,
					},
					generateToken(c => (cancelerRef.current = c))
				);

				if (conditions.pageSize) {
					setPageSize(conditions.pageSize);
				}
				setCurrentPage(conditions.page ?? DEFAULT_PAGE);
				setTechnicalInformationResponse(technicalInformationResponse);
			} catch (error) {
				setTechnicalInformationResponse(null);
			} finally {
				endLoading();
			}
		},
		[endLoading, generateToken, keyword, currentPage, pageSize, startLoading]
	);

	const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
		setKeyword(event.target.value);
	};

	const handleChangePage = (page: number) => {
		if (page !== currentPage) {
			load({ page });
		}
	};

	const handleChangePageSize = useCallback(
		(selectedPageSize: number) => {
			const technicalInformationTotalCount =
				technicalInformationResponse?.totalCount;
			setPageSize(selectedPageSize);
			setCurrentPage(DEFAULT_PAGE);

			// NOTE: Do not call API in case of pageSize > totalCount
			if (
				!technicalInformationTotalCount ||
				(pageSize >= technicalInformationTotalCount &&
					selectedPageSize >= technicalInformationTotalCount)
			) {
				return;
			}

			load({ pageSize: selectedPageSize, page: DEFAULT_PAGE });
		},
		[load, pageSize, technicalInformationResponse]
	);

	const handleClickTechInfoPDF = (url: string) => {
		if (url.includes('.pdf')) {
			aa.events.sendClickTechInfoPDF();
		}
	};

	useOnMounted(() => {
		load();
		ectLogger.visit();
		ga.pageView.unclassified().then();
		aa.pageView.unclassified().then();
	});

	return (
		<Presenter
			page={currentPage}
			pageSize={pageSize}
			loading={loading}
			keyword={keyword}
			technicalInformationResponse={technicalInformationResponse}
			keywordTitle={keywordRef.current ?? ''}
			load={load}
			onChangeKeyword={handleChangeKeyword}
			onChangePage={handleChangePage}
			onChangePageSize={handleChangePageSize}
			onClickTechInfoPDF={handleClickTechInfoPDF}
		/>
	);
};

TechnicalInformation.displayName = 'TechnicalInformation';
