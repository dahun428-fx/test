import Router from 'next/router';
import React from 'react';
import { Meta as Presenter } from './Meta';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';
import { getOneParams } from '@/utils/query';

const INVISIBLE_TAB_ID: string[] = ['codeList'];

/**
 * Wysiwyg Meta container
 */
export const Meta: React.VFC = () => {
	const { translateTabQuery } = useTabTranslation();

	const series = useSelector(selectSeries);
	const { Tab: tabId } = getOneParams(Router.query, 'Tab');
	const isTabIdVisible = !!tabId && !INVISIBLE_TAB_ID.includes(tabId);

	return (
		<Presenter
			series={series}
			translatedTab={isTabIdVisible ? translateTabQuery(tabId) : undefined}
		/>
	);
};
Meta.displayName = 'Meta';
