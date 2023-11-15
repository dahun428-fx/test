import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AddToMyComponentsCompleteModal.module.scss';
import { Button, LinkButton } from '@/components/mobile/ui/buttons';
import { url } from '@/utils/url';

type Props = {
	close?: () => void;
};

/** Part Number: Adding to My Components completed modal */
export const AddToMyComponentsCompleteContent: React.VFC<Props> = ({
	close,
}) => {
	const [t] = useTranslation();

	return (
		<div>
			<div className={styles.myComponentsModalMessage}>
				{t(
					'mobile.pages.productDetail.addToMyComponentsCompleteModal.addedToMyComponents'
				)}
			</div>

			<ul className={styles.functionWrapper}>
				<li className={styles.myComponentsButtonWrapper}>
					<LinkButton
						className={styles.actionButton}
						icon="right-arrow"
						theme="strong"
						size="max"
						href={url.myPage.myComponents}
					>
						{t('mobile.pages.productDetail.myComponents')}
					</LinkButton>
				</li>
				<li className={styles.closeButtonWrapper}>
					<Button className={styles.actionButton} size="max" onClick={close}>
						{t('mobile.pages.productDetail.close')}
					</Button>
				</li>
			</ul>
		</div>
	);
};

AddToMyComponentsCompleteContent.displayName =
	'AddToMyComponentsCompleteContent';
