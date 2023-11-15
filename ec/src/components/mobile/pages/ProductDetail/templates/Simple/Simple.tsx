import React from 'react';
import { Meta } from './Meta';
import { PartNumberBar } from './PartNumberBar';
import { PriceCheckResult } from './PriceCheckResult';
import { useAutoCheckPrice, useTrackPageView } from './Simple.hook';
import styles from './Simple.module.scss';
import { SpecPanel } from './SpecPanel';
import { StandardSpecList } from './StandardSpecList';
import { ActionsPanel } from '@/components/mobile/pages/ProductDetail/ActionsPanel';
import { Breadcrumbs } from '@/components/mobile/pages/ProductDetail/Breadcrumbs';
import { CatalogButton } from '@/components/mobile/pages/ProductDetail/CatalogButton';
import { PartNumberList } from '@/components/mobile/pages/ProductDetail/PartNumberList';
import { ProductDescription } from '@/components/mobile/pages/ProductDetail/ProductDescription';
import { ProductHtml } from '@/components/mobile/pages/ProductDetail/ProductHtml';
import { RelatedToProductContents } from '@/components/mobile/pages/ProductDetail/RelatedToProductContents';
import { Sds } from '@/components/mobile/pages/ProductDetail/Sds';
import { ToolBar } from '@/components/mobile/pages/ProductDetail/ToolBar';
import { ProductActions } from '@/components/mobile/pages/ProductDetail/templates/Simple/ProductActions';
import { Portal } from '@/components/mobile/ui/portal';

export type Props = {
	//
};

/**
 * Simple Product Template
 */
export const Simple: React.VFC = () => {
	useAutoCheckPrice();
	useTrackPageView();

	return (
		<>
			<Meta />
			<div>
				<Breadcrumbs />
				<div>
					<PartNumberBar />
					<PriceCheckResult />
					<SpecPanel />
					<ProductActions />
					<StandardSpecList />
					<ProductDescription />
					<PartNumberList />
					<ProductHtml />
					<CatalogButton className={styles.productSection} />
					<Sds />
				</div>
				<RelatedToProductContents />
				<Portal id="fixedContents">
					<ActionsPanel />
					<ToolBar />
				</Portal>
			</div>
		</>
	);
};
Simple.displayName = 'Simple';
