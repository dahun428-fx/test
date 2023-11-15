import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AddToMyComponentsModal.module.scss';
import { AddToMyComponentsRecommend } from './AddToMyComponentsRecommend';
import { LinkButton } from '@/components/pc/ui/buttons';
import legacyStyles from '@/styles/pc/legacy/modalRecommendations.module.scss';
import { url } from '@/utils/url';

type Props = {
	seriesCode: string;
};

/** Add to my components completed modal */
export const AddToMyComponentsContent: React.VFC<Props> = ({ seriesCode }) => {
	const [t] = useTranslation();

	return (
		<div
			className={classNames(
				styles.addToMyComponentModal,
				legacyStyles.modalRecommendations
			)}
		>
			<div className={styles.modalContent}>
				<div className={styles.message}>
					{t('pages.productDetail.addToMyComponentsModal.addedToMyComponents')}
				</div>

				<div className={styles.button}>
					<LinkButton theme="strong" size="s" href={url.myPage.myComponents}>
						{t('pages.productDetail.myComponents')}
					</LinkButton>
				</div>

				<AddToMyComponentsRecommend
					seriesCode={seriesCode}
					className={styles.recommend}
				/>
			</div>
		</div>
	);
};
AddToMyComponentsContent.displayName = 'AddToMyComponentsContent';
