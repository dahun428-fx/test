import React from 'react';
import {
	CadPreview as Presenter,
	Props as CadPreviewProps,
} from './CadPreview';
import { CadPreviewError } from '@/components/pc/pages/CadPreview/CadPreviewError';
import { useSelector } from '@/store/hooks';
import { selectCurrentPartNumberResponse } from '@/store/modules/pages/productDetail';
import { first } from '@/utils/collection';
import { Flag } from '@/models/api/Flag';

type Props = Omit<
	CadPreviewProps,
	'partNumber' | 'completeFlag' | 'innerCode' | 'onClickCatalogDownload'
>;

export const CadPreview: React.FC<Props> = props => {
	const partNumberResponse = useSelector(selectCurrentPartNumberResponse);

	const partNumber = first(partNumberResponse?.partNumberList)?.partNumber;
	const innerCode = first(partNumberResponse?.partNumberList)?.innerCode;
	const completeFlag = partNumberResponse?.completeFlag;
	const cadId = partNumberResponse?.cadIdList?.join() ?? '';

	if (!partNumber || Flag.isFalse(completeFlag)) {
		return (
			<CadPreviewError
				errorType={
					Flag.isFalse(completeFlag)
						? 'part-number-incomplete-error'
						: 'unavailable-part-number-error'
				}
			/>
		);
	}

	return (
		<Presenter
			{...props}
			partNumber={partNumber}
			completeFlag={completeFlag}
			cadId={cadId}
			innerCode={innerCode}
		/>
	);
};
CadPreview.displayName = 'CadPreview';
