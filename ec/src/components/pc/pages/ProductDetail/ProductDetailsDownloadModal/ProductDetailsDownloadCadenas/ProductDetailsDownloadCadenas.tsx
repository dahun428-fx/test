import { Canceler } from 'axios';
import { VFC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CadenasDownloadProgress } from './DownloadProgressCadenas';
import {
	useProductDetailsDownloadCadenas,
	generateIFrameName,
	resolveIFrameName,
} from './ProductDetailsDownloadCadenas.hooks';
import styles from './ProductDetailsDownloadCadenas.module.scss';
import { ProductDetailsDownloadCadenasError } from './ProductDetailsDownloadCadenasError';
import { CadenasFormatSelect } from '@/components/pc/domain/CadDownload/CadenasFormatSelect';
import { Button } from '@/components/pc/ui/buttons';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { Flag } from '@/models/api/Flag';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';

type Props = {
	cadData: DownloadCadResponse;
	completeFlag?: Flag;
	cancelerRefs: React.MutableRefObject<Canceler[] | undefined>;
	onCadDownloadCompleted: (
		cadDownloadUrl?: string,
		selectedCadDataFormat?: SelectedCadDataFormat
	) => void;
};

/** Product details download cadenas component */
export const ProductDetailsDownloadCadenas: VFC<Props> = ({
	cadData,
	cancelerRefs,
	onCadDownloadCompleted,
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
			{loadingResolve && <BlockLoader />}

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
										'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadCadenas.loadingTitle'
									)}
								</h4>
								<Trans
									i18nKey="pages.productDetail.productDetailsDownloadModal.productDetailsDownloadCadenas.loadingMessage"
									values={{
										estimatedTime: cadGenerationTime,
									}}
								>
									<br />
								</Trans>
								<div className={styles.progressWrapper}>
									<CadenasDownloadProgress
										initialProgress={0}
										stringTime={cadGenerationTime}
									/>
								</div>
							</div>
						)}
					</>
				)
			)}

			{!loadingResolve && (
				<div className={styles.buttonWrapper}>
					<Button onClick={handleDownloadCad} size="m" icon="download">
						{t(
							'pages.productDetail.productDetailsDownloadModal.downloadButton'
						)}
					</Button>
				</div>
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
