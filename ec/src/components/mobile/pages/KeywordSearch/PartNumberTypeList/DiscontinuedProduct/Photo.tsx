import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Photo.module.scss';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { Label } from '@/components/mobile/ui/labels';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';

type Props = {
	series: Series;
	discontinuedDate?: string;
	alternativeMessage: string | null | JSX.Element[];
};

/** Product viewed in photo mode */
export const Photo: React.VFC<Props> = ({
	series,
	discontinuedDate,
	alternativeMessage,
}) => {
	const [t] = useTranslation();

	return (
		<li className={styles.item}>
			<div className={styles.imageWrapper}>
				<ProductImage
					className={styles.image}
					comment={series.seriesName}
					size={120}
					imageUrl={series.productImageList[0]?.url}
				/>
			</div>

			<div>
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
Photo.displayName = 'Photo';
