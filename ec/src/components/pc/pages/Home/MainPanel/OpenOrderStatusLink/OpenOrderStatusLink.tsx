import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './OpenOrderStatusLink.module.scss';

type Props = {
	showsPopup: boolean;
	onClickLink: () => void;
	onClickClosePopup: () => void;
};

export const OpenOrderStatusLink: React.VFC<Props> = ({
	showsPopup,
	onClickLink,
	onClickClosePopup,
}) => {
	/** translator */
	const [t] = useTranslation();

	return (
		<div className={styles.container}>
			{showsPopup && <div className={styles.popupBackground} />}
			<p
				className={classNames(styles.linkBox, {
					[String(styles.highLayer)]: showsPopup,
				})}
			>
				<a className={styles.link} onClick={onClickLink}>
					{t('pages.home.openOrderStatusLink.link')}
				</a>
			</p>
			{showsPopup && (
				<div className={styles.popupBox}>
					{t('pages.home.openOrderStatusLink.popupText')}
					<div className={styles.close} onClick={onClickClosePopup} />
				</div>
			)}
		</div>
	);
};
OpenOrderStatusLink.displayName = 'OpenOrderStatusLink';
