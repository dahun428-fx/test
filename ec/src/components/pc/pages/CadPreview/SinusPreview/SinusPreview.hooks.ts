import { useCallback, useState } from 'react';
import { searchPartNumber$search } from '@/api/services/searchPartNumber';
import { previewCad } from '@/api/services/sinus/previewCad';
import { ErrorType } from '@/components/pc/pages/CadPreview/CadPreviewError/types';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { SinusApiError } from '@/errors/api/SinusApiError';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import { SinusParameters } from '@/models/api/msm/ect/cad/PreviewCadResponse';
import { useSelector } from '@/store/hooks';
import { selectUser } from '@/store/modules/auth';
import { isChrome, isEdge, isFirefox, isIE11 } from '@/utils/device';
import {
	getAlterationSpecList,
	getSpecValueList,
} from '@/utils/domain/cad/sinus';
import { url } from '@/utils/url';

type Payload = {
	params: SinusParameters;
	brandCode: string;
	seriesCode: string;
	partNumber: string;
};

export const useSinusPreview = ({
	params,
	brandCode,
	seriesCode,
	...rest
}: Payload) => {
	const user = useSelector(selectUser);
	const { showMessage } = useMessageModal();
	const [loading, startToLoad, endLoading] = useBoolState();
	const [previewUrl, setPreviewUrl] = useState<string>();
	const [errorState, setErrorState] = useState<ErrorType | null>(null);

	const load = useCallback(async () => {
		startToLoad();
		try {
			const {
				partNumberList: [partNumber],
				specList,
				alterationSpecList,
			} = await searchPartNumber$search({
				seriesCode,
				partNumber: rest.partNumber,
				pageSize: 1,
				specSortFlag: Flag.FALSE,
			});

			if (!partNumber) {
				setErrorState('unknown-server-error');
				return;
			}

			const { status, path, errorCode, message } = await previewCad({
				partNumberList: [
					{
						customer_cd: user?.customerCode,
						language: params.language,
						partNumber: partNumber.partNumber,
						seriesCode,
						brdCode: brandCode,
						typeCode: partNumber.typeCode ?? '',
						SYCD: partNumber.productCode,
						domain: params.domain,
						environment: params.environment,
						specValueList: getSpecValueList({ specList, partNumber }),
						alterationSpecList: getAlterationSpecList({ alterationSpecList }),
					},
				],
			});

			if (!path) {
				setPreviewUrl(undefined);
				if (status === '404') {
					setErrorState('unavailable-part-number-error');
				} else {
					setErrorState('unknown-server-error');
				}
				showMessage(`[${errorCode}] ${message}`);
				return;
			} else {
				setPreviewUrl(
					url.sinus().preview(path.replace('/assets/', ''), params.language)
				);
			}
		} catch (error) {
			if (error instanceof SinusApiError && error.response?.status === '404') {
				setErrorState('unavailable-part-number-error');
				return;
			}
			setErrorState('unknown-server-error');
			return;
		} finally {
			endLoading();
		}
	}, [
		brandCode,
		endLoading,
		params.domain,
		params.environment,
		params.language,
		rest.partNumber,
		seriesCode,
		showMessage,
		startToLoad,
		user?.customerCode,
	]);

	useOnMounted(() => {
		if (!isChrome() && !isEdge() && !isFirefox() && !isIE11()) {
			setErrorState('no-support-browser-error');
		} else {
			load();
		}
	});

	return { loading, previewUrl, errorState };
};
