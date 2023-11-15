import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './OpenOrderStatusButton.module.scss';
import { NagiButton } from '@/components/mobile/ui/buttons';

type Props = {
	showsPopup: boolean;
	onClick: () => void;
	onClickClosePopup: () => void;
};

/**
 * Order status link
 */
export const OpenOrderStatusButton: React.VFC<Props> = ({
	showsPopup,
	onClick,
	onClickClosePopup,
}) => {
	/** translator */
	const [t] = useTranslation();

	return (
		<div className={styles.area}>
			{showsPopup && <div className={styles.popupBackground} />}
			<p className={classNames(styles.buttonBox)}>
				<a className={styles.button} onClick={onClick}>
					{t('mobile.pages.home.openOrderStatusButton.title')}
				</a>
			</p>
			{showsPopup && (
				<div className={styles.popupBox}>
					<p className={styles.popupText}>
						{t('mobile.pages.home.openOrderStatusButton.popupText')}
					</p>
					<p className={styles.popupButtonWrap}>
						<NagiButton
							onClick={onClickClosePopup}
							theme="tertiary"
							className={styles.nagiLinkClosePopupButton}
						>
							{t('mobile.pages.home.openOrderStatusButton.closePopup')}
						</NagiButton>
					</p>
				</div>
			)}
		</div>
	);
};
OpenOrderStatusButton.displayName = 'OpenOrderStatusButton';
