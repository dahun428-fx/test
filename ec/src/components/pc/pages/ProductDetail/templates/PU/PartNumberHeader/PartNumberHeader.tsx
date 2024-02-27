import { Flag } from '@/models/api/Flag';
import { CadDownloadButtonType } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { CadDownLoadButton } from '@/components/pc/domain/CadDownload';
import { MisumiOrVona } from '@/utils/domain/log';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './PartNumberHeader.module.scss';
import { PartNumberGuide } from './PartNumberGuide';
import { CadPreviewButton } from './CadPreviewButton';

export type Props = {
	guideCount: number;
	totalCount: number;
	completeFlag: Flag;
	partNumber: string;
	cad3DPreviewFlag: Flag;
	brandCode: string;
	seriesCode: string;
	cadId: string;
	cadDownloadButtonType: CadDownloadButtonType;
	moldExpressType: string;
	brandName: string;
	seriesName: string;
	seriesImage?: string;
	misumiOrVona?: MisumiOrVona;
};

type UnfixedPartNumber = {
	part: string;
	unfixedSpec: boolean;
};

/**
 * Get Unfixed spec part number parts
 * @param partNumber
 * @returns UnfixedPartNumber[]
 */
function unfixedSpecPartNumberParts(partNumber: string): UnfixedPartNumber[] {
	const unfixedSpecPartNumber = [];
	let part = '';
	const partNumberSplit = partNumber.split('');

	for (let i = 0; i < partNumberSplit.length; i++) {
		const value = partNumberSplit[i];

		if (value === '[') {
			unfixedSpecPartNumber.push({ part, unfixedSpec: false });
			part = value;
			continue;
		}

		if (value === ']') {
			part += value;
			unfixedSpecPartNumber.push({ part, unfixedSpec: true });
			part = '';
			continue;
		}

		part += value;
	}

	if (part) {
		unfixedSpecPartNumber.push({ part, unfixedSpec: false });
	}

	return unfixedSpecPartNumber;
}
export const PartNumberHeader: React.VFC<Props> = ({
	completeFlag,
	totalCount,
	guideCount,
	partNumber,
	cad3DPreviewFlag,
	brandCode,
	seriesCode,
	cadId,
	cadDownloadButtonType,
	moldExpressType,
	brandName,
	seriesName,
	seriesImage,
	misumiOrVona,
}) => {
	const isUnfixedSpec = Flag.isFalse(completeFlag) && totalCount === 1;
	const partNumberParts = unfixedSpecPartNumberParts(partNumber ?? '');

	const [isBlinking, setIsBlinking] = useState(false);

	useEffect(() => {
		// 型番確定かつ変わった場合、黄色点滅にする
		if (partNumber && Flag.isTrue(completeFlag)) {
			setIsBlinking(true);

			const timeoutId = setTimeout(() => {
				setIsBlinking(false);
			}, 2000);

			return () => clearTimeout(timeoutId);
		}
	}, [completeFlag, partNumber]);
	return (
		<div
			className={classNames(styles.wrapper, {
				[String(styles.blinkEffect)]: isBlinking,
				[String(styles.nonBoder)]: true,
			})}
		>
			<div className={styles.partNumberHeader}>
				<PartNumberGuide
					{...{
						completeFlag,
						guideCount,
						totalCount,
					}}
				/>

				{partNumber && (
					<>
						{Flag.isTrue(completeFlag) ? (
							<p className={styles.partNumber}>{partNumber}</p>
						) : isUnfixedSpec ? (
							<div className={styles.textWrapper}>
								{partNumberParts.map((partNumberPart, index) => {
									return (
										<div key={index} className={styles.partNumber}>
											{partNumberPart.unfixedSpec ? (
												<span className={styles.unfixed}>
													{partNumberPart.part}
												</span>
											) : (
												<span>{partNumberPart.part}</span>
											)}
										</div>
									);
								})}
							</div>
						) : null}
					</>
				)}
			</div>
			<ul className={styles.buttonGroup}>
				{Flag.isTrue(cad3DPreviewFlag) && (
					<li>
						<CadPreviewButton
							{...{
								disabled: Flag.isFalse(completeFlag),
								brandCode,
								seriesCode,
								partNumber,
								cadId,
								cadDownloadButtonType,
								completeFlag,
								moldExpressType,
								brandName,
								seriesName,
								seriesImage,
								misumiOrVona,
							}}
						/>
					</li>
				)}
				{cadDownloadButtonType !== CadDownloadButtonType.OFF && (
					<li>
						<CadDownLoadButton
							className={styles.cadDownloadButton}
							brandCode={brandCode}
							cadDownloadButtonType={cadDownloadButtonType}
							seriesCode={seriesCode}
							partNumber={partNumber}
							cadId={cadId}
							completeFlag={completeFlag}
							moldExpressType={moldExpressType}
							brandName={brandName}
							seriesName={seriesName}
							seriesImage={seriesImage}
							dropdownPosition="bottom"
						/>
					</li>
				)}
			</ul>
		</div>
	);
};

PartNumberHeader.displayName = 'PartNumberHeader';
