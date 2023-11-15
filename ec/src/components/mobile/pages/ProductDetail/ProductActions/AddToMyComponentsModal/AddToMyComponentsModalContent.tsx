import { useTranslation } from 'react-i18next';
import styles from './AddToMyComponentsModalContent.module.scss';
import { Button, LinkButton } from '@/components/mobile/ui/buttons';
import { url } from '@/utils/url';

type Props = {
	close?: () => void;
};

export const AddToMyComponentsModalContent: React.VFC<Props> = ({ close }) => {
	const { t } = useTranslation();

	return (
		<>
			<div className={styles.message}>
				{t('mobile.components.modals.addToMyComponentsModal.message')}
			</div>
			<div className={styles.buttonWrapper}>
				<div className={styles.buttonBox}>
					<LinkButton
						theme="strong"
						icon="right-arrow"
						href={url.myPage.myComponents}
					>
						{t('mobile.components.modals.addToMyComponentsModal.myComponents')}
					</LinkButton>
				</div>
				<div className={styles.buttonBox}>
					<Button onClick={close}>
						<span className={styles.buttonLabel}>
							{t('mobile.components.modals.addToMyComponentsModal.close')}
						</span>
					</Button>
				</div>
			</div>
		</>
	);
};
AddToMyComponentsModalContent.displayName = 'AddToMyComponentsModalContent';
