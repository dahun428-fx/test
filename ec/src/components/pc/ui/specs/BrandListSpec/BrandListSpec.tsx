import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BrandListSpec.module.scss';
import {
	BrandPopoverContents,
	BrandPopoverContentsRef,
} from './BrandPopoverContents';
import { BrandPopoverTrigger } from './BrandPopoverTrigger';
import { BRAND_COUNT_BORDER, DISPLAY_BORDER } from './constants';
import { BrandCode, CValueFlag } from './types';
import { getCValue } from './utils';
import { TextField } from '@/components/pc/ui/fields/TextField';
import { SpecFrame } from '@/components/pc/ui/specs/SpecFrame';
import { Checkbox } from '@/components/pc/ui/specs/checkboxes/Checkbox';
import { Flag } from '@/models/api/Flag';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import {
	Brand as SeriesBrand,
	CValue,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { isMisumi, MISUMI, notMisumi } from '@/utils/domain/brand';
import {
	notHidden,
	notSelected,
	selected,
	someSelected,
} from '@/utils/domain/spec';

export type Props = {
	brandList: SeriesBrand[];
	brandIndexList: Brand[];
	cValue: CValue;
	isSearchResult?: boolean;
	onChange: (
		payload: { brandCode: string[]; cValueFlag: CValueFlag },
		isClear?: boolean
	) => void;
};

/**
 * Brand checkbox list
 */
export const BrandListSpec: React.VFC<Props> = props => {
	const { onChange, brandIndexList } = props;
	const { t } = useTranslation();

	const frameRef = useRef<HTMLDivElement>(null);
	const brandPopoverContentsRef = useRef<BrandPopoverContentsRef>(null);
	const [checkedBrandCodeList, setCheckedBrandCodeList] = useState<BrandCode[]>(
		[]
	);
	const [isCValueChecked, setIsCValueChecked] = useState<boolean>(false);
	const [text, setText] = useState('');

	/** Shows unselected items or not */
	// DO NOT use brandList here, use props.brandList.
	const showsUnselected = props.brandList.length > BRAND_COUNT_BORDER;

	const notHiddenBrandList: SeriesBrand[] = useMemo(
		() => props.brandList.filter(notHidden),
		[props.brandList]
	);

	const sortedNotHiddenBrandList: SeriesBrand[] = useMemo(() => {
		const brandList = [];

		const misumi = notHiddenBrandList.find(isMisumi);
		if (misumi) {
			brandList.push(misumi);
		}

		return showsUnselected
			? brandList
					.concat(notHiddenBrandList.filter(selected).filter(notMisumi))
					.concat(notHiddenBrandList.filter(notSelected).filter(notMisumi))
			: brandList.concat(notHiddenBrandList.filter(notMisumi));
	}, [notHiddenBrandList, showsUnselected]);

	const someBrandSelected = useMemo(
		() => someSelected(notHiddenBrandList),
		[notHiddenBrandList]
	);

	/** filtered brand list on panel */
	const refinedBrandList: SeriesBrand[] = useMemo(() => {
		const lowerText = text.toLowerCase();
		return sortedNotHiddenBrandList
			.filter(brand => showsUnselected || !someBrandSelected || selected(brand))
			.filter(brand => brand.brandName.toLowerCase().includes(lowerText));
	}, [showsUnselected, someBrandSelected, sortedNotHiddenBrandList, text]);

	const cValue = useMemo(() => getCValue(props.cValue), [props.cValue]);

	const showsTextFilter = useMemo(
		() =>
			(!someBrandSelected || showsUnselected) &&
			notHiddenBrandList.length >= DISPLAY_BORDER,
		[notHiddenBrandList.length, showsUnselected, someBrandSelected]
	);

	/** Shows no candidate message or not */
	const showsNoCandidate =
		notHiddenBrandList.length > 0 && refinedBrandList.length === 0;

	useEffect(() => {
		setCheckedBrandCodeList(
			notHiddenBrandList.filter(selected).map(brand => brand.brandCode)
		);
	}, [notHiddenBrandList]);

	useEffect(() => {
		setIsCValueChecked(Flag.isTrue(cValue?.selectedFlag));
	}, [cValue?.selectedFlag]);

	const handleClickBrand = (brandCode: string) => {
		const brandCodeList = [...checkedBrandCodeList];

		// update checkedBrandCodeList
		const checked = checkedBrandCodeList.includes(brandCode);
		checked
			? brandCodeList.splice(checkedBrandCodeList.indexOf(brandCode), 1)
			: brandCodeList.push(brandCode);
		setCheckedBrandCodeList(brandCodeList);

		// update isCValueChecked
		let cValueFlag: CValueFlag = isCValueChecked ? Flag.TRUE : undefined;
		if (brandCode === MISUMI && checked) {
			setIsCValueChecked(false);
			cValueFlag = undefined;
		}

		onChange({
			brandCode: brandCodeList,
			cValueFlag,
		});
	};

	const handleClickCValue = () => {
		const checked = !isCValueChecked;
		setIsCValueChecked(checked);

		if (
			checked &&
			!checkedBrandCodeList.some(brandCode => brandCode === MISUMI)
		) {
			const brandCodeList = [...checkedBrandCodeList].concat(MISUMI);
			setCheckedBrandCodeList(brandCodeList);
			onChange({
				brandCode: brandCodeList,
				cValueFlag: checked ? Flag.TRUE : undefined,
			});
		} else {
			onChange({
				brandCode: checkedBrandCodeList,
				cValueFlag: checked ? Flag.TRUE : undefined,
			});
		}
	};

	const handleClear = () => {
		setCheckedBrandCodeList([]);
		setIsCValueChecked(false);
		setText('');
		onChange({ brandCode: [], cValueFlag: undefined }, true);

		// clear on popover
		brandPopoverContentsRef.current?.clear?.();
	};

	return (
		<SpecFrame
			specName={t('components.ui.specs.brandListSpec.title')}
			selectedFlag={Flag.toFlag(notHiddenBrandList.filter(selected).length)}
			onClear={handleClear}
			ref={frameRef}
		>
			{showsTextFilter && (
				<div>
					<TextField
						value={text}
						placeholder={t(
							'components.ui.specs.brandListSpec.refineTextPlaceholder'
						)}
						className={styles.filter}
						onChange={setText}
					/>
				</div>
			)}
			<div className={styles.container}>
				{showsNoCandidate && (
					<div className={styles.noCandidate}>
						{t('components.ui.specs.brandListSpec.notCandidate')}
					</div>
				)}

				<ul>
					{refinedBrandList.map(brand => (
						<Fragment key={brand.brandCode}>
							<Checkbox
								checked={checkedBrandCodeList.includes(brand.brandCode)}
								onClick={() => handleClickBrand(brand.brandCode)}
							>
								{brand.brandName} ({brand.seriesCount})
							</Checkbox>
							{brand.brandCode === MISUMI && cValue && (
								<li className={styles.economy}>
									<ul>
										<Checkbox
											checked={isCValueChecked}
											onClick={handleClickCValue}
										>
											{t('components.ui.specs.brandListSpec.economySeries')}
											{cValue.seriesCount != null && ` (${cValue.seriesCount})`}
										</Checkbox>
									</ul>
								</li>
							)}
						</Fragment>
					))}
				</ul>
			</div>
			{/* showsUnselected だけは popover を絶対に表示しない条件であるため trigger 内ではなくここでチェック */}
			{!showsUnselected && (
				<BrandPopoverTrigger
					brandList={notHiddenBrandList}
					isSearchResult={props.isSearchResult}
					onClear={handleClear}
					frameRef={frameRef}
				>
					<BrandPopoverContents
						brandList={notHiddenBrandList}
						brandIndexList={brandIndexList}
						cValue={cValue}
						isCValueChecked={isCValueChecked}
						text={text}
						onChange={onChange}
						ref={brandPopoverContentsRef}
					/>
				</BrandPopoverTrigger>
			)}
		</SpecFrame>
	);
};
BrandListSpec.displayName = 'BrandListSpec';
