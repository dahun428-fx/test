import React, {
	forwardRef,
	Fragment,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BrandPopoverContents.module.scss';
import { BrandCode, CValueFlag } from './types';
import { TextField } from '@/components/pc/ui/fields/TextField';
import { Checkbox } from '@/components/pc/ui/specs/checkboxes/Checkbox';
import { Flag } from '@/models/api/Flag';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import {
	Brand as SeriesBrand,
	CValue,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { getBrandGroupList, MISUMI } from '@/utils/domain/brand';
import { selected } from '@/utils/domain/spec';
import { fromEntries } from '@/utils/object';
import { notNull } from '@/utils/predicate';

export type BrandPopoverContentsRef = {
	clear: () => void;
};

type Props = {
	brandList: SeriesBrand[];
	brandIndexList: Brand[];
	cValue: CValue | null;
	isCValueChecked: boolean;
	text: string;
	onChange: (payload: { brandCode: string[]; cValueFlag: CValueFlag }) => void;
};

/**
 * Brand popover contents
 */
export const BrandPopoverContents = forwardRef<BrandPopoverContentsRef, Props>(
	(
		{
			brandList,
			brandIndexList,
			cValue,
			isCValueChecked: initialIsCValueChecked,
			text: initialText,
			onChange,
		},
		ref
	) => {
		const { t } = useTranslation();
		const [checkedBrandCodeList, setCheckedBrandCodeList] = useState<
			BrandCode[]
		>(brandList.filter(selected).map(brand => brand.brandCode));
		const [isCValueChecked, setIsCValueChecked] = useState<boolean>(
			initialIsCValueChecked
		);
		const [text, setText] = useState(initialText);
		useImperativeHandle(ref, () => ({ clear: () => setText('') }), []);

		const brands = useMemo(
			() => fromEntries(brandList.map(brand => [brand.brandCode, brand])),
			[brandList]
		);

		const brandGroupList = useMemo(
			() =>
				getBrandGroupList({
					brandList: brandIndexList,
					brandCodeList: brandList.map(brand => brand.brandCode),
				}),
			[brandIndexList, brandList]
		);

		const refinedBrandGroupList = useMemo(() => {
			const lowerText = text.toLowerCase();
			return brandGroupList
				.map(brandGroup => {
					const brandList = brandGroup.brandList.filter(
						brand =>
							selected(brands[brand.brandCode] ?? {}) ||
							brand.brandName.toLowerCase().includes(lowerText)
					);
					return brandList.length
						? {
								...brandGroup,
								brandList,
						  }
						: null;
				})
				.filter(notNull);
		}, [brandGroupList, brands, text]);

		useEffect(() => {
			setCheckedBrandCodeList(
				brandList.filter(selected).map(brand => brand.brandCode)
			);
		}, [brandList]);

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

		return (
			<>
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
				<ul className={styles.groupList}>
					{refinedBrandGroupList.map(brandGroup => {
						return (
							<li key={brandGroup.groupName} className={styles.group}>
								<h5 className={styles.groupName}>{brandGroup.groupName}</h5>
								<ul>
									{brandGroup.brandList.map(brand => (
										<Fragment key={brand.brandCode}>
											<Checkbox
												checked={checkedBrandCodeList.includes(brand.brandCode)}
												onClick={() => handleClickBrand(brand.brandCode)}
											>
												{brand.brandName}
												{brands[brand.brandCode]?.seriesCount != null &&
													// いつの日か以下の「?」を取り去りたい。ts が更新されて行けばいつか取れるかもしれない。
													` (${brands[brand.brandCode]?.seriesCount})`}
											</Checkbox>
											{brand.brandCode === MISUMI && cValue && (
												<li className={styles.economy}>
													<ul>
														<Checkbox
															checked={isCValueChecked}
															onClick={handleClickCValue}
														>
															{t(
																'components.ui.specs.brandListSpec.economySeries'
															)}
															{cValue.seriesCount != null &&
																` (${cValue.seriesCount})`}
														</Checkbox>
													</ul>
												</li>
											)}
										</Fragment>
									))}
								</ul>
							</li>
						);
					})}
				</ul>
			</>
		);
	}
);

BrandPopoverContents.displayName = 'BrandPopoverContents';
