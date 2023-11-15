import classNames from 'classnames';
import { VFC, MouseEvent, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MakerNavigation.module.scss';
import { Alphabet, alphabetList } from '@/utils/domain/brand';

export type Option = Alphabet | '1-9' | 'all';

type Props = {
	selected: Option;
	onSelect: (option: Option) => void;
	possibleValues: Set<Option>;
};

type MenuItem = {
	value: Option;
	label: string;
};

export const ALL_VALUE = 'all';

/** Maker navigation */
export const MakerNavigation: VFC<Props> = ({
	selected,
	onSelect,
	possibleValues,
}) => {
	const [t] = useTranslation();

	const menuItems: MenuItem[] = useMemo(
		() => [
			...alphabetList.map(letter => ({ value: letter, label: letter })),
			{ value: '1-9', label: t('pages.maker.makerNavigation.digits') },
		],
		[t]
	);

	const filteredMenuItems = useMemo(
		() => menuItems.filter(item => possibleValues.has(item.value)),
		[menuItems, possibleValues]
	);

	const handleSelect = useCallback(
		(event: MouseEvent, letter: Option) => {
			event.preventDefault();
			onSelect(letter);
		},
		[onSelect]
	);

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<h2 className={styles.headerTitle}>
					{t('pages.maker.makerNavigation.searchByMakerName')}
				</h2>
				<ul className={styles.content}>
					<li key={ALL_VALUE}>
						<a
							className={classNames(styles.itemList, {
								[String(styles.selected)]: selected === ALL_VALUE,
							})}
							onClick={event => handleSelect(event, ALL_VALUE)}
						>
							{t('pages.maker.makerNavigation.all')}
						</a>
					</li>
					{filteredMenuItems.map(({ value, label }) => (
						<li key={value}>
							<a
								href={`#line_${label}`}
								className={classNames(styles.itemList, {
									[String(styles.selected)]: selected === value,
								})}
								onClick={event => handleSelect(event, value)}
							>
								{label}
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
MakerNavigation.displayName = 'MakerNavigation';
