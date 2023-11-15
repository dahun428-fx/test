import dynamic from 'next/dynamic';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useProductDetail } from './ProductDetail.hooks';
import styles from './ProductDetail.module.scss';
import { Layout } from '@/components/mobile/layouts/Layout';
import { ProductAttributes } from '@/components/mobile/pages/ProductDetail/ProductAttributes';
import type { Props as ComplexProps } from '@/components/mobile/pages/ProductDetail/templates/Complex';
import type { Props as SimpleProps } from '@/components/mobile/pages/ProductDetail/templates/Simple';
// NOTE: パターンHについては、暫定的にPC画面を表示しています
// eslint-disable-next-line no-restricted-imports
import type { Props as PatternHProps } from '@/components/pc/pages/ProductDetail/templates/PatternH';
// NOTE: Wysiwygについては、暫定的にPC画面を表示しています
// eslint-disable-next-line no-restricted-imports
import type { Props as WysiwygProps } from '@/components/pc/pages/ProductDetail/templates/Wysiwyg';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { cameleer } from '@/logs/cameleer';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { clearOperation } from '@/store/modules/pages/productDetail';
import { first } from '@/utils/collection';

const Simple = dynamic<SimpleProps>(
	() =>
		import('@/components/mobile/pages/ProductDetail/templates/Simple').then(
			module => module.Simple
		),
	{ ssr: false, loading: () => <TemplateFallback /> }
);

const Complex = dynamic<ComplexProps>(
	() =>
		import('@/components/mobile/pages/ProductDetail/templates/Complex').then(
			module => module.Complex
		),
	{ ssr: false, loading: () => <TemplateFallback /> }
);

// NOTE: パターンHについては、暫定的にPC画面を表示しています
// eslint-disable-next-line @typescript-eslint/ban-types
const PCLayout = dynamic<{}>(
	() => import('@/components/pc/layouts/Layout').then(module => module.Layout),
	{ ssr: false }
);

const PatternH = dynamic<PatternHProps>(
	() =>
		import('@/components/pc/pages/ProductDetail/templates/PatternH').then(
			({ PatternH }) => PatternH
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
	seriesResponse: SearchSeriesResponse$detail;
	partNumberResponse: SearchPartNumberResponse$search;
	tab?: string;
};

export const ProductDetail: React.VFC<Props> = ({
	seriesCode,
	partNumber,
	page = 1,
	template,
	seriesResponse,
	partNumberResponse,
	tab,
}) => {
	const dispatch = useDispatch();
	const { templateType, load } = useProductDetail();

	useEffect(() => {
		load({
			seriesCode,
			partNumber,
			page,
			template,
			seriesResponse,
			partNumberResponse,
		}).then();
	}, [
		load,
		page,
		partNumber,
		partNumberResponse,
		seriesCode,
		seriesResponse,
		template,
	]);

	useEffect(() => {
		const series = first(seriesResponse.seriesList);
		if (series) {
			cameleer.viewSeries(series);
		}
	}, [seriesResponse]);

	useOnMounted(() => {
		const onChangeRoute = () => {
			clearOperation(dispatch)();
			window.scrollTo({ top: 0, left: 0 });
		};
		Router.events.on('beforeHistoryChange', onChangeRoute);
		return () => Router.events.off('beforeHistoryChange', onChangeRoute);
	});

	if (!templateType) {
		return (
			<Layout>
				<ProductAttributes
					seriesResponse={seriesResponse}
					partNumberResponse={partNumberResponse}
				/>
				<TemplateFallback />
			</Layout>
		);
	}

	switch (templateType) {
		case TemplateType.SIMPLE:
			return (
				<Layout>
					<ProductAttributes
						seriesResponse={seriesResponse}
						partNumberResponse={partNumberResponse}
					/>
					<Simple />
				</Layout>
			);
		case TemplateType.PATTERN_H:
			return (
				<PCLayout>
					<PatternH seriesCode={seriesCode} partNumber={partNumber} />
				</PCLayout>
			);
		// TODO: Wysiwyg template 実装。PatternH 同様、getLayout の実装を忘れずに。
		case TemplateType.WYSIWYG:
			return (
				<PCLayout>
					<Wysiwyg seriesCode={seriesCode} partNumber={partNumber} />
				</PCLayout>
			);
		case TemplateType.COMPLEX:
		default:
			return (
				<Layout>
					<ProductAttributes
						seriesResponse={seriesResponse}
						partNumberResponse={partNumberResponse}
					/>
					<Complex seriesCode={seriesCode} partNumber={partNumber} tab={tab} />
				</Layout>
			);
	}
};
ProductDetail.displayName = 'ProductDetail';

const TemplateFallback: React.VFC = () => {
	return <div className={styles.fallback} />;
};
TemplateFallback.displayName = 'TemplateFallback';
