import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './TextListSpec.module.scss';
import type { SpecCode } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/SpecFilter.types';
import { SpecFrame } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/SpecFrame';
import { Checkbox } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/checkboxes';
import { Button } from '@/components/pc/ui/buttons';
import { TextField } from '@/components/pc/ui/fields';
import { NumericSpecField } from '@/components/pc/ui/specs/fields/NumericSpecField';
import { useBoolState } from '@/hooks/state/useBoolState';
import { Flag } from '@/models/api/Flag';
import { OpenCloseType } from '@/models/api/constants/OpenCloseType';
import {
	PartNumberSpec,
	SpecValue,
	SpecViewType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { assertNotNull } from '@/utils/assertions';
// NOTE: 単純系では @/utils/domain/spec はそのままでは使えない場合があるため使用時は注意
import { hidden } from '@/utils/domain/spec';
import { sendNumericSpecLog } from '@/utils/domain/spec/logs';
import {
	isAvailableNumericSpec,
	useNormalizeSpec,
} from '@/utils/domain/spec/normalize';
import { SendLogPayload } from '@/utils/domain/spec/types';

const SPEC_VALUE_COUNT_BORDER = 20;
const SPEC_VALUE_LIST_DEFAULT_HEIGHT = 183;

type SpecValueList = string[];

export type Props = {
	spec: PartNumberSpec;
	onChange: (selectedSpecs: Record<SpecCode, SpecValueList>) => void;
	onSelectHiddenSpec: (selectedSpec: Record<SpecCode, string>) => void;
	sendLog: (payload: SendLogPayload) => void;
};

export const TextListSpec: React.VFC<Props> = ({
	spec,
	onChange,
	onSelectHiddenSpec,
	sendLog,
}) => {
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

			if (Flag.isTrue(foundValue.hiddenFlag)) {
				setCheckedSpecValueList([specValue]);
				return onSelectHiddenSpec({ [specCode]: specValue });
			}

			const newList = [...checkedSpecValueList];

			checkedSpecValueList?.includes(specValue)
				? newList.splice(checkedSpecValueList.indexOf(specValue), 1)
				: newList.push(specValue);

			setCheckedSpecValueList(newList);
			onChange({ [specCode]: newList });
		},
		[
			specValueList,
			sendLog,
			normalizedSpec.specName,
			checkedSpecValueList,
			onChange,
			specCode,
			onSelectHiddenSpec,
		]
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

	const handleClear = useCallback(() => {
		onChange({ [specCode]: [] });
		setText('');
	}, [onChange, specCode]);

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
		<SpecFrame {...normalizedSpec} onClear={handleClear}>
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
								className={styles.showMore}
								icon={expanded ? 'minus' : 'plus'}
								onClick={toggle}
							>
								{expanded
									? t(
											'pages.productDetail.simple.specFilter.specs.textListSpec.hide'
									  )
									: t(
											'pages.productDetail.simple.specFilter.specs.textListSpec.showMore',
											{ count: specValueList.length }
									  )}
							</Button>
						</div>
					)}
				</>
			)}

			{isAvailableNumericSpec(normalizedSpec) && (
				<div>
					<NumericSpecField spec={normalizedSpec} onBlur={handleBlur} inline />
				</div>
			)}
		</SpecFrame>
	);
};
TextListSpec.displayName = 'TextListSpec';
