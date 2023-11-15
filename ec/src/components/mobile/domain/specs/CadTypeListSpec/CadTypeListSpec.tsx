import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CadTypeListSpec.module.scss';
import { SpecFrame } from '@/components/mobile/domain/specs/SpecFrame';
import { Checkbox } from '@/components/mobile/domain/specs/checkboxes';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import { Flag } from '@/models/api/Flag';
import { CadType } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { assertNotNull } from '@/utils/assertions';
import { notHidden, selected } from '@/utils/domain/spec';

type CadTypeList = string[];

export type Props = {
	cadTypeList: CadType[];
	onChange: (payload: ChangePayload) => void;
};

/**
 * CadTypeList spec Checkbox list
 */
export const CadTypeListSpec: React.VFC<Props> = ({
	cadTypeList: rawCadTypeList,
	onChange,
}) => {
	const { t } = useTranslation();

	const [checkedCadTypeList, setCheckedCadTypeList] = useState<CadTypeList>([]);

	const cadTypeList = useMemo(
		() => rawCadTypeList.filter(notHidden),
		[rawCadTypeList]
	);

	useEffect(() => {
		setCheckedCadTypeList(
			cadTypeList
				.filter(selectedValue => Flag.isTrue(selectedValue.selectedFlag))
				.map(cadTypeListValue => cadTypeListValue.cadType)
		);
	}, [cadTypeList]);

	const handleClick = ({ cadType, cadTypeDisp, selectedFlag }: CadType) => {
		const foundValue = cadTypeList.find(value => cadType === value.cadType);
		assertNotNull(foundValue);

		const newList = [...checkedCadTypeList];

		checkedCadTypeList?.includes(cadType)
			? newList.splice(checkedCadTypeList.indexOf(cadType), 1)
			: newList.push(cadType);

		setCheckedCadTypeList(newList);
		onChange({
			selectedSpecs: { cadType: newList },
			log: {
				specName: t('components.ui.specs.cadTypeListSpec.cadTypeListSpecName'),
				specValueDisp: cadTypeDisp,
				selected: !Flag.isTrue(selectedFlag),
			},
		});
	};

	const handleClear = useCallback(() => {
		setCheckedCadTypeList([]);
		onChange({ selectedSpecs: { cadType: [] } });
	}, [onChange]);

	return (
		<SpecFrame
			specName={t('mobile.components.domain.specs.cadTypeListSpec.title')}
			selectedFlag={Flag.toFlag(cadTypeList.some(selected))}
			onClear={handleClear}
		>
			<ul className={styles.container}>
				{cadTypeList.map((cadType, index) => (
					<li key={index}>
						<Checkbox
							className={styles.tile}
							checked={checkedCadTypeList?.includes(cadType.cadType)}
							onClick={() => handleClick(cadType)}
						>
							{cadType.cadTypeDisp}
						</Checkbox>
					</li>
				))}
			</ul>
		</SpecFrame>
	);
};
CadTypeListSpec.displayName = 'CadTypeListSpec';
