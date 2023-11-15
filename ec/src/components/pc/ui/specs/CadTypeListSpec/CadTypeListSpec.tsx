import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CadTypeListPopoverTrigger } from './CadTypeListPopoverTrigger';
import styles from './CadTypeListSpec.module.scss';
import { CadTypeListSpecContent } from '@/components/pc/ui/specs/CadTypeListSpec/CadTypeListSpecContent';
import { SpecFrame } from '@/components/pc/ui/specs/SpecFrame';
import { Flag } from '@/models/api/Flag';
import { CadType } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { selected, someSelected } from '@/utils/domain/spec';
import { SendLogPayload } from '@/utils/domain/spec/types';

type CadTypeValues = string[];
type SpecCode = string;
type SpecValues = string[];

export type Props = {
	cadTypeList: CadType[];
	onChange: (spec: Record<SpecCode, SpecValues>, isClear?: boolean) => void;
	isCategory?: boolean;
	sendLog?: (payload: SendLogPayload) => void;
};

/**
 * CadTypeList spec Checkbox list
 */
export const CadTypeListSpec: React.VFC<Props> = ({
	cadTypeList,
	isCategory = false,
	onChange,
	sendLog,
}) => {
	const { t } = useTranslation();

	const [checkedCadTypeValues, setCheckedCadTypeValues] =
		useState<CadTypeValues>([]);
	const frameRef = useRef<HTMLDivElement>(null);

	/**  TODO: DEV MODE: if we are using DEV mode (not implemented in Malaysia Mirai PJ yet), then always display everything. 
		(if the hidden flag is "1", then show the item as greyed out and do not let the user select it)	
	*/

	const cadTypeListValueList = useMemo(() => {
		const cadTypeListListWithFilter = cadTypeList.filter(cadTypeItem =>
			Flag.isFalse(cadTypeItem.hiddenFlag)
		);

		if (!cadTypeListListWithFilter.length) {
			return [];
		}

		return cadTypeListListWithFilter;
	}, [cadTypeList]);

	useEffect(() => {
		setCheckedCadTypeValues(
			cadTypeListValueList
				.filter(selected)
				.map(cadTypeListValue => cadTypeListValue.cadType)
		);
	}, [cadTypeListValueList]);

	const handleClick = (clickedCadTypeValue: string) => {
		const newValues = [...checkedCadTypeValues];

		checkedCadTypeValues?.includes(clickedCadTypeValue)
			? newValues.splice(checkedCadTypeValues.indexOf(clickedCadTypeValue), 1)
			: newValues.push(clickedCadTypeValue);

		setCheckedCadTypeValues(newValues);
		onChange({ cadType: newValues });

		const foundSpec = cadTypeList.find(
			cadType => cadType.cadType === clickedCadTypeValue
		);
		if (foundSpec) {
			sendLog?.({
				specName: t('components.ui.specs.cadTypeListSpec.cadTypeListSpecName'),
				specValueDisp: foundSpec.cadTypeDisp,
				selected: !Flag.isTrue(foundSpec.selectedFlag),
			});
		}
	};

	const handleClear = useCallback(() => {
		setCheckedCadTypeValues([]);
		onChange({ cadType: [] }, true);
	}, [onChange, setCheckedCadTypeValues]);

	const selectedCadTypeValueList = useMemo(() => {
		if (someSelected(cadTypeList)) {
			return cadTypeList.filter(selected);
		}
		return cadTypeList;
	}, [cadTypeList]);

	if (!cadTypeList.length || !cadTypeListValueList.length) {
		return null;
	}

	return (
		<SpecFrame
			ref={frameRef}
			specName={t('components.ui.specs.cadTypeListSpec.cadTypeListSpecName')}
			selectedFlag={Flag.toFlag(cadTypeList.filter(selected).length)}
			onClear={handleClear}
		>
			<div className={styles.container}>
				<CadTypeListSpecContent
					cadTypeListValueList={selectedCadTypeValueList}
					checkedCadTypeValues={checkedCadTypeValues}
					onClick={handleClick}
				/>
			</div>

			<CadTypeListPopoverTrigger
				isCategory={isCategory}
				cadTypeList={cadTypeList}
				onClear={handleClear}
				frameRef={frameRef}
			>
				<CadTypeListSpecContent
					className={styles.horizontal}
					cadTypeListValueList={cadTypeListValueList}
					checkedCadTypeValues={checkedCadTypeValues}
					onClick={handleClick}
				/>
			</CadTypeListPopoverTrigger>
		</SpecFrame>
	);
};
CadTypeListSpec.displayName = 'CadTypeListSpec';
