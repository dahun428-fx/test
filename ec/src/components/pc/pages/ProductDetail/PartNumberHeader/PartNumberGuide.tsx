import classNames from 'classnames';
import { VFC, MouseEvent, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './PartNumberGuide.module.scss';
import { Link } from '@/components/pc/ui/links';
import { Flag } from '@/models/api/Flag';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { digit } from '@/utils/number';
import { scrollIntoView } from '@/utils/scrollIntoView';

type Props = {
	templateType: TemplateType;
	isUnfixedSpec: boolean;
	remainGuideCount: number;
	completeFlag?: Flag;
	guideCount: number;
	totalCount: number;
};

/** Part number guide component */
export const PartNumberGuide: VFC<Props> = ({
	templateType,
	isUnfixedSpec,
	remainGuideCount,
	completeFlag,
	totalCount,
}) => {
	const [t] = useTranslation();

	const handleScrollToPartNumberList = (event: MouseEvent) => {
		event.preventDefault();
		scrollIntoView('codeList');
	};

	const guide = useMemo(() => {
		if (templateType === TemplateType.COMPLEX || Flag.isTrue(completeFlag)) {
			return (
				<p className={styles.title}>{t('pages.productDetail.partNumber')}:</p>
			);
		} else if (templateType === TemplateType.SIMPLE) {
			return (
				<>
					<p className={styles.title}>{t('pages.productDetail.partNumber')}</p>
					{remainGuideCount ? (
						<Trans
							i18nKey="pages.productDetail.partNumberHeader.partNumberGuide.noItemSelect"
							values={{ totalCount: digit(totalCount) }}
							className={styles.messageWrapper}
						>
							<span className={styles.messageItem}>
								<span className={styles.alertMessage} />
								<span>
									{!isUnfixedSpec && (
										<Link
											href="?Tab=codeList"
											className={classNames(styles.partNumberListLink)}
											onClick={handleScrollToPartNumberList}
										/>
									)}
								</span>
							</span>
						</Trans>
					) : !isUnfixedSpec ? (
						<Trans
							i18nKey="pages.productDetail.partNumberHeader.partNumberGuide.unfixedSpecMessage"
							className={styles.messageWrapper}
						>
							<span className={styles.messageItem}>
								<Link
									href="?Tab=codeList"
									className={styles.partNumberListLink}
									onClick={handleScrollToPartNumberList}
								/>
							</span>
						</Trans>
					) : null}
				</>
			);
		}
	}, [
		completeFlag,
		isUnfixedSpec,
		remainGuideCount,
		t,
		templateType,
		totalCount,
	]);

	return (
		<>
			{guide}

			{totalCount === 0 && Flag.isFalse(completeFlag) && (
				<p className={styles.messageWrapper}>
					<span className={styles.messageItem}>
						{t(
							'pages.productDetail.partNumberHeader.partNumberGuide.noSuitableCandidates'
						)}
					</span>
				</p>
			)}

			{templateType === TemplateType.COMPLEX &&
				Flag.isFalse(completeFlag) &&
				!isUnfixedSpec && (
					<Trans
						i18nKey="pages.productDetail.partNumberHeader.partNumberGuide.unsettled"
						className={styles.messageWrapper}
						values={{ totalCount: digit(totalCount) }}
					>
						<span>
							<span className={styles.messageItem} />

							<span className={styles.messageItem}>
								<span className={styles.alertMessage} />
							</span>
						</span>
					</Trans>
				)}
		</>
	);
};
PartNumberGuide.displayName = 'PartNumberGuide';
