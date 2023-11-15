import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BrandListSpec.module.scss';
import { BrandCode, CValueFlag } from './types';
import { Checkbox } from '@/components/mobile/domain/specs/checkboxes';
import { CommonListSpec } from '@/components/mobile/domain/specs/series/CommonListSpec';
import { Flag } from '@/models/api/Flag';
import {
	Brand,
	CValue,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { isMisumi, MISUMI, notMisumi } from '@/utils/domain/brand';
import { getCValue, notHidden, selected } from '@/utils/domain/spec';

type Props = {
	brandList: Brand[];
	cValue: CValue;
	onChange: (
		payload: {
			brandCode: string[];
			cValueFlag: CValueFlag;
		},
		isClear?: boolean
	) => void;
};

/**
 * Brand List Spec Component
 */
export const BrandListSpec: React.FC<Props> = ({
	brandList,
	onChange,
	...restProps
}) => {
	const [t] = useTranslation();
	const [checkedBrandCodeList, setCheckedBrandCodeList] = useState<BrandCode[]>(
		[]
	);
	const [isCValueChecked, setIsCValueChecked] = useState(false);
	const cValue = getCValue(restProps.cValue);
	const notHiddenBrandList = useMemo(() => {
		return brandList.filter(notHidden);
	}, [brandList]);
	const misumiBrand = notHiddenBrandList.find(isMisumi);

	const notMisumiBrandList = useMemo(() => {
		return notHiddenBrandList
			.filter(notMisumi)
			.sort((l, r) =>
				l.brandName === r.brandName ? 0 : l.brandName > r.brandName ? 1 : -1
			);
	}, [notHiddenBrandList]);

	const handleClickBrand = (brandCode: string) => {
		const brandCodeList = [...checkedBrandCodeList];

		// update checkedBrandCodeList
		const isClear = checkedBrandCodeList.includes(brandCode);
		isClear
			? brandCodeList.splice(checkedBrandCodeList.indexOf(brandCode), 1)
			: brandCodeList.push(brandCode);
		setCheckedBrandCodeList(brandCodeList);

		// update isCValueChecked
		let cValueFlag: CValueFlag = isCValueChecked ? Flag.TRUE : undefined;
		if (brandCode === MISUMI && isClear) {
			setIsCValueChecked(false);
			cValueFlag = undefined;
		}

		onChange(
			{
				brandCode: brandCodeList,
				cValueFlag,
			},
			isClear
		);
	};

	const handleClickCValue = () => {
		const checked = !isCValueChecked;
		setIsCValueChecked(checked);

		let brandCode = checkedBrandCodeList;

		if (
			checked &&
			!checkedBrandCodeList.some(brandCode => brandCode === MISUMI)
		) {
			brandCode = [...checkedBrandCodeList].concat(MISUMI);
			setCheckedBrandCodeList(brandCode);
		}

		onChange({
			brandCode,
			cValueFlag: checked ? Flag.TRUE : undefined,
		});
	};

	useEffect(() => {
		setCheckedBrandCodeList(
			notHiddenBrandList.filter(selected).map(brand => brand.brandCode)
		);
	}, [notHiddenBrandList]);

	useEffect(() => {
		setIsCValueChecked(Flag.isTrue(cValue?.selectedFlag));
	}, [cValue?.selectedFlag]);

	return (
		<CommonListSpec
			title={t('mobile.components.domain.specs.series.brandListSpec.brand')}
		>
			{misumiBrand && (
				<div className={styles.content}>
					<div className={styles.item}>
						<Checkbox
							className={styles.alignTextCenter}
							theme="sub"
							checked={checkedBrandCodeList?.includes(misumiBrand.brandCode)}
							onClick={() => handleClickBrand(misumiBrand.brandCode)}
						>
							{misumiBrand.brandName}
						</Checkbox>
					</div>

					{misumiBrand.brandCode === MISUMI && cValue && (
						<div className={styles.item}>
							<Checkbox
								className={styles.alignTextCenter}
								theme="sub"
								checked={isCValueChecked}
								onClick={handleClickCValue}
							>
								{t('components.ui.specs.brandListSpec.economySeries')}
							</Checkbox>
						</div>
					)}
				</div>
			)}
			{notMisumiBrandList.length > 0 && (
				<div className={styles.content}>
					{notMisumiBrandList.map(brandItem => (
						<div className={styles.item} key={brandItem.brandCode}>
							<Checkbox
								className={styles.alignTextCenter}
								theme="sub"
								key={brandItem.brandCode}
								checked={checkedBrandCodeList?.includes(brandItem.brandCode)}
								onClick={() => handleClickBrand(brandItem.brandCode)}
							>
								{brandItem.brandName}
							</Checkbox>
						</div>
					))}
				</div>
			)}
		</CommonListSpec>
	);
};

BrandListSpec.displayName = 'BrandListSpec';
