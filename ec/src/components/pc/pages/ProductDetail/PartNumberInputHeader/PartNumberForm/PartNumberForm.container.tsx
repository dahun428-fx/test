import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { PartNumberForm as Presenter } from './PartNumberForm';
import { useSelector } from '@/store/hooks';
import {
	searchPartNumberWithInput,
	selectInputPartNumber,
} from '@/store/modules/pages/productDetail';

type Props = {
	seriesCode: string;
	partNumber?: string;
};

export const PartNumberForm: React.VFC<Props> = ({
	partNumber,
	seriesCode,
}) => {
	const dispatch = useDispatch();
	const inputPartNumber = useSelector(selectInputPartNumber);

	const handleSubmit = useCallback(
		(partNumber: string) => {
			if (inputPartNumber !== partNumber) {
				searchPartNumberWithInput(dispatch)({ seriesCode, partNumber });
			}
		},
		[dispatch, inputPartNumber, seriesCode]
	);

	return <Presenter partNumber={partNumber} onSubmit={handleSubmit} />;
};
PartNumberForm.displayName = 'PartNumberForm';
