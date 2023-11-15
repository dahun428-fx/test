import { useCallback, useState } from 'react';
import { ErrorType } from './CadPreviewError/types';
import { previewCad } from '@/api/services/previewCad';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { PreviewCadRequest } from '@/models/api/msm/ect/cad/PreviewCadRequest';
import { PreviewCadResponse } from '@/models/api/msm/ect/cad/PreviewCadResponse';
import { CadSiteType } from '@/models/domain/cad';
import { Query } from '@/pages/vona2/3dpreview.pc';

// If you need to receive all queries for AA/GA, `type Payload = Query` is also ok.
// もしAA/GA用にQueryを全部受け取る必要があるなら、 `type Payload = Query` でも構わない。
export type Payload = Pick<Query, 'seriesCode' | 'partNumber' | 'cadId'>;

export const useCadPreview = ({ seriesCode, partNumber, cadId }: Payload) => {
	const [loading, startToLoad, endLoading] = useBoolState(false);
	const [response, setResponse] = useState<PreviewCadResponse | null>(null);
	const [errorState, setErrorState] = useState<ErrorType | null>(null);

	const load = useCallback(
		async (request: PreviewCadRequest) => {
			startToLoad();

			try {
				const response = await previewCad(request);
				if (
					response.cadSiteType === CadSiteType.NONE ||
					(response.cadSiteType !== CadSiteType.CADENAS &&
						response.cadSiteType !== CadSiteType.SINUS)
				) {
					setErrorState('unavailable-part-number-error');
					return;
				}

				// REVIEW: Is it necessary to take action to provide a list of
				//         part numbers when the part number is not completed in CADENAS?
				if (!request.partNumber) {
					setErrorState('part-number-incomplete-error');
					return;
				}

				setResponse(response);
			} catch (error) {
				setErrorState('unavailable-part-number-error');
				return;
			} finally {
				endLoading();
			}
		},
		[endLoading, startToLoad]
	);

	useOnMounted(() => {
		load({
			seriesCode,
			partNumber,
			cadId,
		});
	});

	return { loading, preview: response, errorState };
};

export const useTrackPageView = (payload: {
	seriesCode: string;
	seriesName: string;
	brandCode: string;
	brandName: string;
	partNumber: string;
}) => {
	useOnMounted(() => {
		ga.pageView.cadPreview(payload).then();
		aa.pageView.cadPreview(payload).then();
	});
};
