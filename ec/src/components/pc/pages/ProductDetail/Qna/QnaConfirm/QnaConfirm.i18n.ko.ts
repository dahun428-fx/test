import { Translation } from '@/i18n/types';

export const qnaConfirm: Translation = {
	title: '상품 기술 사양 문의 수정',
	usePurpose: '제목',
	usePurposeLength: '/30자',
	assist:
		'주문/견적/재고/배송결제/세금계산서/성적증명서가 필요하신 분은 <0></0><1>여기를 클릭</1>해서 확인해주십시오.',
	partNo: '<0>(필수)</0> 형번을 입력해주세요.',
	partNoInfo:
		'※ 상품의 형번을 기입해주시면 더욱 빠르게 답변을 받아보실 수 있습니다.',
	partNoLength: '/100자',
	question: '<0>(필수)</0> 어떤 점이 궁금하신가요?',
	questionLength: '/10자~1000자',
	infoList: {
		first:
			'상품과 무관한 내용, 상대방에 대한 욕설, 비방, 명예훼손, 불성실한 내용, 반복문자, 특정효능에 있어 오해의 소지가 있는 내용을 담고 있는 경우 통보없이 삭제될 수 있습니다.',
		second:
			'회원님의 E-MAIL, 휴대폰과 같은 개인정보의 입력은 금지되어 있으며, 발생하는 모든 피해에 대해 한국 미스미는 책임지지 않습니다.',
		third: '게시글과 관련된 저작권침해에 대한 책임은 본인에게 있습니다.',
		fourth:
			'게시글은 다른 유저들에게도 공개 되므로 개인정보는 절대 기입하지 않길 부탁드립니다.',
	},
	add: '등록',
	close: '닫기',
	message: {
		partNoNeed: "'형번을 입력해주세요' 를 입력 하여 주세요.",
		questionNeed: "'어떤 점이 궁금하신가요?' 를 입력 하여 주세요.",
		questionLengthNotAvailable:
			"'어떤 점이 궁금하신가요?'의 경우 10자 이상을 입력하여 주셔야 합니다.",
		systemError:
			'죄송합니다. 시스템 에러가 발생하였습니다. 잠시후에 다시한번 시도 부탁드립니다.',
		slang: '{{slang}} 금지어를 입력하실 수 없습니다.',
		close: '닫기',
	},
};
