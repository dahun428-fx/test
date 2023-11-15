import { useTranslation } from 'react-i18next';
import { useCadDownloadDataWeb2Cad } from './CadDownloadDataWeb2Cad.hooks';
import styles from './CadDownloadDataWeb2Cad.module.scss';
import { Button } from '@/components/mobile/ui/buttons';
import { Flag } from '@/models/api/Flag';
import { DynamicParams } from '@/models/domain/cad';

type Props = {
	completeFlag?: Flag;
	cadDynamic: DynamicParams[] | null;
	partNumber: string;
};

/** CAD Download Data Web2Cad */
export const CadDownloadDataWeb2Cad: React.VFC<Props> = ({
	completeFlag,
	cadDynamic,
	partNumber,
}) => {
	const [t] = useTranslation();

	const { onDownloadCad } = useCadDownloadDataWeb2Cad();

	return (
		<div>
			<h3 className={styles.title}>
				{t(
					'mobile.pages.productDetail.cadDownload.cadDownloadDataWeb2Cad.title'
				)}
			</h3>

			{Flag.isFalse(completeFlag) && (
				<div className={styles.guide}>
					<p>
						{t(
							'mobile.pages.productDetail.cadDownload.cadDownloadDataWeb2Cad.notice'
						)}
					</p>
					<p>
						{t(
							'mobile.pages.productDetail.cadDownload.cadDownloadDataWeb2Cad.guide'
						)}
					</p>
				</div>
			)}

			<div className={styles.buttonWrapper}>
				<Button
					icon="download"
					theme="strong"
					onClick={() => onDownloadCad(cadDynamic, partNumber, completeFlag)}
				>
					{t(
						'mobile.pages.productDetail.cadDownload.cadDownloadDataWeb2Cad.download'
					)}
				</Button>
			</div>

			<p className={styles.errorMessage}>
				{t(
					'mobile.pages.productDetail.cadDownload.cadDownloadDataWeb2Cad.alert'
				)}
			</p>
		</div>
	);
};
CadDownloadDataWeb2Cad.displayName = 'CadDownloadDataWeb2Cad';
