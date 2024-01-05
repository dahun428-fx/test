import classNames from 'classnames';
import React, { VFC } from 'react';
import styles from './Select.module.scss';
import { groupBy } from '@/utils/collection';

export type Size = 'normal' | 'min';

export type Option = {
	value: string;
	label: string;
	group?: string;
};

export type Props = {
	items: Option[];
	groupOrder?: string[];
	value?: string;
	disabled?: boolean;
	className?: string;
	onChange: (option: Option) => void;
};

/** Select base */
export const Select: React.VFC<Props> = ({
	items,
	groupOrder,
	value,
	disabled = false,
	className,
	onChange,
}) => {
	const options = groupBy(items, 'group');

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const option = items.find(item => item.value === event.target.value);
		if (option) {
			onChange(option);
		}
	};

	return (
		<select
			disabled={disabled}
			className={classNames(className, styles.select)}
			value={value}
			onChange={handleChange}
		>
			{groupOrder?.length ? (
				<SelectOptionGroup groups={groupOrder} options={options} />
			) : (
				<SelectOption options={items} />
			)}
		</select>
	);
};
Select.displayName = 'Select';

const SelectOptionGroup: VFC<{
	groups: string[];
	options: Record<string, Option[]>;
}> = ({ groups, options }) => {
	return (
		<>
			{groups.map((group, index) => (
				<optgroup key={index} label={group}>
					{options[group]?.map((item, optionIndex) => {
						return (
							<option value={item.value} key={optionIndex}>
								{item.label}
							</option>
						);
					})}
				</optgroup>
			))}
		</>
	);
};
SelectOptionGroup.displayName = 'SelectOptionGroup';

const SelectOption: VFC<{ options: Option[] }> = ({ options }) => {
	return (
		<>
			{options.map((item, optionIndex) => {
				return (
					<option value={item.value} key={optionIndex}>
						{item.label}
					</option>
				);
			})}
		</>
	);
};
SelectOption.displayName = 'SelectOption';
