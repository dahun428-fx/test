import { Canceler } from 'axios';
import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { CadenasDownloadProgress } from './DownloadProgressCadenas';
import {
	useProductDetailsDownloadCadenas,
	generateIFrameName,
	resolveIFrameName,
} from './ProductDetailsDownloadCadenas.hooks';
import styles from './ProductDetailsDownloadCadenas.module.scss';
import { ProductDetailsDownloadCadenasError } from './ProductDetailsDownloadCadenasError';
import { CadenasFormatSelect } from '@/components/mobile/pages/ProductDetail/CadDownload/CadenasFormatSelect';
import { Button } from '@/components/mobile/ui/buttons';
import { BlockLoader } from '@/components/mobile/ui/loaders';
import { Flag } from '@/models/api/Flag';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack_origin';

type Props = {
	cadData: DownloadCadResponse;
	completeFlag?: Flag;
	cancelerRefs: React.MutableRefObject<Canceler[] | undefined>;
	onCadDownloadCompleted: (
		cadDownloadUrl?: string,
		selectedCadDataFormat?: SelectedCadDataFormat
	) => void;
	onClose?: () => void;
};

/** Product details download cadenas component */
export const ProductDetailsDownloadCadenas: VFC<Props> = ({
	cadData,
	cancelerRefs,
	onCadDownloadCompleted,
	onClose,
}) => {
	const [t] = useTranslation();

	const {
		resolveRef,
		generateRef,
		loading,
		error,
		loadingResolve,
		handleSelect,
		handleDownloadCad,
		handleLoadResolve,
		handleLoadGenerate,
		handleClickCadConfigure,
	} = useProductDetailsDownloadCadenas({
		cadData,
		cancelerRefs,
		onCadDownloadCompleted,
	});

	const cadGenerationTime =
		cadData.dynamic3DCadList[0]?.parameterMap.cadGenerationTime ?? '';

	return (
		<div>
			{loadingResolve && (
				<div>
					<BlockLoader />
					<Button size="max" onClick={onClose}>
						{t(
							'mobile.pages.productDetail.productDetailsDownloadModal.closeButton'
						)}
					</Button>
				</div>
			)}

			{error ? (
				<ProductDetailsDownloadCadenasError
					error={error}
					onClickCadConfigure={handleClickCadConfigure}
				/>
			) : (
				!loadingResolve && (
					<>
						<CadenasFormatSelect cadData={cadData} onChange={handleSelect} />
						{loading && (
							<div>
								<h4 className={styles.loadingTitle}>
									{t(
										'mobile.pages.productDetail.productDetailsDownloadModal.productDetailsDownloadCadenas.loading.title'
									)}
								</h4>
								<p className={styles.loadingMessage}>
									{t(
										'mobile.pages.productDetail.productDetailsDownloadModal.productDetailsDownloadCadenas.loading.message',
										{ estimatedTime: cadGenerationTime }
									)}
								</p>
								<div className={styles.progressWrapper}>
									<CadenasDownloadProgress
										initialProgress={1}
										stringTime={cadGenerationTime}
									/>
								</div>
							</div>
						)}
					</>
				)
			)}

			{!loadingResolve && (
				<ul className={styles.buttonWrapper}>
					<li>
						<Button
							onClick={handleDownloadCad}
							theme="strong"
							size="max"
							icon="right-arrow"
						>
							{t(
								'mobile.pages.productDetail.productDetailsDownloadModal.downloadButton'
							)}
						</Button>
					</li>
					<li>
						<Button size="max" onClick={onClose}>
							{t(
								'mobile.pages.productDetail.productDetailsDownloadModal.closeButton'
							)}
						</Button>
					</li>
				</ul>
			)}

			<iframe
				ref={generateRef}
				name={generateIFrameName}
				className={styles.resolve}
				onLoad={handleLoadGenerate}
				allowFullScreen
			/>
			<iframe
				ref={resolveRef}
				name={resolveIFrameName}
				className={styles.resolve}
				onLoad={handleLoadResolve}
				allowFullScreen
			/>
		</div>
	);
};

ProductDetailsDownloadCadenas.displayName = 'ProductDetailsDownloadCadenas';
