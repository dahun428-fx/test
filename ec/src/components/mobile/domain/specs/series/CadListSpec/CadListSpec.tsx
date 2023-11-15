import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CadListSpec.module.scss';
import { Checkbox } from '@/components/mobile/domain/specs/checkboxes/';
import { CommonListSpec } from '@/components/mobile/domain/specs/series/CommonListSpec';
import { CadType } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { notHidden, selected } from '@/utils/domain/spec';

type Props = {
	cadTypeList: CadType[];
	onChange: (payload: { cadType: string[] }) => void;
};

/**
 * Cad list spec components
 */
export const CadListSpec: React.FC<Props> = ({ cadTypeList, onChange }) => {
	const [t] = useTranslation();
	const [checkedCadSpec, setCheckedCadSpec] = useState<string[]>([]);

	useEffect(() => {
		const notHiddenCadTypeList = cadTypeList
			.filter(notHidden)
			.filter(selected)
			.map(cad => cad.cadType);

		setCheckedCadSpec(notHiddenCadTypeList);
	}, [cadTypeList]);

	const handleClick = useCallback(
		({ cadType }: CadType) => {
			const cadTypeList = [...checkedCadSpec];
			const checked = checkedCadSpec?.includes(cadType);

			if (checked) {
				cadTypeList.splice(checkedCadSpec.indexOf(cadType), 1);
			} else {
				cadTypeList.push(cadType);
			}

			setCheckedCadSpec(cadTypeList);
			onChange({ cadType: cadTypeList });
		},
		[checkedCadSpec, onChange]
	);
	return (
		<CommonListSpec
			title={t('mobile.components.domain.specs.series.cadListSpec.cad')}
		>
			<div className={styles.container}>
				{cadTypeList.map((cadType, index) => {
					return (
						<Checkbox
							className={styles.item}
							checked={checkedCadSpec.includes(cadType.cadType)}
							theme="sub"
							key={index}
							onClick={() => {
								handleClick(cadType);
							}}
						>
							{cadType.cadTypeDisp}
						</Checkbox>
					);
				})}
			</div>
		</CommonListSpec>
	);
};

CadListSpec.displayName = 'CadListSpec';
