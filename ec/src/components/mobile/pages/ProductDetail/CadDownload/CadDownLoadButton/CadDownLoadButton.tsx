import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCadDownload } from './CadDownLoadButton.hooks';
import styles from './CadDownLoadButton.module.scss';
import {
	CadDownload,
	DropdownPosition,
} from '@/components/mobile/pages/ProductDetail/CadDownload';
import { Button } from '@/components/mobile/ui/buttons';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { CadDownloadButtonType } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';

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
}) => {
	const { t } = useTranslation();
	const [showsCadDownload, setShowsCadDownload] = useState(false);
	const [authenticating, setAuthenticating] = useState(false);
	const ref = useRef(null);

	const { clearDownloadingItemIds, generateCadData, clear, cadDownloadStack } =
		useCadDownload();

	useEffect(() => {
		clearDownloadingItemIds();
		generateCadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cadDownloadStack.items]);

	useOuterClick(
		ref,
		useCallback(
			(event: MouseEvent) => {
				// ダウンロード開始時に何故か isTrusted === false な MouseEvent が飛ぶことがあるため阻止
				// (ダウンロード開始時に吹き出しを消さないという mobile 独自要件)
				if (!authenticating && event.isTrusted) {
					clear();
					setShowsCadDownload(false);
				}
			},
			[authenticating, clear]
		)
	);

	const handleClick = useCallback(() => {
		if (cadDownloadButtonType === CadDownloadButtonType.PRE_ON) {
			return;
		}

		if (!showsCadDownload) {
			ectLogger.cad.open({
				tabName: Flag.isTrue(completeFlag) ? '4f' : '4u',
				seriesCode,
				brandCode,
			});
		} else {
			clear();
		}

		setShowsCadDownload(prev => !prev);
	}, [
		brandCode,
		cadDownloadButtonType,
		clear,
		completeFlag,
		seriesCode,
		showsCadDownload,
	]);

	const handleCancelLogin = useCallback(() => {
		clear();
		setShowsCadDownload(false);
	}, [clear]);

	return (
		<div className={styles.container} ref={ref}>
			<Button
				icon="download"
				theme="strong"
				className={styles.button}
				onClick={handleClick}
				disabled={cadDownloadButtonType === CadDownloadButtonType.PRE_ON}
			>
				{cadDownloadButtonType === CadDownloadButtonType.ON
					? t('components.domain.cadDownload.cadDownloadButtonOn')
					: cadDownloadButtonType === CadDownloadButtonType.PRE_ON
					? t('components.domain.cadDownload.cadDownloadButtonOnPre')
					: null}
			</Button>
			{showsCadDownload && (
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
					onCancelLogin={handleCancelLogin}
				/>
			)}
		</div>
	);
};
CadDownLoadButton.displayName = 'CadDownLoadButton';
