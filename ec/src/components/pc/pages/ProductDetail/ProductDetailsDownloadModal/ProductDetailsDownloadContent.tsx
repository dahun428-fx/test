import { Canceler } from 'axios';
import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductDetailsDownloadContent } from './ProductDetailsDownloadContent.hooks';
import styles from './ProductDetailsDownloadContent.module.scss';
import { ProductDetailsDownloadSinus } from './ProductDetailsDownloadSinus';
import { ProductDetailsDownloadCadenas } from '@/components/pc/pages/ProductDetail/ProductDetailsDownloadModal/ProductDetailsDownloadCadenas';
import { Button } from '@/components/pc/ui/buttons';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { CadSiteType } from '@/models/domain/cad';

export type DownloadProductDetailResult = {
	type: 'UNAUTHENTICATED';
};

type Props = {
	close?: (result?: DownloadProductDetailResult) => void;
	cancelerRefs: React.MutableRefObject<Canceler[] | undefined>;
};

/** Product details download content */
export const ProductDetailsDownloadContent: VFC<Props> = ({
	close,
	cancelerRefs,
}) => {
	const {
		loading,
		cadData,
		priceCheckError,
		onCadDownloadCompleted,
		onClearPriceCheckError,
	} = useProductDetailsDownloadContent(cancelerRefs, close);

	const { t } = useTranslation();

	if (loading) {
		return (
			<div className={styles.modalContent}>
				<BlockLoader />
			</div>
		);
	}

	if (priceCheckError) {
		return (
			<div className={styles.modalContent}>
				<div className={styles.error}>{priceCheckError}</div>
				<div className={styles.buttonWrapper}>
					<Button onClick={onClearPriceCheckError} size="s" theme="strong">
						{t(
							'pages.productDetail.productDetailsDownloadModal.quantityAlertModal.ok'
						)}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.modalContent}>
			{cadData?.cadSiteType === CadSiteType.SINUS && (
				<ProductDetailsDownloadSinus
					cadData={cadData}
					cancelerRefs={cancelerRefs}
					onCadDownloadCompleted={onCadDownloadCompleted}
				/>
			)}

			{cadData?.cadSiteType === CadSiteType.CADENAS && (
				<ProductDetailsDownloadCadenas
					cadData={cadData}
					cancelerRefs={cancelerRefs}
					onCadDownloadCompleted={onCadDownloadCompleted}
				/>
			)}
		</div>
	);
};
ProductDetailsDownloadContent.displayName = 'ProductDetailsDownloadContent';
