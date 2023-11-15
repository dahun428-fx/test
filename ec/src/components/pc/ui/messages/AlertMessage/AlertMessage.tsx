import classNames from 'classnames';
import styles from './AlertMessage.module.scss';

type Props = {
	className?: string;
};

/**
 * Error Message
 */
export const AlertMessage: React.FC<Props> = ({ className, children }) => {
	return <p className={classNames(styles.message, className)}>{children}</p>;
};
AlertMessage.displayName = 'AlertMessage';
