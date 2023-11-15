import classNames from 'classnames';
import Router from 'next/router';
import styles from './DisplayTypeSwitch.module.scss';
import { SpecSearchDispType } from '@/models/api/constants/SpecSearchDispType';
import { fromEntries } from '@/utils/object';
import { notNull } from '@/utils/predicate';
import { getOneParams } from '@/utils/query';

const DisplayMethod = {
	LIST: 'dispList',
	PHOTO: 'dispPhoto',
} as const;

type DisplayMethod = typeof DisplayMethod[keyof typeof DisplayMethod];

type Props = {
	displayType?: SpecSearchDispType;
	onChange: () => void;
};

function isFillEntry(
	entry: [string, string | undefined]
): entry is [string, string] {
	return notNull(entry[1]);
}

/** Display type switch component */
export const DisplayTypeSwitch: React.VFC<Props> = ({
	displayType,
	onChange,
}) => {
	const nextDisplayMethod: DisplayMethod =
		displayType === SpecSearchDispType.LIST ? 'dispPhoto' : 'dispList';

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
		<>
			{!displayType ? (
				<div className={classNames(styles.noIcon)} />
			) : (
				<div
					className={classNames(styles.button)}
					data-icon={displayType === SpecSearchDispType.LIST ? 'photo' : 'list'}
					onClick={onChange}
				>
					<a
						href={createQuery(nextDisplayMethod)}
						onClick={e => e.preventDefault()}
					/>
				</div>
			)}
		</>
	);
};
DisplayTypeSwitch.displayName = 'DisplayTypeSwitch';
