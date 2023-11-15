import React, { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DiscontinuedAsideCell.module.scss';
import { Link } from '@/components/pc/ui/links';
import { config } from '@/config';
import { pagesPath } from '@/utils/$path';
import { date } from '@/utils/date';
import { convertToURLString } from '@/utils/url';

type Props = {
	discontinuedDate?: string;
	alternativeMessage?: string;
	onClickAlternativeLink: (href: string) => void;
};

/**
 * Discontinued Part Number Type Aside
 */
export const DiscontinuedAsideCell: React.VFC<Props> = ({
	discontinuedDate,
	alternativeMessage: rawAlternativeMessage,
	onClickAlternativeLink,
}) => {
	const { t } = useTranslation();
	const discontinuedYearMonth = date(discontinuedDate, config.format.monthYear);

	const alternativeMessage = useMemo(() => {
		if (!rawAlternativeMessage) {
			return null;
		}
		const matches = rawAlternativeMessage.match(/<(.+?)>/g);
		if (!matches || !matches.length) {
			return rawAlternativeMessage;
		}
		const partNumbers = matches.map(match => match.slice(1, match.length - 1));

		return rawAlternativeMessage.split(/[<>]/g).map((sentence, index) => {
			const href = pagesPath.vona2.result.$url({
				query: { Keyword: sentence },
			});

			return partNumbers.includes(sentence) ? (
				<Link
					key={index}
					href={href}
					onClick={() => onClickAlternativeLink(convertToURLString(href))}
				>
					{sentence}
				</Link>
			) : (
				<Fragment key={index}>{sentence}</Fragment>
			);
		});
	}, [onClickAlternativeLink, rawAlternativeMessage]);

	return (
		<td className={styles.discontinuedDataCell} colSpan={2}>
			<div className={styles.discontinueMessageBox}>
				{discontinuedYearMonth && (
					<p>
						{t('pages.keywordSearch.partNumberTypeList.discontinuedYearMonth', {
							yearMonth: discontinuedYearMonth,
						})}
					</p>
				)}
				<p>{alternativeMessage}</p>
			</div>
		</td>
	);
};
