import React, { useRef } from 'react';
import { useDetailTab, useComplexMeta } from './Complex.hooks';
import styles from './Complex.module.scss';
import { ComplexMeta } from './ComplexMeta';
import { SpecPanel } from './SpecPanel';
import { ActionsPanel } from '@/components/pc/pages/ProductDetail/ActionsPanel';
import { BrandCategory } from '@/components/pc/pages/ProductDetail/BrandCategory';
import { Breadcrumbs } from '@/components/pc/pages/ProductDetail/Breadcrumbs';
import { DetailTabs } from '@/components/pc/pages/ProductDetail/DetailTabs';
import { EconomyLabel } from '@/components/pc/pages/ProductDetail/EconomyLabel';
import { PageHeading } from '@/components/pc/pages/ProductDetail/PageHeading';
import { PartNumberHeader } from '@/components/pc/pages/ProductDetail/PartNumberHeader';
import { PartNumberSpecList } from '@/components/pc/pages/ProductDetail/PartNumberSpecList';
import { ProductAttributes } from '@/components/pc/pages/ProductDetail/ProductAttributes';
import { useTrackPageView } from '@/components/pc/pages/ProductDetail/ProductDetail.hooks';
import { ProductDocuments } from '@/components/pc/pages/ProductDetail/ProductDocuments';
import { ProductImagePanel } from '@/components/pc/pages/ProductDetail/ProductImagePanel';
import { ProductNotice } from '@/components/pc/pages/ProductDetail/ProductNotice';
import { RelatedToProductContents } from '@/components/pc/pages/ProductDetail/RelatedToProductContents/RelatedToProductContents';
import { SeriesInfoText } from '@/components/pc/pages/ProductDetail/SeriesInfoText';
import { StandardSpecList } from '@/components/pc/pages/ProductDetail/StandardSpecList';
import { Review } from '@/components/pc/pages/ProductDetail/Review';

export type Props = {
	seriesCode: string;
	partNumber?: string;
};

/**
 * Complex series page template
 */
export const Complex: React.VFC<Props> = ({ seriesCode }) => {
	const { currentPartNumberResponse } = useComplexMeta();
	const faqRef = useRef<HTMLDivElement>(null);
	const actionsPanelRef = useRef<HTMLDivElement>(null);

	/**
	 * NOTE:
	 * tabList: upper tabs data (tabId only)
	 * showsDetailInfo: Flag whether there is content to be displayed under the detailed information tab
	 * tabContents: All tab data including submitted HTML and flags if they are to be displayed as detailed information
	 * basicInfo: What to display in "Basic information"
	 */
	const { tabList, showsDetailInfo, series } = useDetailTab();

	useTrackPageView();

	return (
		<>
			<ComplexMeta
				tabs={tabList}
				series={series}
				partNumberResponse={currentPartNumberResponse}
			/>
			<div className={styles.main}>
				<div>
					<Breadcrumbs />
					<div className={styles.product} id="productContents">
						<div className={styles.specPanel}>
							<SpecPanel
								seriesCode={seriesCode}
								actionsPanelRef={actionsPanelRef}
							/>
						</div>

						<div className={styles.attributesPanel}>
							{/* <div className={styles.brandWrap}>
								<BrandCategory />
								<EconomyLabel className={styles.economy} />
								<SeriesDiscount />
							</div> */}
							<PageHeading className={styles.heading} />
							<div className={styles.introduction}>
								<div className={styles.imageColumn}>
									<ProductImagePanel />
									<ProductDocuments />
								</div>
								<div className={styles.attributesColumn}>
									<ProductAttributes
										showsDetailInfoLink={showsDetailInfo}
										faqRef={faqRef}
										basicInfoType="full"
										className={styles.attributes}
									/>
								</div>
								<div className={styles.introductionSub}>
									<StandardSpecList />
									<SeriesInfoText />
								</div>
							</div>

							<div className={styles.actionsPanelWrap}>
								<ActionsPanel
									seriesCode={seriesCode}
									alterationSpecEnabled
									similarSearchEnabled
									actionsPanelRef={actionsPanelRef}
								>
									<PartNumberHeader seriesCode={seriesCode} />
								</ActionsPanel>
							</div>
							<PartNumberSpecList />
							<DetailTabs />
						</div>
					</div>
					<div>
						<ProductNotice />
						<Review />
					</div>

					<RelatedToProductContents seriesCode={seriesCode} faqRef={faqRef} />
				</div>
			</div>
		</>
	);
};
Complex.displayName = 'Complex';
