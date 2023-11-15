import { VFC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './ProductDetailsDownloadCadenasError.module.scss';

export type Error =
	| 'not-resolve-error'
	| 'no-mident-error'
	| 'download-timeout-error'
	| 'cadenas-api-error';

type Props = {
	error: Error;
	onClickCadConfigure: (event: React.MouseEvent) => void;
};

/** Product Details Download Cadenas Error component */
export const ProductDetailsDownloadCadenasError: VFC<Props> = ({
	error,
	onClickCadConfigure,
}) => {
	const [t] = useTranslation();

	switch (error) {
		case 'not-resolve-error':
			return (
				<>
					<p>
						<strong>
							{t(
								'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadCadenas.error.notResolved.noZipFile'
							)}
						</strong>
					</p>
					<p>
						<strong>
							{t(
								'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadCadenas.error.notResolved.alternativeLink'
							)}
						</strong>
					</p>
					<p>
						<a href="#" onClick={onClickCadConfigure}>
							{t(
								'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadCadenas.error.notResolved.cadConfigurator'
							)}
						</a>
					</p>
				</>
			);
		case 'cadenas-api-error':
		case 'download-timeout-error':
		case 'no-mident-error':
			return (
				<>
					<p className={styles.noMidentErrorTitle}>
						<strong>
							{t(
								'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadCadenas.error.noCadData.title'
							)}
						</strong>
					</p>
					<p>
						<Trans i18nKey="pages.productDetail.productDetailsDownloadModal.productDetailsDownloadCadenas.error.noCadData.message">
							<a
								className={styles.link}
								href="#"
								onClick={onClickCadConfigure}
							/>
						</Trans>
					</p>
				</>
			);
	}
};
ProductDetailsDownloadCadenasError.displayName =
	'ProductDetailsDownloadCadenasError';
