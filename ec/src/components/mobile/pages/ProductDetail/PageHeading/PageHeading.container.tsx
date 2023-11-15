import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeading as Presenter } from './PageHeading';
import styles from './PageHeading.module.scss';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { getSeriesNameDisp } from '@/utils/domain/series';
import { notNull } from '@/utils/predicate';

type Props = {
	className?: string;
	series: Series;
	partNumberList: PartNumber[];
};

export const PageHeading: React.VFC<Props> = ({
	className,
	series,
	partNumberList,
}) => {
	const { t } = useTranslation();
	const { translateTabQuery } = useTabTranslation();
	const { query } = useRouter();

	const title = useMemo(() => {
		const seriesNameDisp = getSeriesNameDisp(series, t);

		const { HissuCode, Tab, Page, CategorySpec, PNSearch } = query;

		// NOTE: Tab query param がある場合は、型番等はシリーズ名に表示しない
		if (Tab) {
			const tabName = translateTabQuery(Tab);
			if (tabName) {
				return `${seriesNameDisp} (${tabName})`;
			}
		}

		if (HissuCode != null) {
			let partNumber = undefined;
			// 型番が1件に決まる場合のみ、型番表示
			if (
				Tab == null &&
				Page == null &&
				CategorySpec == null &&
				PNSearch == null &&
				partNumberList.length === 1 &&
				notNull(partNumberList[0])
			) {
				partNumber = partNumberList[0].partNumber;
			}

			const partNumberDisp = partNumber
				? t('mobile.pages.productDetail.pageHeading.partNumber', { partNumber })
				: '';

			// インナー名は型番が1件で、あれば表示
			if (
				Page == null &&
				partNumberList.length === 1 &&
				notNull(partNumberList[0]) &&
				partNumberList[0].innerName
			) {
				return `${partNumberDisp}${seriesNameDisp} ${partNumberList[0].innerName}`;
			}
			return `${partNumberDisp}${seriesNameDisp}`;
		}

		return seriesNameDisp;
	}, [partNumberList, query, series, t, translateTabQuery]);

	return (
		<Presenter className={classNames(className, styles.wrap)}>
			{title}
		</Presenter>
	);
};
PageHeading.displayName = 'PageHeading';
