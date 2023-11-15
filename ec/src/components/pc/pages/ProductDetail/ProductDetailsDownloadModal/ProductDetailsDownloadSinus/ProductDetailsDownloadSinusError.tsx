import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductDetailsDownloadSinusError.module.scss';

export type Error = 'browser-error' | 'generate-error' | 'not-resolve-error';

type Props = {
	error: Error;
};

/** Product Details Download Sinus Error component */
export const ProductDetailsDownloadSinusError: FC<Props> = ({ error }) => {
	const [t] = useTranslation();

	switch (error) {
		case 'browser-error':
			return (
				<>
					<p className={styles.sinusBrowserOnlyAlertTitle}>
						{t(
							'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.error.noSupportBrowser.title'
						)}
					</p>
					<ul>
						<li className={styles.sinusBrowserOnlyItem}>
							{t(
								'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.error.noSupportBrowser.messageOne'
							)}
						</li>
						<li className={styles.sinusBrowserOnlyItem}>
							{t(
								'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.error.noSupportBrowser.messageTwo'
							)}
						</li>
					</ul>
				</>
			);
		case 'generate-error':
			return (
				<>
					<p>
						<strong>
							{t(
								'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.error.generatedFailed.messageOne'
							)}
						</strong>
					</p>
					<p>
						<strong>
							{t(
								'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.error.generatedFailed.messageTwo'
							)}
						</strong>
					</p>
				</>
			);
		case 'not-resolve-error':
			return (
				<>
					<p>
						<strong>
							{t(
								'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.error.notResolved.messageOne'
							)}
						</strong>
					</p>
					<p>
						<strong>
							{t(
								'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.error.notResolved.messageTwo'
							)}
						</strong>
					</p>
				</>
			);
	}
};
ProductDetailsDownloadSinusError.displayName =
	'ProductDetailsDownloadSinusError';
