import classNames from 'classnames';
import React, { useState } from 'react';
import styles from './Collapsible.module.scss';

type Props = {
	title: string;
	alwaysExpanded?: boolean;
	theme?: 'primary' | 'secondary' | 'tertiary' | 'section';
};

export const Collapsible: React.FC<Props> = ({
	title,
	children,
	alwaysExpanded = false,
	theme = 'primary',
}) => {
	const [isCollapsed, setIsCollapsed] = useState(true);

	/** handle click title */
	const handleClickTitle = (event: React.MouseEvent) => {
		event.preventDefault();
		if (alwaysExpanded) {
			return;
		}
		setIsCollapsed(!isCollapsed);
	};

	/** get title style for theme */
	const getTitleStyle = () => {
		let titleStyles;

		if (!alwaysExpanded && isCollapsed) {
			titleStyles = classNames({
				[String(styles.titlePrimaryCollapsed)]: theme === 'primary',
				[String(styles.titleSecondaryCollapsed)]: theme === 'secondary',
				[String(styles.titleTertiaryCollapsed)]: theme === 'tertiary',
				[String(styles.titleSectionCollapsed)]: theme === 'section',
			});
		}

		if (!alwaysExpanded && !isCollapsed) {
			titleStyles = classNames({
				[String(styles.titlePrimaryExpanded)]: theme === 'primary',
				[String(styles.titleSecondaryExpanded)]: theme === 'secondary',
				[String(styles.titleTertiaryExpanded)]: theme === 'tertiary',
				[String(styles.titleSectionExpanded)]: theme === 'section',
			});
		}

		return classNames(styles.title, titleStyles, {
			[String(styles.titlePrimary)]: theme === 'primary',
			[String(styles.titleSecondary)]: theme === 'secondary',
			[String(styles.titleTertiary)]: theme === 'tertiary',
			[String(styles.titleSection)]: theme === 'section',
		});
	};

	return (
		<div>
			<a href="#" onClick={handleClickTitle} className={styles.heading}>
				<h3 className={getTitleStyle()}>{title}</h3>
			</a>
			<div
				className={classNames({
					[String(styles.bodyCollapsed)]: !(alwaysExpanded || !isCollapsed),
				})}
			>
				{children}
			</div>
		</div>
	);
};
