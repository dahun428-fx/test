import React, { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './List.module.scss';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { Label } from '@/components/mobile/ui/labels';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';

type Props = {
	series: Series;
	discontinuedDate?: string;
	alternativeMessage: string | null | JSX.Element[];
};

/** Product viewed in list mode */
export const List: VFC<Props> = ({
	series,
	discontinuedDate,
	alternativeMessage,
}) => {
	const [t] = useTranslation();

	return (
		<li className={styles.item}>
			<div className={styles.main}>
				<div className={styles.imageWrapper}>
					<ProductImage
						size={64}
						comment={series.seriesName}
						imageUrl={series.productImageList[0]?.url}
					/>
				</div>

				<div className={styles.info}>
					<Label>
						{t(
							'mobile.pages.keywordSearch.partNumberTypeList.discontinuedProduct.label'
						)}
					</Label>
					<p className={styles.partNumber}>{series.partNumber}</p>
					<p
						className={styles.seriesName}
						dangerouslySetInnerHTML={{ __html: series.seriesName }}
					/>
					<p className={styles.brandName}>{series.brandName}</p>
				</div>
			</div>
			{(discontinuedDate || alternativeMessage) && (
				<div className={styles.notice}>
					<p>
						{discontinuedDate && (
							<>
								{t(
									'mobile.pages.keywordSearch.partNumberTypeList.discontinuedProduct.discontinuedIn',
									{
										date: discontinuedDate,
									}
								)}
								<br />
							</>
						)}
						{alternativeMessage}
					</p>
				</div>
			)}
		</li>
	);
};
List.displayName = 'List';
