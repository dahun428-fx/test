import { Canceler } from 'axios';
import { FC, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useProductDetailsDownloadSinus } from './ProductDetailsDownloadSinus.hooks';
import styles from './ProductDetailsDownloadSinus.module.scss';
import { ProductDetailsDownloadSinusError } from './ProductDetailsDownloadSinusError';
import { Button } from '@/components/pc/ui/buttons';
import { Option } from '@/components/pc/ui/controls/select/Select';
import { SelectWithLabel } from '@/components/pc/ui/controls/select/SelectWithLabel';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
import { CadenasDownloadProgress } from '../ProductDetailsDownloadCadenas/DownloadProgressCadenas';
import { CadenasFormatSelect } from '@/components/pc/domain/CadDownload/CadenasFormatSelect';
import { SelectedOption } from '@/models/domain/cad';

type Props = {
	cadData: DownloadCadResponse;
	cancelerRefs: React.MutableRefObject<Canceler[] | undefined>;
	onCadDownloadCompleted: (
		cadDownloadUrl?: string,
		selectedCadDataFormat?: SelectedCadDataFormat
	) => void;
};

export const ProductDetailsDownloadSinus: FC<Props> = ({
	cadData,
	cancelerRefs,
	onCadDownloadCompleted,
}) => {
	const [t] = useTranslation();

	const {
		selected,
		formatInfo,
		loading,
		error,
		setSelectedCadOption,
		generateDownloadCad,
	} = useProductDetailsDownloadSinus(
		cadData,
		cancelerRefs,
		onCadDownloadCompleted
	);

	const cadGenerationTime =
		cadData.dynamic3DCadList[0]?.parameterMap.cadGenerationTime ?? '5';
	const handleSelectCadFormat = useCallback((option: SelectedOption) => {
		const { label, value, group } = option.format;
		setSelectedCadOption({
			label,
			value,
			group,
		});
	}, []);

	return (
		<div>
			{error ? (
				<ProductDetailsDownloadSinusError error={error} />
			) : (
				<CadenasFormatSelect
					cadData={cadData}
					onChange={handleSelectCadFormat}
					isDetailsDownload={true}
				/>
			)}
			{loading && (
				<div>
					<h4 className={styles.loadingTitle}>
						{t(
							'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.loadingTitle'
						)}
					</h4>
					<Trans
						i18nKey="pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.loadingMessage"
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
			<div className={styles.buttonWrapper}>
				<Button onClick={generateDownloadCad} size="m" icon="download">
					{t('pages.productDetail.productDetailsDownloadModal.downloadButton')}
				</Button>
			</div>
		</div>
	);
};

ProductDetailsDownloadSinus.displayName = 'ProductDetailsDownloadSinus';
