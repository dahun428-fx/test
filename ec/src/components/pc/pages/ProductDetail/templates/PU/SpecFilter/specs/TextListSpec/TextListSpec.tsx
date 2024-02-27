import {
	AlterationSpec,
	SpecValue,
	SpecViewType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { ParametricUnitPartNumberSpec } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { useTranslation } from 'react-i18next';
import {
	isAvailableNumericSpec,
	useNormalizeSpec,
} from '@/utils/domain/spec/normalize';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBoolState } from '@/hooks/state/useBoolState';
import { OpenCloseType } from '@/models/api/constants/OpenCloseType';
import { Flag } from '@/models/api/Flag';
import { assertNotNull } from '@/utils/assertions';
import { sendNumericSpecLog } from '@/utils/domain/spec/logs';
import { Checkbox } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/Checkbox';
import styles from './TextListSpec.module.scss';
import { hidden } from '@/utils/domain/spec';
import { TextField } from '@/components/pc/ui/fields';
import { Button } from '@/components/pc/ui/buttons';
import classNames from 'classnames';
import { NumericSpecField } from '@/components/pc/ui/specs/fields/NumericSpecField';

const SPEC_VALUE_COUNT_BORDER = 20;
const SPEC_VALUE_LIST_DEFAULT_HEIGHT = 183;

type SpecValueList = string[];

type Props = {
	spec: ParametricUnitPartNumberSpec;
	onChange: (
		specs: Partial<SearchPartNumberRequest>,
		isHiddenSpec?: boolean
	) => void;
	sendLog: (payload: SendLogPayload) => void;
};

export const TextListSpec: React.VFC<Props> = ({ spec, onChange, sendLog }) => {
	const { t } = useTranslation();
	const normalizedSpec = useNormalizeSpec(spec);
	const { specCode } = normalizedSpec;
	const [checkedSpecValueList, setCheckedSpecValueList] =
		useState<SpecValueList>([]);
	const [text, setText] = useState('');

	// show more
	const specValueListRef = useRef<HTMLUListElement>(null);
	const neverShowsShowMore =
		normalizedSpec.specViewType !== SpecViewType.TEXT_BUTTON &&
		normalizedSpec.specViewType !== SpecViewType.LIST;
	const [showsShowMore, setShowsShowMore] = useState(false);
	const { bool: expanded, toggle } = useBoolState();
	const [maxHeight, setMaxHeight] = useState(SPEC_VALUE_LIST_DEFAULT_HEIGHT);
	const collapsible = spec.openCloseType !== OpenCloseType.DISABLE;

	const specValueList = useMemo(() => {
		if (
			normalizedSpec.specViewType === SpecViewType.TEXT_BUTTON ||
			normalizedSpec.specViewType === SpecViewType.LIST
		) {
			return [
				// selected かつ hidden の specValue は、selected なものとしてグルーピングされる。(2022/12/9 日本本番仕様)
				// このため、 @/utils/domain/spec の selected を使用していない
				...normalizedSpec.specValueList.filter(specValue =>
					Flag.isTrue(specValue.selectedFlag)
				),
				...normalizedSpec.specValueList.filter(
					specValue =>
						Flag.isFalse(specValue.selectedFlag) &&
						Flag.isFalse(specValue.hiddenFlag)
				),
				...normalizedSpec.specValueList.filter(
					specValue =>
						Flag.isFalse(specValue.selectedFlag) &&
						Flag.isTrue(specValue.hiddenFlag)
				),
			];
		}

		return normalizedSpec.specValueList;
	}, [normalizedSpec.specValueList, normalizedSpec.specViewType]);

	const refinedSpecValueList = useMemo(() => {
		const lowerText = text.toLowerCase();
		return specValueList.filter(specValue =>
			specValue.specValueDisp.toLowerCase().startsWith(lowerText)
		);
	}, [specValueList, text]);

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
			(normalizedSpec.specViewType === SpecViewType.TEXT_BUTTON ||
				normalizedSpec.specViewType === SpecViewType.LIST) &&
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

	const specValueCheckboxList = useMemo(
		() =>
			refinedSpecValueList.map(specValue => {
				const checked = checkedSpecValueList.includes(specValue.specValue);
				return (
					<li key={specValue.specValue}>
						<Checkbox
							className={styles.tile}
							checked={checked}
							weak={hidden(specValue)}
							onClick={() => handleClick(specValue)}
						>
							<span
								dangerouslySetInnerHTML={{
									__html: specValue.specValueDisp,
								}}
							/>
						</Checkbox>
					</li>
				);
			}),
		[checkedSpecValueList, handleClick, refinedSpecValueList]
	);

	return (
		<>
			{showsTextFilter && (
				<div>
					<TextField
						value={text}
						placeholder={t(
							'pages.productDetail.simple.specFilter.specs.textListSpec.filterPlaceholder'
						)}
						className={styles.filter}
						onChange={setText}
					/>
					{showsNoCandidate && (
						<div className={styles.noCandidate}>
							{t(
								'pages.productDetail.simple.specFilter.specs.textListSpec.noCandidate'
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

TextListSpec.displayName = 'TextListSpec';
