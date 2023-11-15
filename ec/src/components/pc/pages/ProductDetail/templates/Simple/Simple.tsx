import React, {
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import Sticky from 'react-stickynode';
import { Meta } from './Meta';
import { ProductDetailTabPanel } from './ProductDetailTabPanel';
import { ProductDetailTabContents } from './ProductDetailTabPanel/ProductDetailTabContents';
import styles from './Simple.module.scss';
import { SpecFilter } from './SpecFilter';
import { ActionsPanel } from '@/components/pc/pages/ProductDetail/ActionsPanel';
import { BasicInformation } from '@/components/pc/pages/ProductDetail/BasicInformation';
import { BrandCategory } from '@/components/pc/pages/ProductDetail/BrandCategory';
import { Breadcrumbs } from '@/components/pc/pages/ProductDetail/Breadcrumbs';
import { EconomyLabel } from '@/components/pc/pages/ProductDetail/EconomyLabel';
import { PageHeading } from '@/components/pc/pages/ProductDetail/PageHeading';
import { PartNumberHeader } from '@/components/pc/pages/ProductDetail/PartNumberHeader';
import { PartNumberList } from '@/components/pc/pages/ProductDetail/PartNumberList';
import { PartNumberSpecList } from '@/components/pc/pages/ProductDetail/PartNumberSpecList';
import { ProductAttributes } from '@/components/pc/pages/ProductDetail/ProductAttributes';
import { useTrackPageView } from '@/components/pc/pages/ProductDetail/ProductDetail.hooks';
import { ProductDocuments } from '@/components/pc/pages/ProductDetail/ProductDocuments';
import { ProductImagePanel } from '@/components/pc/pages/ProductDetail/ProductImagePanel';
import { ProductNotice } from '@/components/pc/pages/ProductDetail/ProductNotice';
import { RelatedToProductContents } from '@/components/pc/pages/ProductDetail/RelatedToProductContents';
import { SeriesDiscount } from '@/components/pc/pages/ProductDetail/SeriesDiscount';
import { SeriesInfoText } from '@/components/pc/pages/ProductDetail/SeriesInfoText';
import { StandardSpecList } from '@/components/pc/pages/ProductDetail/StandardSpecList';
import { tabIds } from '@/models/domain/series/tab';

export type Props = {
	seriesCode: string;
	partNumber?: string;
	tab?: string;
};

/**
 * Product detail Simple Template
 */
export const Simple: React.VFC<Props> = ({ seriesCode, tab: rawTab }) => {
	const faqRef = useRef<HTMLDivElement>(null);
	const productSpecRef = useRef<HTMLDivElement>(null);
	const specFilterRef = useRef<HTMLDivElement>(null);
	const [enableSticky, setEnableSticky] = useState(false);
	const tabId = useMemo(() => {
		if (rawTab && rawTab !== 'codeList') {
			return tabIds.find(tabId => tabId === rawTab);
		} else {
			return undefined;
		}
	}, [rawTab]);

	useTrackPageView();

	// NOTE: Make part number spec list sticky to avoid layout shift when user toggles specs.
	// Refer to NEW_FE-3106
	const handleScroll = useCallback(() => {
		if (!specFilterRef.current) {
			return;
		}
		setEnableSticky(specFilterRef.current.offsetTop < window.scrollY);
	}, []);

	useLayoutEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	return (
		<>
			<Meta />
			<div className={styles.main}>
				<Breadcrumbs />
				<div className={styles.introduction}>
					<div>
						<ProductImagePanel />
						<ProductDocuments />
					</div>
					<div className={styles.attributesColumn}>
						<div className={styles.brandWrap}>
							<BrandCategory />
							<EconomyLabel className={styles.economy} />
							<SeriesDiscount />
						</div>
						<PageHeading className={styles.heading} />
						<ProductAttributes faqRef={faqRef} className={styles.attributes} />
						<StandardSpecList />
						<SeriesInfoText />
					</div>
				</div>
				<div>
					<div className={styles.actionsPanelContainer}>
						<ActionsPanel seriesCode={seriesCode} similarSearchEnabled>
							<PartNumberHeader showsAllSpec seriesCode={seriesCode} />
						</ActionsPanel>
					</div>
					<div className={styles.specContainer} id="productContents">
						<ProductDetailTabPanel
							tabId={tabId}
							productSpecRef={productSpecRef}
						>
							<ProductDetailTabContents tabId={tabId} />
						</ProductDetailTabPanel>
						<div className={styles.productSpecs} ref={productSpecRef}>
							<Sticky
								enabled={enableSticky}
								activeClass={styles.activeConfigureTable}
							>
								<PartNumberSpecList />
							</Sticky>
							<div ref={specFilterRef}>
								<SpecFilter seriesCode={seriesCode} className={styles.filter} />
							</div>
						</div>
					</div>
				</div>
				<div className={styles.partNumberList}>
					<PartNumberList showsAllSpec seriesCode={seriesCode} />
				</div>
				<BasicInformation />
				<div>
					<ProductNotice />
				</div>
				<RelatedToProductContents seriesCode={seriesCode} faqRef={faqRef} />
			</div>
		</>
	);
};
Simple.displayName = 'Simple';
