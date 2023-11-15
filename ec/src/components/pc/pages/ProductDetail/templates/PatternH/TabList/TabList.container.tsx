import React, { useCallback } from 'react';
import { TabList as Presenter } from './TabList';
import { ectLogger } from '@/logs/ectLogger';
import type { TabId } from '@/models/domain/series/tab';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

type Props = {
	className?: string;
};

export const TabList: React.VFC<Props> = ({ className }) => {
	const { digitalBookPdfUrl, technicalInfoUrl } = useSelector(selectSeries);

	const series = useSelector(selectSeries);

	const sendLog = useCallback(
		(tabId: TabId) => {
			ectLogger.tab.change({
				brandCode: series.brandCode,
				seriesCode: series.seriesCode,
				tabId,
			});
		},
		[series.brandCode, series.seriesCode]
	);

	const onChange = useCallback(
		(value: string) => {
			// NOTE: Using "as" is not recommended. ここでは value が TabId であると保証できるため使用しています。
			const tabId = value as TabId;
			sendLog(tabId);
		},
		[sendLog]
	);

	if (!digitalBookPdfUrl) {
		return null;
	}

	return (
		<Presenter
			className={className}
			digitalBookPdfUrl={digitalBookPdfUrl}
			technicalInfoUrl={technicalInfoUrl}
			onChange={onChange}
		/>
	);
};
TabList.displayName = 'TabList';
