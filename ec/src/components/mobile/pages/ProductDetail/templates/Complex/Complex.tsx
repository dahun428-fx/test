import React, { useMemo, useRef } from 'react';
import styles from './Complex.module.scss';
import { Meta } from './Meta';
import { PartNumberBar } from './PartNumberBar';
import { PartNumberListPanel } from './PartNumberListPanel';
import { SpecPanel } from './SpecPanel';
import { ActionsPanel } from '@/components/mobile/pages/ProductDetail/ActionsPanel';
import { Breadcrumbs } from '@/components/mobile/pages/ProductDetail/Breadcrumbs';
import { ConfiguredSpecifications } from '@/components/mobile/pages/ProductDetail/ConfiguredSpecifications';
import { PriceCheckResult } from '@/components/mobile/pages/ProductDetail/PriceCheckResult';
import { ProductActions } from '@/components/mobile/pages/ProductDetail/ProductActions';
import { ProductDescription } from '@/components/mobile/pages/ProductDetail/ProductDescription';
import { ProductDetailTabContents } from '@/components/mobile/pages/ProductDetail/ProductDetailTabContents';
import { Tab } from '@/components/mobile/pages/ProductDetail/ProductDetailTabContents/Tabs';
import { ProductHtml } from '@/components/mobile/pages/ProductDetail/ProductHtml';
import { RelatedToProductContents } from '@/components/mobile/pages/ProductDetail/RelatedToProductContents';
import { StandardSpecList } from '@/components/mobile/pages/ProductDetail/StandardSpecList';
import { ToolBar } from '@/components/mobile/pages/ProductDetail/ToolBar';
import {
	useAutoCheckPrice,
	useTrackPageView,
} from '@/components/mobile/pages/ProductDetail/templates/Complex/Complex.hooks';
import { Portal } from '@/components/mobile/ui/portal';
import { useSelector } from '@/store/hooks';
import { selectCurrentPartNumberTotalCount } from '@/store/modules/pages/productDetail';

// TODO: 要らなければ消す
export type Props = {
	seriesCode: string;
	partNumber?: string;
	tab?: string;
};

export const Complex: React.VFC<Props> = ({ tab }) => {
	const partNumberTotalCount = useSelector(selectCurrentPartNumberTotalCount);
	const tabList: Tab[] = useMemo(
		() => [{ tabId: 'codeList' }, { tabId: 'catalog' }],
		[]
	);

	const partNumberBarRef = useRef<HTMLDivElement>(null);

	useAutoCheckPrice();
	useTrackPageView();

	return (
		<>
			<Meta />
			<div>
				{/* NOTE: Displayed in footer using Portal */}
				<Breadcrumbs />

				<PartNumberBar partNumberBarRef={partNumberBarRef} />
				<SpecPanel partNumberBarRef={partNumberBarRef} />
				<PartNumberListPanel />
				<ProductActions />
				<PriceCheckResult className={styles.priceCheckResult} />
				{partNumberTotalCount !== 1 && <StandardSpecList />}
				{/* TODO: PartNumberSpecList に改名 */}
				<ConfiguredSpecifications className={styles.configuredSpecifications} />
				<ProductDescription />
				<div className={styles.tabContainer}>
					<ProductDetailTabContents tabList={tabList} tab={tab} />
				</div>
				<ProductHtml />
			</div>
			<RelatedToProductContents />
			<Portal id="fixedContents">
				<ActionsPanel />
				<ToolBar />
			</Portal>
		</>
	);
};
Complex.displayName = 'Complex';
