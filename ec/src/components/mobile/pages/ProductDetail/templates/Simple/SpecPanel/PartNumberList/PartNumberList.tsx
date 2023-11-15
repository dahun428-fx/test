import { useCallback } from 'react';
import { PartNumberCell } from './PartNumberPanel';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import {
	PartNumber,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';

export type Props = {
	partNumberList: PartNumber[];
	specList: Spec[];
	load: (condition: Partial<SearchPartNumberRequest>) => void;
};

export const PartNumberList: React.VFC<Props> = ({
	partNumberList,
	specList,
	load,
}) => {
	const handleClickPartNumber = useCallback(
		({ partNumber, innerCode }: PartNumber) => {
			load({ innerCode, partNumber });
		},
		[load]
	);

	return (
		<div>
			{partNumberList.map(partNumber => (
				<PartNumberCell
					key={`${partNumber.innerCode}\t${partNumber.partNumber}`}
					partNumber={partNumber}
					specList={specList}
					selected={partNumberList.length === 1}
					selectPartNumber={() => handleClickPartNumber(partNumber)}
				/>
			))}
		</div>
	);
};
PartNumberList.displayName = 'PartNumberList';
