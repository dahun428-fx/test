import { useDispatch } from 'react-redux';
import { Qna as Presenter } from './Qna';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import {
	actions,
	selectQnaResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { useCallback, useState } from 'react';
import { SearchQnaRequest } from '@/models/api/qna/SearchQnaRequest';
import { QnaSortType } from '@/models/api/qna/SearchQnaResponse';
import { getPageSize, isAvailaleQnaState } from '@/utils/domain/qna';
import { useBoolState } from '@/hooks/state/useBoolState';
import {
	searchMyQnaCount,
	searchProductQnas,
	searchQnaInfo,
} from '@/api/services/qna/qna';
import { first } from '@/utils/collection';

type Props = {
	page?: number;
};

export const Qna: React.VFC<Props> = ({ page = 1 }) => {
	const dispatch = useDispatch();
	const auth = useSelector(selectAuth);
	const qnaResponse = useSelector(selectQnaResponse);
	const { seriesCode } = useSelector(selectSeries);

	const [searchQnaRequest, setSearchQnaRequest] = useState<SearchQnaRequest>({
		series_code: seriesCode,
		reg_id: auth.userCode ?? '',
		order_type: QnaSortType.ORDER_BY_DEFAULT,
		page_length: getPageSize(qnaResponse?.qnaConfig?.qnaState),
		page_no: page,
	});

	const [totalCount, setTotalCount] = useState<number>(
		qnaResponse?.qnaInfo?.qnaCnt ?? 0
	);

	const {
		bool: loading,
		setTrue: showLoading,
		setFalse: hideLoading,
	} = useBoolState();

	const reload = useCallback(
		async (request: Omit<SearchQnaRequest, 'series_code'>) => {
			try {
				showLoading();

				const productQnaResponse = await searchProductQnas({
					...searchQnaRequest,
					page_no: page,
					...request,
				});

				const qnaInfoResponse = await searchQnaInfo(
					seriesCode,
					auth.userCode ?? ''
				);

				dispatch(
					actions.updateQna({
						qnaData: productQnaResponse.data,
						qnaInfo: first(qnaInfoResponse.data),
					})
				);
				setSearchQnaRequest(prev => ({
					...prev,
					page_no: page,
					...request,
				}));

				//my qna
				if (
					request.order_type === QnaSortType.MY_QNA &&
					auth.authenticated &&
					auth.userCode
				) {
					const { data } = await searchMyQnaCount({
						reg_id: auth.userCode,
						series_code: seriesCode,
					});
					const { count } = first(data);
					setTotalCount(Number(count) ?? 0);
				} else if (request.order_type === QnaSortType.ORDER_BY_DEFAULT) {
					setTotalCount(qnaResponse?.qnaInfo?.qnaCnt ?? 0);
				}
			} catch (error) {
				//Noop
			} finally {
				hideLoading();
			}
		},
		[dispatch, hideLoading, page, searchQnaRequest, showLoading, auth]
	);

	if (!qnaResponse || !isAvailaleQnaState(qnaResponse.qnaConfig)) {
		return null;
	}

	const qnaState = qnaResponse.qnaConfig?.qnaState ?? 0;
	const qnaDetails = qnaResponse.qnaData ?? [];

	return (
		<Presenter
			seriesCode={seriesCode}
			loading={loading}
			authenticated={auth.authenticated}
			onReload={reload}
			page={searchQnaRequest.page_no ?? page}
			pageSize={searchQnaRequest.page_length ?? getPageSize(qnaState)}
			totalCount={totalCount ?? 0} // for pagination qna total count : myqna or all qna
			qnaState={qnaState}
			qnaDetails={qnaDetails}
			qnaCount={qnaResponse.qnaInfo?.qnaCnt ?? 0} // show total qna count from api data
		/>
	);
};

Qna.displayName = 'Qna';
