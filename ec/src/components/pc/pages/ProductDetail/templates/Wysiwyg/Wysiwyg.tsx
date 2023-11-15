import React, { useRef } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { Meta } from './Meta';
import styles from './Wysiwyg.module.scss';
import { ActionsPanel } from '@/components/pc/pages/ProductDetail/ActionsPanel';
import { BrandCategory } from '@/components/pc/pages/ProductDetail/BrandCategory';
import { DetailTabs } from '@/components/pc/pages/ProductDetail/DetailTabs';
import { EconomyLabel } from '@/components/pc/pages/ProductDetail/EconomyLabel';
import { PageHeading } from '@/components/pc/pages/ProductDetail/PageHeading';
import { PartNumberInputHeader } from '@/components/pc/pages/ProductDetail/PartNumberInputHeader';
import { ProductAttributes } from '@/components/pc/pages/ProductDetail/ProductAttributes';
import { useTrackPageView } from '@/components/pc/pages/ProductDetail/ProductDetail.hooks';
import { ProductDocuments } from '@/components/pc/pages/ProductDetail/ProductDocuments';
import { ProductImagePanel } from '@/components/pc/pages/ProductDetail/ProductImagePanel';
import { ProductNotice } from '@/components/pc/pages/ProductDetail/ProductNotice';
import { RelatedToProductContents } from '@/components/pc/pages/ProductDetail/RelatedToProductContents';
import { SeriesInfoText } from '@/components/pc/pages/ProductDetail/SeriesInfoText';
import { StandardSpecList } from '@/components/pc/pages/ProductDetail/StandardSpecList';
import { TabId } from '@/models/domain/series/complexTab';

export type Props = {
	seriesCode: string;
	partNumber?: string;
};

const ignoreTabs: TabId[] = ['codeList'];

/**
 * Product detail Simple Template
 */
export const Wysiwyg: React.VFC<Props> = ({ seriesCode, partNumber }) => {
	const faqRef = useRef<HTMLDivElement>(null);

	useTrackPageView();

	return (
		<>
			<Meta />
			<div className={styles.main}>
				<Breadcrumbs />
				<div className={styles.attributesPanel}>
					<div className={styles.introduction}>
						<div className={styles.imageColumn}>
							<ProductImagePanel />
							<ProductDocuments />
						</div>
						<div className={styles.attributesColumn}>
							<div className={styles.brandWrap}>
								<BrandCategory />
								<EconomyLabel className={styles.economy} />
							</div>
							<PageHeading className={styles.heading} />
							<ProductAttributes
								faqRef={faqRef}
								className={styles.attributes}
							/>
							<StandardSpecList className={styles.specList} />
							<SeriesInfoText />
						</div>
					</div>
				</div>

				<div className={styles.partNumberHeaderArea}>
					<ActionsPanel
						seriesCode={seriesCode}
						alterationSpecEnabled={false}
						similarSearchEnabled={false}
					>
						<PartNumberInputHeader
							seriesCode={seriesCode}
							partNumber={partNumber}
						/>
					</ActionsPanel>
				</div>

				<DetailTabs ignoreTabs={ignoreTabs} />
				<ProductNotice showsPartNumberNoticeText={false} />
				<RelatedToProductContents seriesCode={seriesCode} faqRef={faqRef} />
			</div>
		</>
	);
};
Wysiwyg.displayName = 'Wysiwyg';
