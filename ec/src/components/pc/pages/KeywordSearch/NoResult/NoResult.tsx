import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NoResult.module.scss';
import keywordSuggestionsImage from './assets/images/keyword-suggestions.png';
import partNumberSuggestionsImage from './assets/images/part-number-suggestions.png';

type Props = {
	hitCount?: number;
};

/**
 * No Search Result
 */
export const NoResult: React.VFC<Props> = ({ hitCount }) => {
	const { t } = useTranslation();

	if (hitCount == undefined || hitCount > 0) {
		return null;
	}
	return (
		<div>
			<p className={styles.notice}>
				{t('pages.keywordSearch.noResult.notice')}
			</p>
			<div className={styles.messageBox}>
				<h2 className={styles.heading}>
					<span className={styles.info}>(i)</span>
					{t('pages.keywordSearch.noResult.heading')}
				</h2>
				<ol>
					<li className={styles.reviewPoint}>
						<span className={styles.itemNumber}>1.</span>
						{t('pages.keywordSearch.noResult.tip1')}
						<br />
						{t('pages.keywordSearch.noResult.typoExample')}
					</li>
					<li className={styles.reviewPoint}>
						<span className={styles.itemNumber}>2.</span>
						{t('pages.keywordSearch.noResult.tip2')}
						<div className={styles.examples}>
							<dl className={styles.example}>
								<dt>
									{t('pages.keywordSearch.noResult.partNumberSuggestExample')}
								</dt>
								<dd>
									<Image
										src={partNumberSuggestionsImage}
										alt={t(
											'pages.keywordSearch.noResult.partNumberSuggestExample'
										)}
										width={550}
										height={357}
									/>
								</dd>
							</dl>
							<dl className={styles.example}>
								<dt>
									{t('pages.keywordSearch.noResult.keywordSuggestExample')}
								</dt>
								<dd>
									<Image
										src={keywordSuggestionsImage}
										alt={t(
											'pages.keywordSearch.noResult.keywordSuggestExample'
										)}
										width={550}
										height={356}
									/>
								</dd>
							</dl>
						</div>
					</li>
				</ol>
			</div>
		</div>
	);
};
