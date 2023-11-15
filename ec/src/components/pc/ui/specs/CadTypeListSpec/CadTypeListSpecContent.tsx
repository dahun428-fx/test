import React from 'react';
import { Checkbox } from '@/components/pc/ui/specs/checkboxes/Checkbox';
import { CadType } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';

type Props = {
	className?: string;
	cadTypeListValueList: CadType[];
	checkedCadTypeValues: string[];
	onClick: (cadType: string) => void;
};

/** Cad type list spec content */
export const CadTypeListSpecContent: React.VFC<Props> = ({
	className,
	cadTypeListValueList,
	checkedCadTypeValues,
	onClick,
}) => {
	return (
		<ul className={className}>
			{cadTypeListValueList.map(cadTypeItem => (
				<Checkbox
					key={cadTypeItem.cadType}
					checked={checkedCadTypeValues.includes(cadTypeItem.cadType)}
					onClick={() => onClick(cadTypeItem.cadType)}
				>
					{cadTypeItem.cadTypeDisp}
				</Checkbox>
			))}
		</ul>
	);
};

CadTypeListSpecContent.displayName = 'CadTypeListSpecContent';
