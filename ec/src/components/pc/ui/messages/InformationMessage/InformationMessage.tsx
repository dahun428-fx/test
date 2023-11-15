import classNames from 'classnames';
import styles from './InformationMessage.module.scss';

type Props = {
	className?: string;
};

/**
 * Information Message
 */
export const InformationMessage: React.FC<Props> = ({
	className,
	children,
}) => {
	return <p className={classNames(styles.message, className)}>{children}</p>;
};
InformationMessage.displayName = 'InformationMessage';
