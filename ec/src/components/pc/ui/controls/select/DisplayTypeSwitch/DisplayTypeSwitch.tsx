import classNames from 'classnames';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import styles from './DisplayTypeSwitch.module.scss';

export const Option = {
	LIST: 'dispList',
	PHOTO: 'dispPhoto',
	DETAIL: 'dispDetail',
} as const;
export type Option = typeof Option[keyof typeof Option];

export type Props = {
	value: Option;
	options: Option[];
	onChange: (value: Option) => void;
};

/**
 * ビュー切り替え
 */
export const DisplayTypeSwitch: React.VFC<Props> = ({
	value,
	options,
	onChange,
}) => {
	const [t] = useTranslation();
	const optionList: Record<string, TFunction> = {
		[Option.LIST]: t('components.ui.controls.displayTypeSwitch.list'),
		[Option.PHOTO]: t('components.ui.controls.displayTypeSwitch.photo'),
		[Option.DETAIL]: t('components.ui.controls.displayTypeSwitch.detail'),
	};

	return (
		<div className={styles.buttonWrapper}>
			{options.map(option => (
				<div
					key={option}
					className={classNames(styles.button, {
						[String(styles.active)]: value === option,
					})}
					data-icon={option}
					onClick={() => onChange(option)}
				>
					<div className={styles.label} data-text={optionList[option]}>
						{optionList[option]}
					</div>
				</div>
			))}
		</div>
	);
};
DisplayTypeSwitch.displayName = 'DisplayTypeSwitch';
