import classNames from 'classnames';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CadDownLoadButton.module.scss';
import {
	CadDownload,
	DropdownPosition,
} from '@/components/pc/domain/CadDownload';
import { Button } from '@/components/pc/ui/buttons';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { CadDownloadButtonType } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { useStackBalloon } from '@/components/pc/layouts/footers/StackBalloon/StackBalloon.hooks';

type Props = {
	seriesCode: string;
	partNumber: string;
	cadId?: string;
	cadDownloadButtonType: CadDownloadButtonType;
	dropdownPosition: DropdownPosition;
	completeFlag?: Flag;
	brandCode: string;
	moldExpressType?: string;
	brandName: string;
	seriesName: string;
	seriesImage?: string;
	className?: string;
};

/** CAD download button */
export const CadDownLoadButton: React.VFC<Props> = ({
	seriesCode,
	partNumber,
	cadId,
	cadDownloadButtonType,
	completeFlag,
	brandCode,
	moldExpressType,
	brandName,
	seriesName,
	seriesImage,
	dropdownPosition,
	className,
}) => {
	const { t } = useTranslation();
	const [isShowCadDownload, setIsShowCadDownload] = useState(false);
	const [authenticating, setAuthenticating] = useState(false);
	const ref = useRef(null);

	const { setShowsStatus } = useStackBalloon();

	const handleOnClick = () => {
		if (cadDownloadButtonType === CadDownloadButtonType.PRE_ON) {
			return;
		}

		if (!isShowCadDownload) {
			ectLogger.cad.open({
				tabName: Flag.isTrue(completeFlag) ? '4f' : '4u',
				seriesCode,
				brandCode,
			});
		}
		setShowsStatus(false);
		setIsShowCadDownload(prev => !prev);
	};

	useOuterClick(
		ref,
		useCallback(() => {
			if (!authenticating) {
				setIsShowCadDownload(false);
			}
		}, [authenticating])
	);

	const handleOnCloseModal = () => {
		console.log('handleOnCloseModal');
		setIsShowCadDownload(false);
	};

	return (
		<div className={classNames(styles.container, className)} ref={ref}>
			<Button
				icon="download"
				className={styles.button}
				onClick={handleOnClick}
				disabled={cadDownloadButtonType === CadDownloadButtonType.PRE_ON}
			>
				{cadDownloadButtonType === CadDownloadButtonType.ON
					? t('components.domain.cadDownload.cadDownloadButtonOn')
					: cadDownloadButtonType === CadDownloadButtonType.PRE_ON
					? t('components.domain.cadDownload.cadDownloadButtonOnPre')
					: null}
			</Button>
			{isShowCadDownload && (
				<CadDownload
					seriesCode={seriesCode}
					moldExpressType={moldExpressType}
					partNumber={partNumber}
					cadId={cadId}
					completeFlag={completeFlag}
					brandCode={brandCode}
					brandName={brandName}
					seriesName={seriesName}
					seriesImage={seriesImage}
					position={dropdownPosition}
					onAuthenticating={setAuthenticating}
					onCancelLogin={() => setIsShowCadDownload(false)}
					onClose={handleOnCloseModal}
				/>
			)}
		</div>
	);
};
CadDownLoadButton.displayName = 'CadDownLoadButton';
