import { Translation } from '@/i18n/types';
import { qnaOrder } from './QnaOrder/QnaOrder.i18n.ko';
import { qnaItem } from './QnaItem/QnaItem.i18n.ko';
import { qnaList } from './QnaList/QnaList.i18n.ko';
import { qnaInput } from './QnaInput/QnaInput.i18n.ko';
import { qnaConfirm } from './QnaConfirm/QnaConfirm.i18n.ko';
import { qnaReport } from './QnaReport/QnaReport.i18n.ko';

export const qna: Translation = {
	qnaTop: '지금 보는 상품의 기술 사양 문의하기',
	title: '상품 기술 사양 문의',
	qnaCount: '{{qnaCount}}건',
	alert: {
		first: '구매한 상품의 취소/반품은 주문이력 페이지에서 신청 가능합니다.',
		second:
			'상품문의 및 상품리뷰를 통해 취소나 환불, 반품은 처리되지 않습니다.',
		third:
			"해당상품과 관련없는 문의는 우측 상단 '문의하기' 를 이용 부탁드립니다.",
		fourth:
			'공개 게시판이므로 전화번호, 메일주소 등 고객님의 개인정보는 절대 기입하지 마시길 부탁 드립니다.',
	},
	qnaOrder,
	qnaList,
	qnaItem,
	qnaInput,
	qnaConfirm,
	qnaReport,
};
