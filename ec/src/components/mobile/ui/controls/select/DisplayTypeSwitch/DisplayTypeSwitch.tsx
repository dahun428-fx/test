import classNames from 'classnames';
import styles from './DisplayTypeSwitch.module.scss';

export const Option = {
	LIST: 'dispList',
	PHOTO: 'dispPhoto',
} as const;

export type Option = typeof Option[keyof typeof Option];

export type Props = {
	value: Option;
	onChange: (value: Option) => void;
};

/** Display type switch component */
export const DisplayTypeSwitch: React.VFC<Props> = ({ value, onChange }) => {
	const nextValue = value === Option.PHOTO ? Option.LIST : Option.PHOTO;

	return (
		<div
			className={classNames(styles.button)}
			data-icon={nextValue}
			onClick={() => onChange(nextValue)}
		/>
	);
};
DisplayTypeSwitch.displayName = 'DisplayTypeSwitch';
