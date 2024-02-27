import {
	PUSpecViewType,
	ParametricUnitPartNumberSpec,
} from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import { OpenCloseType } from '@/models/api/constants/OpenCloseType';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import {
	AlterationSpec,
	SpecValue,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { assertNotNull } from '@/utils/assertions';
import { sendNumericSpecLog } from '@/utils/domain/spec/logs';
import {
	isAvailableNumericSpec,
	useNormalizeSpec,
} from '@/utils/domain/spec/normalize';
import { SendLogPayload } from '@/utils/domain/spec/types';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RadioButtonSpec.module.scss';
import { RadioButton } from '@/components/pc/ui/specs/RadioButton';
import { TextField } from '@/components/pc/ui/fields';
import { Button } from '@/components/pc/ui/buttons';
import { NumericSpecField } from '@/components/pc/ui/specs/fields/NumericSpecField';

const SPEC_VALUE_COUNT_BORDER = 15;
const SPEC_VALUE_LIST_DEFAULT_HEIGHT = 183;

type SpecValueList = string[];

type Props = {
	spec: ParametricUnitPartNumberSpec | AlterationSpec;
	onChange: (
		specs: Partial<SearchPartNumberRequest>,
		isHiddenSpec?: boolean
	) => void;
	sendLog: (payload: SendLogPayload) => void;
};

export const RadioButtonSpec: React.VFC<Props> = ({
	spec,
	onChange,
	sendLog,
}) => {
	const { t } = useTranslation();
	const normalizedSpec = useNormalizeSpec(spec);
	const { specCode } = normalizedSpec;
	const [checkedSpecValueList, setCheckedSpecValueList] =
		useState<SpecValueList>([]);
	const [filterText, setFilterText] = useState('');

	// show more
	const specValueListRef = useRef<HTMLUListElement>(null);
	const neverShowsShowMore =
		normalizedSpec.specViewType !== PUSpecViewType.PU_LIST_SELECT;
	const [showsShowMore, setShowsShowMore] = useState(false);
	const { bool: expanded, toggle } = useBoolState();
	const [maxHeight, setMaxHeight] = useState(SPEC_VALUE_LIST_DEFAULT_HEIGHT);
	const collapsible =
		'openCloseType' in spec && spec.openCloseType !== OpenCloseType.DISABLE;

	const { specValueList } = normalizedSpec;

	const refinedSpecValueList = useMemo(() => {
		const lowerText = filterText.toLowerCase();
		return specValueList.filter(specValue =>
			specValue.specValueDisp.toLowerCase().startsWith(lowerText)
		);
	}, [specValueList, filterText]);

	useEffect(() => {
		setCheckedSpecValueList(
			specValueList
				// 「hidden かつ selected」の specValue が返る可能性があり、
				// 単純系では hidden specValue も表示するため、ここで selected は使えない。
				.filter(specValue => Flag.isTrue(specValue.selectedFlag))
				.map(specValue => specValue.specValue)
		);
	}, [specValueList]);

	const showsTextFilter = useMemo(
		() =>
			normalizedSpec.specViewType === PUSpecViewType.PU_LIST_SELECT &&
			!normalizedSpec.numericSpec &&
			specValueList.length >= SPEC_VALUE_COUNT_BORDER,
		[
			normalizedSpec.numericSpec,
			normalizedSpec.specViewType,
			specValueList.length,
		]
	);

	const showsNoCandidate =
		normalizedSpec.specValueList.length > 0 &&
		refinedSpecValueList.length === 0;

	const handleClick = useCallback(
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

	/** Blur handler of numeric spec field */
	const handleBlur = useCallback(
		(specValue: string) => {
			sendNumericSpecLog({ specValue, prevSpec: normalizedSpec, sendLog });

			// numeric spec を変化させてもその1つに選択を絞り込まない。
			// 現在の選択に加えて、numeric spec の入力を追加する形で型番検索APIを呼び出す
			onChange({ [specCode]: [...checkedSpecValueList, specValue] });
		},
		[checkedSpecValueList, normalizedSpec, onChange, sendLog, specCode]
	);

	useEffect(() => {
		if (specValueListRef.current) {
			setMaxHeight(specValueListRef.current.scrollHeight);
			const observer = new ResizeObserver(([entry]) => {
				if (specValueListRef.current && entry) {
					const height = entry.target.scrollHeight;
					setMaxHeight(height);
					setShowsShowMore(height > SPEC_VALUE_LIST_DEFAULT_HEIGHT);
				}
			});
			observer.observe(specValueListRef.current);
			return () => observer.disconnect();
		}
	}, [refinedSpecValueList]);

	const specValueCheckboxList = useMemo(() => {
		const isTwoColumn =
			normalizedSpec.specViewType === PUSpecViewType.PU_TEXT_SELECT_LINE_2;
		const isThreeColumn =
			normalizedSpec.specViewType === PUSpecViewType.PU_TEXT_SELECT_LINE_3;

		return (
			<div
				className={classNames({
					[String(styles.radioContainer)]: isTwoColumn || isThreeColumn,
				})}
			>
				{refinedSpecValueList.map(specValue => {
					const checked = checkedSpecValueList.includes(specValue.specValue);
					return (
						<div
							key={specValue.specValue}
							className={classNames({
								[String(styles.twoColumn)]: isTwoColumn,
								[String(styles.threeColumn)]: isThreeColumn,
							})}
						>
							<RadioButton
								className={styles.tile}
								checked={checked}
								onClick={() => handleClick(specValue)}
							>
								<span
									dangerouslySetInnerHTML={{
										__html: specValue.specValueDisp,
									}}
								/>
							</RadioButton>
						</div>
					);
				})}
			</div>
		);
	}, [
		checkedSpecValueList,
		handleClick,
		normalizedSpec.specViewType,
		refinedSpecValueList,
	]);

	return (
		<>
			{showsTextFilter && (
				<div>
					<TextField
						value={filterText}
						placeholder={t(
							'pages.productDetail.pu.specFilter.specs.textListSpec.filterPlaceholder'
						)}
						className={styles.filter}
						onChange={setFilterText}
					/>
					{showsNoCandidate && (
						<div className={styles.noCandidate}>
							{t(
								'pages.productDetail.pu.specFilter.specs.textListSpec.noCandidate'
							)}
						</div>
					)}
				</div>
			)}
			{neverShowsShowMore ? (
				<ul className={styles.container}>{specValueCheckboxList}</ul>
			) : (
				<>
					<ul
						ref={specValueListRef}
						className={styles.container}
						style={{
							maxHeight: expanded ? maxHeight : SPEC_VALUE_LIST_DEFAULT_HEIGHT,
						}}
						// SpecFrame の transition と競合するため指定しています
						data-transition={!collapsible || !expanded}
					>
						{specValueCheckboxList}
					</ul>
					{showsShowMore && (
						<div>
							<Button
								theme="default-sub"
								className={classNames(
									styles.showMore,
									expanded ? styles.expand : styles.shrink
								)}
								icon="left-arrow"
								onClick={toggle}
							/>
						</div>
					)}
				</>
			)}
			{isAvailableNumericSpec(normalizedSpec) && (
				<div>
					<NumericSpecField spec={normalizedSpec} onBlur={handleBlur} inline />
				</div>
			)}
		</>
	);
};

RadioButtonSpec.displayName = 'RadioButtonSpec';
