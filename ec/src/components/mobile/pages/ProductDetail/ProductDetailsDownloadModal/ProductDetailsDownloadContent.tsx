import { Canceler } from 'axios';
import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductDetailsDownloadCadenas } from './ProductDetailsDownloadCadenas';
import { useProductDetailsDownloadContent } from './ProductDetailsDownloadContent.hooks';
import styles from './ProductDetailsDownloadContent.module.scss';
import { Button } from '@/components/mobile/ui/buttons';
import { BlockLoader } from '@/components/mobile/ui/loaders';
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
				<Button size="max" onClick={() => close?.()}>
					{t(
						'mobile.pages.productDetail.productDetailsDownloadModal.closeButton'
					)}
				</Button>
			</div>
		);
	}

	if (priceCheckError) {
		return (
			<div className={styles.modalContent}>
				<div className={styles.errorMessage}>{priceCheckError}</div>
				<div className={styles.buttonWrapper}>
					<Button onClick={onClearPriceCheckError} size="max" theme="strong">
						{t(
							'mobile.pages.productDetail.productDetailsDownloadModal.quantityAlertModal.ok'
						)}
					</Button>
				</div>
			</div>
		);
	}

	if (cadData == null || cadData.cadSiteType !== CadSiteType.CADENAS) {
		return null;
	}

	return (
		<div className={styles.modalContent}>
			<ProductDetailsDownloadCadenas
				cadData={cadData}
				cancelerRefs={cancelerRefs}
				onCadDownloadCompleted={onCadDownloadCompleted}
				onClose={close}
			/>
		</div>
	);
};
ProductDetailsDownloadContent.displayName = 'ProductDetailsDownloadContent';
