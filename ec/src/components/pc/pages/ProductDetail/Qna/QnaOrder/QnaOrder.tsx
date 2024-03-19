import { SearchQnaRequest } from '@/models/api/qna/SearchQnaRequest';
import styles from './QnaOrder.module.scss';
import { useTranslation } from 'react-i18next';
import { QnaSortType } from '@/models/api/qna/SearchQnaResponse';
import { useCallback, useMemo, useState } from 'react';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { selectAuth } from '@/store/modules/auth';
import { useSelector } from '@/store/hooks';
import classNames from 'classnames';
import { Button } from '@/components/pc/ui/buttons';
import { openSubWindow } from '@/utils/window';
import { url } from '@/utils/url';

type Props = {
	seriesCode: string;
	loading: boolean;
	authenticated: boolean;
	qnaState: number;
	onReload: (request: Omit<SearchQnaRequest, 'series_code'>) => Promise<void>;
};

export const QnaOrder: React.VFC<Props> = ({
	authenticated,
	loading,
	onReload,
	qnaState,
	seriesCode,
}) => {
	const auth = useSelector(selectAuth);
	const [t] = useTranslation();
	const showLoginModal = useLoginModal();
	const [isMyQna, setIsMyQna] = useState<boolean>(false);

	const onClickQnaWriteHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}
		if (!auth.userCode) {
			return;
		}

		openSubWindow(url.qnasInput(seriesCode, qnaState), 'qna_input', {
			height: 600,
			width: 700,
		});
		(window as any).onQnaReload = async () =>
			await onReload({
				page_no: 1,
			});
	}, [auth, onReload, openSubWindow, showLoginModal]);

	const onClickSort = useCallback(
		async (sortType: QnaSortType) => {
			if (loading) {
				return;
			}
			if (sortType === QnaSortType.MY_QNA) {
				if (!authenticated) {
					const result = await showLoginModal();
					if (result !== 'LOGGED_IN') {
						setIsMyQna(false);
						return;
					}
				}
				if (!auth.userCode) {
					setIsMyQna(false);
					return;
				}
			}

			await onReload({
				order_type: sortType,
				reg_id: auth.userCode ?? '',
			});
		},
		[isMyQna, auth, loading]
	);

	return (
		<div className={styles.containerWrap}>
			<span className={styles.sort}>
				<span
					className={classNames(isMyQna ? styles.active : '')}
					onClick={() => {
						setIsMyQna(prev => !prev);
						onClickSort(
							isMyQna ? QnaSortType.ORDER_BY_DEFAULT : QnaSortType.MY_QNA
						);
					}}
				>
					{t('pages.productDetail.qna.qnaOrder.myQna')}
				</span>
			</span>
			<Button
				size="m"
				theme="strong"
				className={styles.writeButton}
				icon="apply-sample"
				onClick={onClickQnaWriteHandler}
			>
				{t('pages.productDetail.qna.qnaOrder.writeQna')}
			</Button>
		</div>
	);
};

QnaOrder.displayName = 'QnaOrder';
