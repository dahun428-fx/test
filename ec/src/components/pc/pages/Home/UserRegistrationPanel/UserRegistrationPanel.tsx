import { useTranslation } from 'react-i18next';
import styles from './UserRegistrationPanel.module.scss';
import { LinkButton } from '@/components/pc/ui/buttons';
import { Link } from '@/components/pc/ui/links';
import { url } from '@/utils/url';

/** User Registration Panel */
export const UserRegistrationPanel: React.VFC = () => {
	const { t } = useTranslation();

	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';

	return (
		<div className={styles.box}>
			<h2 className={styles.header}>
				{t('pages.home.userRegistrationPanel.title')}
			</h2>
			<div className={styles.buttonBox}>
				<LinkButton
					theme="conversion"
					href={url.wos.userRegistration({ lang })}
					className={styles.button}
					target="_blank"
				>
					{t('pages.home.userRegistrationPanel.button')}
				</LinkButton>
				<Link
					href={url.registrationGuide}
					className={styles.guideLink}
					target="_blank"
				>
					<div className={styles.strong}>
						{t('pages.home.userRegistrationPanel.guideTitle')}
					</div>
					<div>{t('pages.home.userRegistrationPanel.guideSub')}</div>
				</Link>
			</div>
		</div>
	);
};
UserRegistrationPanel.displayName = 'UserRegistrationPanel';
