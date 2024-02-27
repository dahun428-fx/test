import { CadType } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { Flag } from '@/models/api/Flag';
import { assertNotNull } from '@/utils/assertions';
import { SpecCode } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/SpecFilter.types';
import { Checkbox } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/Checkbox';
import { SpecFrame } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/SpecFrame';
import styles from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/CadTypeListSpec/CadTypeListSpec.module.scss';
import { hidden } from '@/utils/domain/spec';

type CadTypeValues = string[];
type SpecValues = string[];

type Props = {
	cadTypeList: CadType[];
	onChange: (spec: Record<SpecCode, SpecValues>) => void;
	onSelectHiddenSpec: (selectedSpec: Record<SpecCode, string>) => void;
	sendLog: (payload: SendLogPayload) => void;
};

/**
 * CadTypeList spec Checkbox list
 */
export const CadTypeListSpec: React.VFC<Props> = ({
	cadTypeList,
	onChange,
	onSelectHiddenSpec,
	sendLog,
}) => {
	const { t } = useTranslation();

	const [checkedCadTypeValues, setCheckedCadTypeValues] =
		useState<CadTypeValues>([]);

	useEffect(() => {
		setCheckedCadTypeValues(
			cadTypeList
				.filter(selectedValue => Flag.isTrue(selectedValue.selectedFlag))
				.map(cadTypeListValue => cadTypeListValue.cadType)
		);
	}, [cadTypeList]);

	const handleClick = ({ cadType, cadTypeDisp, selectedFlag }: CadType) => {
		const foundValue = cadTypeList.find(value => cadType === value.cadType);
		assertNotNull(foundValue);

		sendLog({
			specName: t(
				'pages.productDetail.simple.specFilter.specs.cadTypeListSpec.cadTypeListSpecName'
			),
			specValueDisp: cadTypeDisp,
			selected: !Flag.isTrue(selectedFlag), // toggle
		});

		if (Flag.isTrue(foundValue.hiddenFlag)) {
			setCheckedCadTypeValues([cadType]);
			return onSelectHiddenSpec({ cadType: cadType });
		}

		const newValues = [...checkedCadTypeValues];

		// 選択時リストへの追加・削除の処理
		checkedCadTypeValues?.includes(cadType)
			? newValues.splice(checkedCadTypeValues.indexOf(cadType), 1)
			: newValues.push(cadType);

		setCheckedCadTypeValues(newValues);

		onChange({ cadType: newValues });
	};

	const handleClear = useCallback(() => {
		setCheckedCadTypeValues([]);
		onChange({ cadType: [] });
	}, [onChange, setCheckedCadTypeValues]);

	return (
		<SpecFrame
			specName={t(
				'pages.productDetail.simple.specFilter.specs.cadTypeListSpec.cadTypeListSpecName'
			)}
			selectedFlag={Flag.toFlag(
				cadTypeList.some(selectedValue =>
					Flag.isTrue(selectedValue.selectedFlag)
				)
			)}
			onClear={handleClear}
		>
			<ul className={styles.listItem}>
				{cadTypeList.map((cadType, index) => (
					<li key={index}>
						<Checkbox
							className={styles.tile}
							checked={checkedCadTypeValues?.includes(cadType.cadType)}
							weak={hidden(cadType)}
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
