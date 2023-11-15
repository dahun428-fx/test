import { useTranslation } from 'react-i18next';
import { useCadDownloadDataWeb2Cad } from './CadDownloadDataWeb2Cad.hooks';
import styles from './CadDownloadDataWeb2Cad.module.scss';
import { Button } from '@/components/pc/ui/buttons';
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
				{t('components.domain.cadDownload.cadDownloadDataWeb2Cad.title')}
			</h3>

			{Flag.isFalse(completeFlag) && (
				<div className={styles.guide}>
					<p>
						{t('components.domain.cadDownload.cadDownloadDataWeb2Cad.notice')}
					</p>
					<p>
						{t('components.domain.cadDownload.cadDownloadDataWeb2Cad.guide')}
					</p>
				</div>
			)}

			{cadDynamic != null && cadDynamic.length !== 0 && (
				<div className={styles.buttonWrapper}>
					<Button
						icon="download"
						onClick={() => onDownloadCad(cadDynamic, partNumber, completeFlag)}
					>
						{t('components.domain.cadDownload.cadDownloadDataWeb2Cad.download')}
					</Button>
				</div>
			)}

			<p className={styles.errorMessage}>
				{t('components.domain.cadDownload.cadDownloadDataWeb2Cad.alert')}
			</p>
		</div>
	);
};
CadDownloadDataWeb2Cad.displayName = 'CadDownloadDataWeb2Cad';
