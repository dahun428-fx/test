import { Canceler } from 'axios';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductDetailsDownloadSinus } from './ProductDetailsDownloadSinus.hooks';
import styles from './ProductDetailsDownloadSinus.module.scss';
import { ProductDetailsDownloadSinusError } from './ProductDetailsDownloadSinusError';
import { Button } from '@/components/pc/ui/buttons';
import { Option } from '@/components/pc/ui/controls/select/Select';
import { SelectWithLabel } from '@/components/pc/ui/controls/select/SelectWithLabel';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';

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

	const handleSelectCadFormat = (option: Option) => {
		setSelectedCadOption(option);
	};

	return (
		<div>
			{error ? (
				<ProductDetailsDownloadSinusError error={error} />
			) : (
				<SelectWithLabel
					label={t(
						'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.fileFormatLabel'
					)}
					groupOrder={formatInfo.groups}
					items={formatInfo.cadOptions}
					value={selected.format}
					className={styles.selectWrapper}
					onChange={handleSelectCadFormat}
				/>
			)}
			{loading && (
				<div>
					<h4 className={styles.loadingTitle}>
						{t(
							'pages.productDetail.productDetailsDownloadModal.productDetailsDownloadSinus.loadingTitle'
						)}
					</h4>
					<BlockLoader />
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
