import { Translation } from '@/i18n/types';

export const reviewReport: Translation = {
	title: '상품리뷰 신고',
	dangerList: {
		first: '신고 하신 글은 관리자 확인 후 노출이 제한 됩니다.',
		second:
			'허위신고 하신 경우 신고자에 대한 제한이 이루어 질 수 있음으로 신고 전 신중하게 재고하여 주시기 바랍니다.',
	},
	declareTitle: '<0>(필수)</0> 신고하시는 사유가 무엇인가요?',
	declareTextLength: '/30자',
	message: {
		systemError:
			'죄송합니다. 시스템 에러가 발생하였습니다. 잠시후에 다시한번 시도 부탁드립니다.',
		notChecked: '신고 사유를 선택하세요.',
		notContent: '기타를 선택 하신 경우 사유를 입력 하여 주세요.',
	},
	report: '신고',
	close: '닫기',
};
