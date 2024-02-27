import { Flag } from '@/models/api/Flag';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PartNumberGuide.module.scss';

type Props = {
	completeFlag?: Flag;
	guideCount: number;
	totalCount: number;
};

/** Part number guide component */
export const PartNumberGuide: React.VFC<Props> = ({
	completeFlag,
	totalCount,
}) => {
	const [t] = useTranslation();

	const guide = useMemo(() => {
		if (Flag.isTrue(completeFlag)) {
			return (
				<p className={styles.title}>{t('pages.productDetail.partNumber')}:</p>
			);
		} else {
			return (
				<>
					<p className={styles.title}>
						{t(
							'pages.productDetail.pu.partNumberHeader.partNumberGuide.partNumber'
						)}
					</p>

					<span className={styles.messageNotFound}>
						{t(
							'pages.productDetail.pu.partNumberHeader.partNumberGuide.parametricUnitNoSuitableCandidates'
						)}
					</span>
				</>
			);
		}
	}, [completeFlag, t]);

	return (
		<>
			{guide}

			{totalCount === 0 && Flag.isFalse(completeFlag) && (
				<p className={styles.messageWrapper}>
					<span className={styles.messageItem}>
						{t(
							'pages.productDetail.pu.partNumberHeader.partNumberGuide.noSuitableCandidates'
						)}
					</span>
				</p>
			)}
		</>
	);
};

PartNumberGuide.displayName = 'PartNumberGuide';
