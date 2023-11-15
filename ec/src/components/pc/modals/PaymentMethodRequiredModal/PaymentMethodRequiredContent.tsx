import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PaymentMethodRequiredContent.module.scss';
import { Button, LinkButton } from '@/components/pc/ui/buttons';
import { url } from '@/utils/url';

type Props = {
	close?: () => void;
};

export const PaymentMethodRequiredContent: VFC<Props> = ({ close }) => {
	const [t] = useTranslation();

	return (
		<div className={styles.modalContent}>
			<div className={styles.modalMessage}>
				{t('components.modals.paymentMethodRequiredModal.requiredRegister')}
			</div>
			<div className={styles.modalButtonWrapper}>
				{/** TODO: Remove new tab icon inside this button */}
				<div className={styles.modalMessageButton}>
					<LinkButton
						href={url.wos.upgradeAccount({ lang: 'en' })}
						target="_blank"
						theme="strong"
					>
						{t(
							'components.modals.paymentMethodRequiredModal.registerOrderQuote'
						)}
					</LinkButton>
				</div>
				<Button theme="default" size="m" onClick={close}>
					{t('components.modals.paymentMethodRequiredModal.cancel')}
				</Button>
			</div>
		</div>
	);
};
PaymentMethodRequiredContent.displayName = 'PaymentMethodRequiredContent';
