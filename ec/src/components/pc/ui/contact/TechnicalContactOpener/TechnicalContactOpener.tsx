import classNames from 'classnames';
import { useCallback } from 'react';
import styles from './TechnicalContactOpener.module.scss';
import { useTranslation } from 'react-i18next';

type Props = {
	isOpen: boolean;
	onClick: () => void;
};

export const TechnicalContactOpener = (props: Props) => {
	const [t] = useTranslation();

	const onClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			props.onClick();
		},
		[props]
	);

	return (
		<p
			className={classNames(styles.opener, {
				[String(styles.isOpen)]: props.isOpen,
			})}
			onClick={onClick}
		>
			{t('components.ui.contact.technicalContact.opener')}
			<span className={styles.openerIcon} aria-expanded={props.isOpen} />
		</p>
	);
};
TechnicalContactOpener.displayName = 'TechnicalContactOpener';
