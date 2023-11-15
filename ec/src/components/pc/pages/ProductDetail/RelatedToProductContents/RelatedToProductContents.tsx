import React, { RefObject } from 'react';
import { InterestRecommend } from './InterestRecommend';
import { RelatedPartNumberList } from './RelatedPartNumberList';
import { useSeries } from './RelatedToProductContents.hooks';
import styles from './RelatedToProductContents.module.scss';
import { TechSupport } from './TechSupport';
import { EmphasizedRecommend } from '@/components/pc/domain/category/CameleerContents/EmphasizedRecommend';
import { Faq } from '@/components/pc/pages/ProductDetail/Faq';

type Props = {
	seriesCode: string;
	faqRef: RefObject<HTMLDivElement>;
};

/**
 * Related product introduction contents
 */
export const RelatedToProductContents: React.VFC<Props> = ({
	seriesCode,
	faqRef,
}) => {
	const series = useSeries();

	if (!series) {
		return null;
	}
	return (
		<div>
			<RelatedPartNumberList
				seriesCode={series.seriesCode}
				relatedLinkFrameFlag={series.relatedLinkFrameFlag}
				rohsFrameFlag={series.rohsFrameFlag}
			/>

			<Faq faqRef={faqRef} />

			<InterestRecommend seriesCode={seriesCode} />

			<EmphasizedRecommend recommendCode="c24-allusers" dispPage="detail" />

			<div className={styles.techSupport}>
				<TechSupport seriesCode={seriesCode} contact={series.contact} />
			</div>
		</div>
	);
};
RelatedToProductContents.displayName = 'RelatedToProductContents';
