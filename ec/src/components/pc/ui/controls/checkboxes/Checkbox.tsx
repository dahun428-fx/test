import React from 'react';
import styles from './Checkbox.module.scss';

type Props = {
	checked: boolean;
	disabled?: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
};

/** Checkbox base */
export const Checkbox: React.FC<Props> = ({
	checked,
	disabled = false,
	onChange,
	className,
	children,
}) => {
	// NOTE: IE のチェックボックス特有の中間状態では change イベントが発火しないのには非対応
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.currentTarget.checked);
	};

	return (
		<label className={className}>
			<input
				className={styles.checkbox}
				type="checkbox"
				checked={checked}
				onChange={handleChange}
				disabled={disabled}
			/>
			<span className={styles.label}>{children}</span>
		</label>
	);
};
Checkbox.displayName = 'Checkbox';
