import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './QuoteHistory.module.scss';
import type { Quote } from '@/components/mobile/pages/Home/PersonalContents/PersonalContents.hooks';
import { NagiLink } from '@/components/mobile/ui/links';
import { CurrencyProvider, Price } from '@/components/mobile/ui/text/Price';
import { date } from '@/utils/date';
import { url } from '@/utils/url';

type Props = {
	/** 見積履歴リスト */
	quoteList: Quote[];
	/** 通貨コード */
	currencyCode?: string;
};

/**
 * 見積履歴
 */
export const QuoteHistory: React.VFC<Props> = ({ quoteList, currencyCode }) => {
	/** translator */
	const [t] = useTranslation();
	// TODO: wos パラメータ lang を、ヘッダーで指定した言語にする (en)
	const lang = 'en';

	return (
		<div className={styles.quoteHistoryBox}>
			<div className={styles.quoteHistory}>
				<div className={styles.quoteHistoryTitle}>
					{t('mobile.pages.home.orderStatusPanel.quoteHistoryTitle')}
				</div>
				<div className={styles.quoteHistoryAside}>
					<NagiLink href={url.wos.quote.history({ lang })}>
						{t('mobile.pages.home.orderStatusPanel.seeMore')}
					</NagiLink>
				</div>
			</div>
			{quoteList?.length === 0 ? (
				<div className={styles.noHistoryData}>
					{t('mobile.pages.home.orderStatusPanel.noQuoteHistory')}
				</div>
			) : (
				<div className={styles.quoteHistoryMain}>
					<div>
						<table className={styles.historyTable}>
							<thead>
								<tr>
									<th className={styles.historyTableHead}>
										{t('mobile.pages.home.orderStatusPanel.quoteDate')}
									</th>
									<th className={styles.historyTableHead}>
										{t(
											'mobile.pages.home.orderStatusPanel.quoteSlipNumberWithItemCount'
										)}
									</th>
									<th className={styles.historyTableHead}>
										{t('mobile.pages.home.orderStatusPanel.totalPrice')}
									</th>
									<th className={styles.historyTableHead}>
										{t('mobile.pages.home.orderStatusPanel.statusMessage')}
									</th>
								</tr>
							</thead>
							<tbody>
								<CurrencyProvider ccyCode={currencyCode}>
									{quoteList.map((history, index) => (
										<tr key={`${history.quoteSlipNumber ?? ``}-${index}`}>
											<td className={styles.historyData}>
												{date(history.quoteDate)}
											</td>
											<td className={styles.historyData}>
												{history.quoteSlipNumber && (
													<NagiLink
														href={url.wos.quote.historyDetail(
															{ lang },
															history.quoteSlipNumber
														)}
													>
														{history.quoteSlipNumber}({history.quoteItemCount})
													</NagiLink>
												)}
											</td>
											<td className={styles.historyData}>
												{history.totalPrice ? (
													<Price value={history.totalPrice} />
												) : (
													'---'
												)}
											</td>
											<td
												className={classNames(styles.historyData, {
													[String(styles.textRed)]: history.status === '2',
												})}
											>
												{history.statusMessage}
											</td>
										</tr>
									))}
								</CurrencyProvider>
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};
QuoteHistory.displayName = 'QuoteHistory';
