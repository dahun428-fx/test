import React from 'react';
import { useTranslation } from 'react-i18next';
import Sticky from 'react-stickynode';
import styles from './SpecSearchPanel.module.scss';
import { BrandListSpec } from '@/components/pc/ui/specs/BrandListSpec';
import { CadTypeListSpec } from '@/components/pc/ui/specs/CadTypeListSpec';
import { ImageListSpec } from '@/components/pc/ui/specs/ImageListSpec';
import { NumericSpec } from '@/components/pc/ui/specs/NumericSpec';
import { TextListSpec } from '@/components/pc/ui/specs/TextListSpec';
import { Flag } from '@/models/api/Flag';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import {
	CadType,
	SeriesSpec,
	Brand as SeriesBrand,
	CValue,
	SpecViewType,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { notHidden } from '@/utils/domain/spec';
import { isSpecHidden } from '@/utils/spec';

type Props = {
	specList: SeriesSpec[];
	brandIndexList: Brand[];
	brandList: SeriesBrand[];
	cadTypeList: CadType[];
	cValue: CValue;
	stickyBottomSelector: string;
	onChange: () => void;
	onClearAll: () => void;
};

const PANEL_HEADER_HEIGHT = 50;

/** Spec search panel component */
export const SpecSearchPanel: React.VFC<Props> = ({
	specList,
	brandList,
	brandIndexList,
	cadTypeList,
	cValue,
	stickyBottomSelector,
	onChange,
	onClearAll,
}) => {
	const [t] = useTranslation();

	const showsBrandList = brandList.some(notHidden);
	const showsCadTypeList = cadTypeList.some(notHidden);

	return (
		<Sticky
			bottomBoundary={stickyBottomSelector}
			innerActiveClass={styles.sticky}
		>
			<div>
				<div className={styles.panelHeader}>
					<h2 className={styles.title}>
						{t('components.domain.category.specSearchPanel.configure')}
					</h2>
					<p className={styles.clearAll} onClick={onClearAll}>
						{t('components.domain.category.specSearchPanel.clearAll')}
					</p>
				</div>

				<ul
					className={styles.main}
					style={{ maxHeight: `calc(100vh - ${PANEL_HEADER_HEIGHT}px)` }}
				>
					{specList
						.filter(spec => !isSpecHidden(spec))
						.map(spec => {
							switch (spec.specViewType) {
								case SpecViewType.IMAGE_SINGLE_LINE:
								case SpecViewType.IMAGE_DOUBLE_LINE:
								case SpecViewType.IMAGE_TRIPLE_LINE:
									// TODO: In PHP code, inside ImageListSpec, NumericSpec is existing.
									//       But current implementation is not. Need to re-check that is necessary or not.
									return (
										<li key={spec.specCode} className={styles.specItem}>
											<ImageListSpec
												isCategory
												spec={spec}
												onChange={onChange}
											/>
										</li>
									);
								case SpecViewType.TEXT_BUTTON:
								case SpecViewType.TEXT_SINGLE_LINE:
								case SpecViewType.TEXT_DOUBLE_LINE:
								case SpecViewType.TEXT_TRIPLE_LINE:
								case SpecViewType.LIST:
								case SpecViewType.AGGREGATION:
									return (
										<li key={spec.specCode} className={styles.specItem}>
											<TextListSpec
												isCategory
												spec={spec}
												onChange={onChange}
												isBreakWordForText
											/>
										</li>
									);
								case SpecViewType.NUMERIC:
									return !spec.numericSpec ||
										Flag.isTrue(spec.numericSpec.hiddenFlag) ? null : (
										<li key={spec.specCode} className={styles.specItem}>
											<NumericSpec spec={spec} onChange={onChange} />
										</li>
									);
								default:
									return null;
							}
						})}
					{showsBrandList && (
						<li className={styles.specItem}>
							<BrandListSpec
								{...{
									brandList,
									brandIndexList,
									cValue,
									onChange,
								}}
							/>
						</li>
					)}
					{showsCadTypeList && (
						<li className={styles.specItem}>
							<CadTypeListSpec {...{ cadTypeList, onChange }} isCategory />
						</li>
					)}
				</ul>
			</div>
		</Sticky>
	);
};

SpecSearchPanel.displayName = 'SpecSearchPanel';
