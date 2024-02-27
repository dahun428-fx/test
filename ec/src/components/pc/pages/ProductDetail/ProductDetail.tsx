import dynamic from 'next/dynamic';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Props as ComplexProps } from './templates/Complex';
import type { Props as PatternHProps } from './templates/PatternH';
import type { Props as SimpleProps } from './templates/Simple';
import type { Props as WysiwygProps } from './templates/Wysiwyg';
import type { Props as PUProps } from './templates/PU';
import { PageLoader } from '@/components/pc/ui/loaders';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { cameleer } from '@/logs/cameleer';
import { CadType } from '@/models/api/constants/CadType';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { useSelector } from '@/store/hooks';
import {
	clearOperation,
	loadOperation,
	selectTemplateType,
} from '@/store/modules/pages/productDetail';

const PU = dynamic<PUProps>(
	() =>
		import('@/components/pc/pages/ProductDetail/templates/PU').then(
			module => module.PU
		),
	{ ssr: false }
);

const Simple = dynamic<SimpleProps>(
	() =>
		import('@/components/pc/pages/ProductDetail/templates/Simple').then(
			module => module.Simple
		),
	{ ssr: false }
);

const Complex = dynamic<ComplexProps>(
	() =>
		import('@/components/pc/pages/ProductDetail/templates/Complex').then(
			module => module.Complex
		),
	{ ssr: false }
);

const PatternH = dynamic<PatternHProps>(
	() =>
		import('@/components/pc/pages/ProductDetail/templates/PatternH').then(
			module => module.PatternH
		),
	{ ssr: false }
);

const Wysiwyg = dynamic<WysiwygProps>(
	() =>
		import('@/components/pc/pages/ProductDetail/templates/Wysiwyg').then(
			module => module.Wysiwyg
		),
	{ ssr: false }
);

export type Props = {
	seriesCode: string;
	partNumber?: string;
	template?: string;
	page?: number | undefined;
	cadType?: CadType;
	categorySpec?: Record<string, string | string[]>;
	daysToShip?: number;
	seriesResponse: SearchSeriesResponse$detail;
	partNumberResponse: SearchPartNumberResponse$search;
	tab?: string;
};

export const ProductDetail: React.VFC<Props> = ({
	seriesCode,
	partNumber,
	template,
	page = 1,
	seriesResponse,
	partNumberResponse,
	tab,
}) => {
	// TODO: Move the following useSelectors to ProductDetail.hooks.ts
	const dispatch = useDispatch();
	const templateType = useSelector(selectTemplateType);

	useEffect(() => {
		loadOperation(dispatch)({
			seriesCode,
			partNumber,
			page,
			template,
			seriesResponse,
			partNumberResponse,
		});
	}, [
		dispatch,
		page,
		partNumber,
		partNumberResponse,
		seriesCode,
		seriesResponse,
		template,
	]);

	useEffect(() => {
		const series = seriesResponse.seriesList[0];
		if (series) {
			cameleer.viewSeries(series);
		}
	}, [seriesResponse]);

	useOnMounted(() => {
		const onChangeRoute = () => {
			clearOperation(dispatch)();
			window.scrollTo({ top: 0, left: 0 });
		};
		Router.events.on('routeChangeStart', onChangeRoute);
		return () => Router.events.off('routeChangeStart', onChangeRoute);
	});

	if (!templateType) {
		return <PageLoader />;
	}

	switch (templateType) {
		case TemplateType.SIMPLE:
			return (
				<Simple seriesCode={seriesCode} partNumber={partNumber} tab={tab} />
			);
		case TemplateType.PATTERN_H:
			return <PatternH seriesCode={seriesCode} partNumber={partNumber} />;
		case TemplateType.WYSIWYG:
			return <Wysiwyg seriesCode={seriesCode} partNumber={partNumber} />;
		case TemplateType.PU:
			return <PU seriesCode={seriesCode} partNumber={partNumber} />;
		case TemplateType.COMPLEX:
		default:
			return <Complex seriesCode={seriesCode} partNumber={partNumber} />;
	}
};
ProductDetail.displayName = 'ProductDetail';
