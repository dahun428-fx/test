import classNames from 'classnames';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PageHeading.module.scss';

type Props = {
	children: string;
	className?: string;
};

/**
 * Page Heading
 */
export const PageHeading: React.VFC<Props> = ({ children, className }) => {
	const { t } = useTranslation();

	const pageHeadingRef = useRef<HTMLDivElement>(null);
	const pageHeadingBoxRef = useRef<HTMLDivElement>(null);
	const [showsReadMore, toggle] = useReducer(p => !p, false);
	/** catch copy is more than 3 lines or not */
	const [pageHeadingOverflow, setPageHeadingOverflow] = useState(false);

	useEffect(() => {
		if (pageHeadingRef.current && pageHeadingBoxRef.current) {
			setPageHeadingOverflow(
				pageHeadingRef.current.clientHeight >
					pageHeadingBoxRef.current.clientHeight
			);
		}
	}, []);

	return (
		<div
			ref={pageHeadingBoxRef}
			className={classNames(styles.pageHeadingBox, {
				[String(styles.readMorePageHeading)]: showsReadMore,
			})}
		>
			<div ref={pageHeadingRef}>
				<h1
					className={classNames(styles.heading, className)}
					dangerouslySetInnerHTML={{ __html: children }}
				/>
			</div>
			{pageHeadingOverflow && (
				<div
					className={
						showsReadMore ? styles.readHiddenButton : styles.readMoreButton
					}
					onClick={toggle}
				>
					{!showsReadMore && (
						<span className={styles.omittedText}>
							{t('mobile.pages.productDetail.pageHeading.more')}
						</span>
					)}
				</div>
			)}
		</div>
	);
};
PageHeading.displayName = 'PageHeading';
