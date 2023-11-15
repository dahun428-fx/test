import classNames from 'classnames';
import React, { MouseEvent, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { CadPreviewButton } from './CadPreviewButton';
import { PartNumberGuide } from './PartNumberGuide';
import styles from './PartNumberHeader.module.scss';
import { CadDownLoadButton } from '@/components/pc/domain/CadDownload';
import { ProductDetailsDownloadButton } from '@/components/pc/pages/ProductDetail/ProductDetailsDownloadButton';
import { Flag } from '@/models/api/Flag';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { CadDownloadButtonType } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';

export type Props = {
	templateType: TemplateType;
	maxGuideCount: number;
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
	onClearFilter?: () => void;
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

/** Part number header component */
export const PartNumberHeader: VFC<Props> = ({
	templateType,
	completeFlag,
	totalCount,
	maxGuideCount,
	guideCount,
	partNumber,
	cad3DPreviewFlag,
	brandCode,
	seriesCode,
	cadId,
	cadDownloadButtonType,
	onClearFilter,
	moldExpressType,
	brandName,
	seriesName,
	seriesImage,
}) => {
	const isUnfixedSpec = Flag.isFalse(completeFlag) && totalCount === 1;
	const remainGuideCount = maxGuideCount - guideCount;
	const partNumberParts = unfixedSpecPartNumberParts(partNumber ?? '');
	const [t] = useTranslation();

	const handleClearFilter = (event: MouseEvent) => {
		event.preventDefault();
		onClearFilter?.();
	};

	return (
		<div
			className={classNames(styles.wrapper, {
				[String(styles.blinkEffect)]: Flag.isTrue(completeFlag),
				[String(styles.horizontalPadding)]:
					templateType === TemplateType.SIMPLE,
			})}
		>
			<div className={styles.partNumberHeader}>
				<PartNumberGuide
					{...{
						templateType,
						isUnfixedSpec,
						remainGuideCount,
						completeFlag,
						guideCount,
						totalCount,
					}}
				/>

				{partNumber && (
					<>
						{Flag.isTrue(completeFlag) ? (
							<>
								<p
									className={
										templateType === TemplateType.COMPLEX
											? styles.partNumberComplex
											: styles.partNumber
									}
								>
									{partNumber}
								</p>
								<a
									href="#"
									onClick={handleClearFilter}
									className={styles.buttonClear}
								>
									{t('pages.productDetail.partNumberHeader.clear')}
								</a>
							</>
						) : isUnfixedSpec ? (
							<>
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
								<a
									href="#"
									onClick={handleClearFilter}
									className={styles.buttonClear}
								>
									{t('pages.productDetail.partNumberHeader.clear')}
								</a>
							</>
						) : null}
					</>
				)}
			</div>
			<ul className={styles.buttonGroup}>
				<li>
					<ProductDetailsDownloadButton
						disabled={Flag.isFalse(completeFlag)}
						className={styles.productDetailButton}
					/>
				</li>
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
