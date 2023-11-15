import classNames from 'classnames';
import { FC } from 'react';
import { Select, Props as SelectProps } from './Select';
import styles from './SelectWithLabel.module.scss';

type Props = SelectProps & {
	label: string;
	className?: string;
};

/** Select with title on the left */
export const SelectWithLabel: FC<Props> = ({ label, className, ...props }) => {
	return (
		<>
			<div className={classNames(styles.label, className)}>{label}</div>
			<div className={classNames(styles.selectWrapper, className)}>
				<Select {...props} />
			</div>
		</>
	);
};
SelectWithLabel.displayName = 'SelectWithLabel';
