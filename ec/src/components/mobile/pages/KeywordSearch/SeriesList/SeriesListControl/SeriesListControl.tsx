import React from 'react';
import styles from './SeriesListControl.module.scss';
import { Button } from '@/components/mobile/ui/buttons';
import {
	DisplayTypeSwitch,
	Option,
} from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';

type Props = {
	displayType: Option;
	onChangeDisplayType: (value: Option) => void;
	showsSpecFilter: () => void;
};

/**
 * Series List Control
 */
export const SeriesListControl: React.VFC<Props> = ({
	displayType,
	onChangeDisplayType,
	showsSpecFilter,
}) => {
	return (
		<div className={styles.seriesListControl}>
			<div className={styles.placeholder}>NEW_FE-3425 Series List Control</div>
			<div>
				<DisplayTypeSwitch value={displayType} onChange={onChangeDisplayType} />
				<Button onClick={showsSpecFilter}>Toggle</Button>
			</div>
		</div>
	);
};
SeriesListControl.displayName = 'SeriesListControl';
