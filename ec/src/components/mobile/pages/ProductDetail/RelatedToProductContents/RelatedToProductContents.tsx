import React from 'react';
import { Faq } from './Faq';
import { InterestRecommend } from './InterestRecommend';
import { PurchaseRecommend } from './PurchaseRecommend';
import { RelatedPartNumberList } from './RelatedPartNumberList';
import { useSeries } from './RelatedToProductContents.hook';
import styles from './RelatedToProductContents.module.scss';
import { TechSupport } from './TechSupport';

/**
 * Related product introduction contents, etc.
 */
export const RelatedToProductContents: React.VFC = () => {
	const series = useSeries();

	if (!series) {
		return null;
	}

	return (
		<div className={styles.container}>
			{/* FrequentlyAskedQuestions */}
			<Faq />

			<RelatedPartNumberList
				seriesCode={series.seriesCode}
				relatedLinkFrameFlag={series.relatedLinkFrameFlag}
				rohsFrameFlag={series.rohsFrameFlag}
			/>

			{/* Recommendations */}
			<InterestRecommend />

			<PurchaseRecommend />

			<TechSupport />
		</div>
	);
};
RelatedToProductContents.displayName = 'RelatedToProductContents';
