import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState, VFC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './CategoryDescription.module.scss';

const LINE_CLAMP = 2;

type Props = {
	categoryDetail: string;
};

/** Category description component */
export const CategoryDescription: VFC<Props> = ({ categoryDetail }) => {
	const [t] = useTranslation();
	const [showReadMore, setShowReadMore] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const descriptionRef = useRef<HTMLDivElement>(null);

	const handleClickReadMore = (event: React.MouseEvent) => {
		event.preventDefault();
		setIsExpanded(prev => !prev);
	};

	const readMoreText = useMemo(() => {
		if (!showReadMore) {
			return '';
		}
		return isExpanded
			? t('pages.category.categoryDescription.close')
			: t('pages.category.categoryDescription.readMore');
	}, [isExpanded, showReadMore, t]);

	useEffect(() => {
		if (!descriptionRef.current) {
			return;
		}

		const paragraphLineHeight = getComputedStyle(
			descriptionRef.current
		).getPropertyValue('line-height');

		if (
			categoryDetail &&
			descriptionRef.current.clientHeight >
				Math.ceil(parseFloat(paragraphLineHeight) * LINE_CLAMP)
		) {
			setShowReadMore(true);
		}
	}, [categoryDetail]);

	return (
		<div
			className={classNames(styles.description, {
				[String(styles.limitContent)]: showReadMore,
				[String(styles.fitContent)]: isExpanded,
			})}
			ref={descriptionRef}
		>
			<Trans
				i18nKey="pages.category.categoryDescription.description"
				values={{ readMoreText }}
			>
				<span
					dangerouslySetInnerHTML={{
						__html: categoryDetail,
					}}
				/>

				<span
					className={classNames(styles.readMoreLink, {
						[String(styles.closeReadMore)]: isExpanded,
						[String(styles.readMore)]: !isExpanded,
						[String(styles.none)]: !showReadMore,
					})}
					onClick={handleClickReadMore}
				/>
			</Trans>
		</div>
	);
};
CategoryDescription.displayName = 'CategoryDescription';
