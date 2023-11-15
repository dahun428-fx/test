import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PaymentMethodRequiredContent.module.scss';
import { Button, LinkButton } from '@/components/mobile/ui/buttons';
import { url } from '@/utils/url';

type Props = {
	close?: () => void;
};

/** Payment method required content component */
export const PaymentMethodRequiredContent: VFC<Props> = ({ close }) => {
	const [t] = useTranslation();

	return (
		<div>
			<div className={styles.modalMessage}>
				{t(
					'mobile.components.modals.paymentMethodRequiredModal.requiredRegister'
				)}
			</div>
			<div className={styles.modalButtonWrapper}>
				{/** TODO: Remove new tab icon inside this button */}
				<LinkButton
					href={url.wos.upgradeAccount({ lang: 'en' })}
					target="_blank"
					theme="strong"
					size="max"
				>
					<span className={styles.buttonLabel}>
						{t(
							'mobile.components.modals.paymentMethodRequiredModal.registerOrderQuote'
						)}
					</span>
				</LinkButton>
			</div>
			<div className={styles.modalButtonWrapper}>
				<Button theme="default" size="max" onClick={close}>
					<span className={styles.buttonLabel}>
						{t('mobile.components.modals.paymentMethodRequiredModal.cancel')}
					</span>
				</Button>
			</div>
		</div>
	);
};
PaymentMethodRequiredContent.displayName = 'PaymentMethodRequiredContent';
