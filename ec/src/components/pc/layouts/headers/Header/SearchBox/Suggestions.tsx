import classNames from 'classnames';
import React from 'react';
import styles from './Suggestions.module.scss';
import { Suggestion } from './types';
import { NagiLink } from '@/components/pc/ui/links';
import { BlockLoader } from '@/components/pc/ui/loaders/BlockLoader';

type Props = {
	title: string;
	cursor: number;
	suggestionList: Suggestion[];
	loading?: boolean;
	className?: string;
};

/**
 * Suggestion list.
 */
export const Suggestions: React.VFC<Props> = ({
	title,
	cursor,
	suggestionList,
	loading,
	className,
}) => {
	if (!loading && !suggestionList.length) {
		return null;
	}

	return (
		<dl className={classNames(styles.container, className)}>
			<dt className={styles.title}>{title}</dt>
			<dd>
				<ul>
					{/* REVIEW: ローダーの表現は見直してもよいかもしれない */}
					{!suggestionList.length && loading ? (
						<BlockLoader />
					) : (
						suggestionList.map(
							(
								{
									keyword,
									label,
									href,
									onClick,
									disabled,
									sendClickLog,
									sendGAClickLog,
									sendGAImpressionLog,
								},
								index
							) => (
								<li key={`${keyword}:${index}`} className={styles.linkWrapper}>
									<NagiLink
										className={styles.link}
										aria-selected={cursor === index}
										href={href ?? ''}
										onClick={event => {
											sendClickLog?.();
											sendGAClickLog?.();
											onClick?.(event);
										}}
										onMouseEnter={sendGAImpressionLog}
										disabled={disabled}
									>
										{label ?? keyword}
									</NagiLink>
								</li>
							)
						)
					)}
				</ul>
			</dd>
		</dl>
	);
};
Suggestions.displayName = 'Suggestions';
