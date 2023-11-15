import React from 'react';
import { Trans } from 'react-i18next';
import Sticky from 'react-stickynode';
import styles from './SeriesListControl.module.scss';
import {
	DisplayTypeSwitch,
	Option,
} from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { digit } from '@/utils/number';

type Props = {
	displayType: Option;
	totalResult?: number;
	fixTop: number;
	onChangeDisplayType: (value: Option) => void;
	onShowsFilterPanel: () => void;
};

/**
 * Series List Control
 */
export const SeriesListControl: React.VFC<Props> = ({
	displayType,
	totalResult,
	fixTop,
	onChangeDisplayType,
	onShowsFilterPanel,
}) => {
	if (!totalResult) {
		return null;
	}

	return (
		<Sticky top={fixTop} innerActiveClass={styles.sticky}>
			<div className={styles.seriesListControl}>
				<div className={styles.totalResult}>
					<Trans
						i18nKey="mobile.pages.keywordSearch.seriesListControl.totalResult"
						values={{ count: digit(totalResult) }}
					>
						<strong />
						<span className={styles.totalResultNum} />
					</Trans>
				</div>
				<div className={styles.buttonGroup}>
					<DisplayTypeSwitch
						value={displayType}
						onChange={onChangeDisplayType}
					/>
					<button
						className={styles.filterButton}
						onClick={onShowsFilterPanel}
					/>
				</div>
			</div>
		</Sticky>
	);
};
SeriesListControl.displayName = 'SeriesListControl';
