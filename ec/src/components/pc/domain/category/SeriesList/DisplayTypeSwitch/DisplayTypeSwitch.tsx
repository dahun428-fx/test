import classNames from 'classnames';
import { TFunction } from 'i18next';
import Router from 'next/router';
import { useTranslation } from 'react-i18next';
import styles from './DisplayTypeSwitch.module.scss';
import { fromEntries } from '@/utils/object';
import { notNull } from '@/utils/predicate';
import { getOneParams } from '@/utils/query';

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

function isFillEntry(
	entry: [string, string | undefined]
): entry is [string, string] {
	return notNull(entry[1]);
}

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
	const categorySpecQuery = fromEntries(
		Object.entries(getOneParams(Router.query, 'CategorySpec')).filter(
			isFillEntry
		)
	);

	const createQuery = (dispMethod: string) => {
		return `?${new URLSearchParams({
			DispMethod: dispMethod,
			...categorySpecQuery,
		}).toString()}`;
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
					<a
						href={createQuery(option)}
						className={styles.label}
						onClick={e => e.preventDefault()}
						data-text={optionList[option]}
					>
						{optionList[option]}
					</a>
				</div>
			))}
		</div>
	);
};
DisplayTypeSwitch.displayName = 'DisplayTypeSwitch';
