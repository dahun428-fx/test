import {
	PUSpecViewType,
	ParametricUnitPartNumberSpec,
} from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import {
	AlterationSpec,
	SpecValue,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { assertNotNull } from '@/utils/assertions';
import { useNormalizeSpec } from '@/utils/domain/spec/normalize';
import { SendLogPayload } from '@/utils/domain/spec/types';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SelectSpec.module.scss';
import { Select } from '@/components/pc/ui/controls/select';

type SpecValueList = string[];

type Props = {
	spec: ParametricUnitPartNumberSpec | AlterationSpec;
	onChange: (
		specs: Partial<SearchPartNumberRequest>,
		isHiddenSpec?: boolean
	) => void;
	sendLog: (payload: SendLogPayload) => void;
};

export const SelectSpec: React.VFC<Props> = ({ spec, onChange, sendLog }) => {
	const { t } = useTranslation();
	const normalizedSpec = useNormalizeSpec(spec);
	const { specCode } = normalizedSpec;
	const [checkedSpecValueList, setCheckedSpecValueList] =
		useState<SpecValueList>([]);
	const specValueListRef = useRef<HTMLUListElement>(null);

	const { specValueList } = normalizedSpec;

	useEffect(() => {
		setCheckedSpecValueList(
			specValueList
				// 「hidden かつ selected」の specValue が返る可能性があり、
				// 単純系では hidden specValue も表示するため、ここで selected は使えない。
				.filter(specValue => Flag.isTrue(specValue.selectedFlag))
				.map(specValue => specValue.specValue)
		);
	}, [specValueList]);

	const handleSelect = useCallback(
		({ specValue, specValueDisp, selectedFlag }: SpecValue) => {
			const foundValue = specValueList.find(
				value => specValue === value.specValue
			);
			assertNotNull(foundValue);

			sendLog({
				specName: normalizedSpec.specName,
				specValueDisp,
				selected: !Flag.isTrue(selectedFlag), // toggle
			});

			setCheckedSpecValueList([specValue]);
			const isHidden = Flag.isTrue(foundValue.hiddenFlag);
			onChange({ [specCode]: [specValue] }, isHidden);
		},
		[specValueList, sendLog, normalizedSpec.specName, onChange, specCode]
	);

	const specValueSelectList = useMemo(() => {
		const isTwoColumn =
			normalizedSpec.specViewType === PUSpecViewType.PU_TEXT_SELECT_LINE_2;
		const isThreeColumn =
			normalizedSpec.specViewType === PUSpecViewType.PU_TEXT_SELECT_LINE_3;

		const selectOptions = specValueList.map(specValue => ({
			value: specValue.specValue,
			label: specValue.specValueDisp,
		}));

		selectOptions.unshift({
			value: '',
			label: t(
				'pages.productDetail.pu.specFilter.specs.selectSpec.defaultOption'
			),
		});

		return (
			<div
				className={classNames({
					[String(styles.radioContainer)]: isTwoColumn || isThreeColumn,
				})}
			>
				<Select
					className={styles.select}
					items={selectOptions}
					value={checkedSpecValueList[0]}
					onChange={selectedOption => {
						if (!selectedOption.value) {
							return;
						}
						const foundValue = specValueList.find(
							value => selectedOption.value === value.specValue
						);
						assertNotNull(foundValue);

						handleSelect(foundValue);
					}}
				/>
			</div>
		);
	}, [
		checkedSpecValueList,
		handleSelect,
		normalizedSpec.specViewType,
		specValueList,
		t,
	]);

	return (
		<>
			<>
				<ul ref={specValueListRef} className={styles.container}>
					{specValueSelectList}
				</ul>
			</>
		</>
	);
};

SelectSpec.displayName = 'SelectSpec';
