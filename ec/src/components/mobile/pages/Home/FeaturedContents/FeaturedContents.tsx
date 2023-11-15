import React, { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeaturedContents } from './FeaturedContents.hooks';
import styles from './FeaturedContents.module.scss';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { useBoolState } from '@/hooks/state/useBoolState';
import legacyStyles from '@/styles/mobile/legacy/home.module.scss';

const DEFAULT_VISIBLE_CATEGORY_COUNT = 2;

/** Feature contents components */
export const FeaturedContents: React.VFC = () => {
	const [t] = useTranslation();
	const ref = useRef<HTMLDivElement>(null);

	const { featuredContents } = useFeaturedContents();
	const { bool: showsAll, toggle: toggleShowAll } = useBoolState(false);

	useLayoutEffect(() => {
		const containerElement = ref.current;

		if (!containerElement || !featuredContents) {
			return;
		}

		const allCategoryBanner = containerElement.querySelector(
			'.c-allCategory__banner'
		);
		const allCategoryTitle = containerElement.getElementsByClassName(
			'c-allCategory__title'
		) as HTMLCollectionOf<HTMLElement>;
		const allContent = containerElement.getElementsByClassName(
			'c-allCategory__content'
		) as HTMLCollectionOf<HTMLElement>;
		const allBrand = containerElement.getElementsByClassName(
			'c-allCategory__brand'
		) as HTMLCollectionOf<HTMLElement>;

		containerElement.style.display = 'block';
		Array.from(allCategoryTitle)
			.slice(DEFAULT_VISIBLE_CATEGORY_COUNT)
			.forEach(
				element => (element.style.display = showsAll ? 'block' : 'none')
			);
		Array.from(allContent)
			.slice(DEFAULT_VISIBLE_CATEGORY_COUNT)
			.forEach(
				element => (element.style.display = showsAll ? 'block' : 'none')
			);
		Array.from(allBrand)
			.slice(DEFAULT_VISIBLE_CATEGORY_COUNT)
			.forEach(element => (element.style.display = showsAll ? 'flex' : 'none'));

		const loadMoreButton = document.createElement('button');

		if (allCategoryBanner) {
			loadMoreButton.textContent = t(
				'mobile.pages.home.featuredContents.loadMore'
			);
			loadMoreButton.classList.add(String(styles.loadMoreButton));
			loadMoreButton.addEventListener('click', toggleShowAll);

			allCategoryBanner.parentElement?.insertBefore(
				loadMoreButton,
				allCategoryBanner
			);
		}

		if (showsAll || allCategoryTitle.length <= 2) {
			loadMoreButton.style.display = 'none';
		}

		return () => {
			loadMoreButton.removeEventListener('click', toggleShowAll);
			loadMoreButton.remove();
		};
	}, [ref, featuredContents, showsAll, t, toggleShowAll]);

	if (!featuredContents) {
		return null;
	}

	return (
		<div ref={ref}>
			<SectionHeading>
				{t('mobile.pages.home.featuredContents.heading')}
			</SectionHeading>
			<div
				className={legacyStyles.home}
				dangerouslySetInnerHTML={{ __html: featuredContents }}
			/>
		</div>
	);
};
FeaturedContents.displayName = 'FeaturedContents';
