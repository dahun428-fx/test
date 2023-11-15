import Link from 'next/link';
import React, { Fragment, useMemo } from 'react';
import styles from './DiscontinuedProduct.module.scss';
import { List } from './List';
import { Photo } from './Photo';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { config } from '@/config';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';
import { pagesPath } from '@/utils/$path';
import { date } from '@/utils/date';
import { convertToURLString } from '@/utils/url';

type Props = {
	displayType: DisplayTypeOption;
	series: Series;
	onClickAlternativeLink: (href: string, index: number) => void;
};

/** Discontinued product */
export const DiscontinuedProduct: React.VFC<Props> = ({
	displayType,
	series,
	onClickAlternativeLink,
}) => {
	const discontinuedDate = date(
		series.discontinuedDate,
		config.format.monthYear
	);

	const alternativeMessage = useMemo(() => {
		if (!series.alternativeMessage) {
			return null;
		}

		// Extract matches of all strings that match the pattern "<...>" from the raw alternative message.
		const matches = series.alternativeMessage.match(/<(.+?)>/g);
		if (!matches?.length) {
			return series.alternativeMessage;
		}

		const partNumbers = matches.map(match => match.slice(1, match.length - 1));

		// Split the raw alternative message text by the "<...>" pattern and map each sentence to a ReactNode element.
		return series.alternativeMessage.split(/[<>]/g).map((sentence, index) => {
			const href = pagesPath.vona2.result.$url({
				query: { Keyword: sentence },
			});

			// Return an anchor tag when there is at least one part number in the alternative message.
			if (partNumbers.includes(sentence)) {
				return (
					<Link key={index} href={href} passHref>
						<a
							className={styles.partNumberLink}
							onClick={() =>
								onClickAlternativeLink(convertToURLString(href), index)
							}
						>
							{sentence}
						</a>
					</Link>
				);
			}

			return <Fragment key={index}>{sentence}</Fragment>;
		});
	}, [onClickAlternativeLink, series.alternativeMessage]);

	const props = { series, discontinuedDate, alternativeMessage };

	if (displayType === DisplayTypeOption.LIST) {
		return <List {...props} />;
	}

	return <Photo {...props} />;
};
DiscontinuedProduct.displayName = 'DiscontinuedProduct';
