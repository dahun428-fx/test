import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import styles from './Select.module.scss';

export type Option = {
	value: string;
	label: string;
};

type Props = Partial<Pick<HTMLElement, 'className'>> & {
	optionList: Option[];
	onChange?: (value: string) => void;
};

export const Select: React.VFC<Props> = ({
	className,
	optionList,
	onChange,
}) => {
	const [value, setValue] = useState<string>();

	const handleChange: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
		event => {
			const value = event.target.value;
			setValue(value);
			onChange && onChange(value);
		},
		[onChange]
	);

	return (
		<select
			onChange={handleChange}
			value={value}
			className={classNames(styles.select, className)}
		>
			{optionList.map(option => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
};
Select.displayName = 'Select';
