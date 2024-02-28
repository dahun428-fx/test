import { Meta } from './Meta';
import styles from './PU.module.scss';
import { Breadcrumbs } from '@/components/pc/pages/ProductDetail/Breadcrumbs';
import { PageHeading } from '@/components/pc/pages/ProductDetail/PageHeading';
import { ProductImagePanel } from '@/components/pc/pages/ProductDetail/ProductImagePanel';
import { ProductAttributes } from '@/components/pc/pages/ProductDetail/ProductAttributes';
import { ProductDocuments } from '@/components/pc/pages/ProductDetail/ProductDocuments';
import { DivisionBannerBox } from '@/components/pc/pages/ProductDetail/DivisionBannerBox';
import { ActionsPanel } from '@/components/pc/pages/ProductDetail/ActionsPanel';
import { PartNumberHeader } from '@/components/pc/pages/ProductDetail/templates/PU/PartNumberHeader';
import { useMemo, useRef } from 'react';
import { SpecFilter } from './SpecFilter';
import { ProductDetailTabPanel } from './ProductDetailTabPanel';
import {
	useScrollToHash,
	useTrackPageView,
} from '@/components/pc/pages/ProductDetail/ProductDetail.hooks';
import { tabIds } from '@/models/domain/series/tab';
import { ProductDetailTabContents } from './ProductDetailTabPanel/ProductDetailTabContents';
import { PartNumberSpecList } from './PartNumberSpecList';
import { ProductNotice } from '@/components/pc/pages/ProductDetail/ProductNotice';
import { RelatedToProductContents } from '@/components/pc/pages/ProductDetail/RelatedToProductContents';
import { TechnicalContact } from '@/components/pc/ui/contact';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';
import { SocialShare } from '../../SocialShare';

export type Props = {
	seriesCode: string;
	partNumber?: string;
	tab?: string;
};

export const PU: React.VFC<Props> = ({ seriesCode, tab: rawTab }) => {
	const series = useSelector(selectSeries);
	const faqRef = useRef<HTMLDivElement>(null);
	const productSpecRef = useRef<HTMLDivElement>(null);
	const tabId = useMemo(() => {
		if (rawTab && rawTab !== 'codeList') {
			return tabIds.find(tabId => tabId === rawTab);
		} else {
			return undefined;
		}
	}, [rawTab]);

	useScrollToHash();
	useTrackPageView('pu');

	return (
		<>
			<Meta />
			<div className={styles.main}>
				<section className={styles.templateHeader}>
					<section className={styles.header}>
						<Breadcrumbs />
						<TechnicalContact
							categoryCode={series.categoryList[0]?.categoryCode}
							seriesCode={seriesCode}
						/>
					</section>
				</section>
				<PageHeading className={styles.heading} />
				<section className={styles.introduction}>
					<ProductImagePanel />
					<ProductAttributes
						className={styles.attributes}
						faqRef={faqRef}
						basicInfoType="full"
					/>
					<div className={styles.extraColumn}>
						<SocialShare series={series} />
						<ProductDocuments linkTitle={'catalog'} />
						{/* incadlibrary */}
						<DivisionBannerBox />
					</div>
				</section>
				<div>
					<section className={styles.actionsPanelContainer}>
						<ActionsPanel seriesCode={seriesCode} similarSearchEnabled>
							<PartNumberHeader showsAllSpec seriesCode={seriesCode} />
						</ActionsPanel>
					</section>
				</div>
				<section>
					<div className={styles.specContainer} id="productContents">
						<SpecFilter seriesCode={seriesCode} className={styles.filter} />
						<ProductDetailTabPanel
							tabId={tabId}
							productSpecRef={productSpecRef}
						>
							<ProductDetailTabContents tabId={tabId} />
							<PartNumberSpecList />
							{/* <RecommendedProducts /> */}
						</ProductDetailTabPanel>
					</div>
				</section>
				<section>
					<ProductNotice showsPartNumberNoticeText={false} />
				</section>
				<RelatedToProductContents seriesCode={seriesCode} faqRef={faqRef} />
			</div>
		</>
	);
};

PU.displayName = 'PU';
