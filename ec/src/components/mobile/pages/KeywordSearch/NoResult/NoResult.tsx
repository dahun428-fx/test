import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NoResult.module.scss';
import keywordSuggestionsImage from './assets/images/keyword-suggestions.png';
import partNumberSuggestionsImage from './assets/images/part-number-suggestions.png';
import { Section } from '@/components/mobile/pages/KeywordSearch/Section/Section';

type Props = {
	hitCount?: number;
};

/**
 * No Search Result
 */
export const NoResult: React.VFC<Props> = ({ hitCount }) => {
	const [t] = useTranslation();

	if (hitCount == undefined || hitCount > 0) {
		return null;
	}

	return (
		<>
			<p className={styles.notice}>
				{t('mobile.pages.keywordSearch.noResult.notice')}
			</p>
			<Section heading={t('mobile.pages.keywordSearch.noResult.title')}>
				<ol className={styles.list}>
					<li className={styles.reviewPoint}>
						<span className={styles.itemNumber}>1.</span>
						<strong>{t('mobile.pages.keywordSearch.noResult.tip1')}</strong>
						<br />
						{t('mobile.pages.keywordSearch.noResult.typoExample')}
					</li>
					<li className={styles.reviewPoint}>
						<span className={styles.itemNumber}>2.</span>
						<strong>{t('mobile.pages.keywordSearch.noResult.tip2')}</strong>
						<dl className={styles.example}>
							<dt>
								{t(
									'mobile.pages.keywordSearch.noResult.partNumberSuggestExample'
								)}
							</dt>
							<dd>
								<Image
									src={partNumberSuggestionsImage}
									alt={t(
										'mobile.pages.keywordSearch.noResult.partNumberSuggestExampleAltImage'
									)}
									width={400}
									height={330}
								/>
							</dd>
						</dl>
						<dl className={styles.example}>
							<dt>
								{t('mobile.pages.keywordSearch.noResult.keywordSuggestExample')}
							</dt>
							<dd>
								<Image
									src={keywordSuggestionsImage}
									alt={t(
										'mobile.pages.keywordSearch.noResult.keywordSuggestExampleAltImage'
									)}
									width={400}
									height={170}
								/>
							</dd>
						</dl>
					</li>
				</ol>
			</Section>
		</>
	);
};
