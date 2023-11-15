import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStandardSpecList } from './StandardSpecList.hooks';
import styles from './StandardSpecList.module.scss';
import { StandardSpecList as SpecList } from '@/components/mobile/pages/ProductDetail/StandardSpecList';
import { Collapsible } from '@/components/mobile/ui/collapsible';
import { removeDiscountFromPictList } from '@/utils/domain/pict';

/**
 * Standard spec list
 */
export const StandardSpecList: React.FC = () => {
	const [t] = useTranslation();
	const { standardSpecList, series } = useStandardSpecList();

	const pictList = useMemo(() => {
		if (!series.pictList) {
			return [];
		}
		return removeDiscountFromPictList(series.pictList);
	}, [series.pictList]);

	if (!pictList.length && !standardSpecList.length) {
		return null;
	}

	return (
		<Collapsible
			theme="section"
			title={t('mobile.pages.productDetail.templates.simple.basicInformation')}
		>
			<ul className={styles.container}>
				{pictList.length > 0 && (
					<li className={styles.specWrapper}>
						<dl className={styles.spec}>
							<dt className={styles.specName}>
								{t(
									'mobile.pages.productDetail.templates.simple.specifications'
								)}
							</dt>
							<dd>
								<ul>
									{pictList.map((pict, index) => (
										<li key={index} className={styles.pictValue}>
											{pict.pict}
										</li>
									))}
								</ul>
							</dd>
						</dl>
					</li>
				)}
			</ul>
			<SpecList />
		</Collapsible>
	);
};
StandardSpecList.displayName = 'StandardSpecList';
