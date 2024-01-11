import classNames from 'classnames';
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCadDownload } from './CadDownload.hooks';
import styles from './CadDownload.module.scss';
import { CadDownloadData } from './CadDownloadData/CadDownloadData';
import { CadDownloadPolicy } from './CadDownloadPolicy';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { Flag } from '@/models/api/Flag';

export type DropdownPosition = 'top' | 'bottom';

type Props = {
	seriesCode: string;
	completeFlag?: Flag;
	partNumber: string;
	cadId?: string;
	moldExpressType?: string;
	brandCode: string;
	brandName: string;
	seriesName: string;
	seriesImage?: string;
	position: DropdownPosition;
	onAuthenticating: (status: boolean) => void;
	onCancelLogin: () => void;
	onClose: ()=> void;
};

/** Cad download */
export const CadDownload: FC<Props> = ({
	seriesCode,
	partNumber,
	cadId,
	completeFlag,
	moldExpressType,
	brandCode,
	brandName,
	seriesName,
	seriesImage,
	position,
	onAuthenticating,
	onCancelLogin,
	onClose,
}) => {
	const {
		loadingTermsOfUse,
		isShowTermsOfUseMSM,
		isShowTermsOfUseWeb2Cad,
		step,
		isShowCadDataIsNotAvailable,
		authLoading,
		agreeTermsOfUse,
	} = useCadDownload({ seriesCode, partNumber, cadId, onCancelLogin });
	const [t] = useTranslation();

	useEffect(() => {
		onAuthenticating(authLoading);
	}, [authLoading, onAuthenticating]);

	const content = useMemo(() => {
		// Loading
		if (authLoading || loadingTermsOfUse) {
			return (
				<div className={styles.loader}>
					<BlockLoader />
				</div>
			);
		}

		// CadDownload is not available
		if (isShowCadDataIsNotAvailable) {
			return (
				<span className={styles.alert}>
					{t('components.domain.cadDownload.cadDataIsNotAvailable')}
				</span>
			);
		}

		// Show terms of use
		if (step === 'termsOfUse') {
			return (
				<CadDownloadPolicy
					onAgree={agreeTermsOfUse}
					isShowTermsOfUseMSM={isShowTermsOfUseMSM}
					isShowTermsOfUseWeb2Cad={isShowTermsOfUseWeb2Cad}
				/>
			);
		}

		// Show CAD data
		if (step === 'cadDownload') {
			return (
				<CadDownloadData
					seriesCode={seriesCode}
					partNumber={partNumber}
					cadId={cadId}
					completeFlag={completeFlag}
					moldExpressType={moldExpressType}
					brandCode={brandCode}
					brandName={brandName}
					seriesName={seriesName}
					seriesImage={seriesImage}
					onClose={onClose}
				/>
			);
		}

		return null;
	}, [
		agreeTermsOfUse,
		authLoading,
		brandCode,
		brandName,
		cadId,
		completeFlag,
		isShowCadDataIsNotAvailable,
		isShowTermsOfUseMSM,
		isShowTermsOfUseWeb2Cad,
		loadingTermsOfUse,
		moldExpressType,
		partNumber,
		seriesCode,
		seriesImage,
		seriesName,
		step,
		t,
	]);

	return (
		<div
			className={classNames(styles.container, {
				[String(styles.top)]: position === 'top',
				[String(styles.bottom)]: position === 'bottom',
			})}
		>
			<div className={styles.content}>{content}</div>
		</div>
	);
};

CadDownload.displayName = 'CadDownload';
