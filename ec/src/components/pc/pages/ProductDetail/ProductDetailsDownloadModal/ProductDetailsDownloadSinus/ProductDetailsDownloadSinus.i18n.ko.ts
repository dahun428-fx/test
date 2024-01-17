import { Translation } from '@/i18n/types';

export const productDetailsDownloadSinus: Translation = {
	fileFormatLabel: '파일형식',
	loadingTitle: 'CAD데이터 생성중',
	loadingMessage:
		'CAD데이터 생성에는 약 {{ estimatedTime }}초가 걸립니다.<0></0>생성완료까지 잠시 기다려 주십시오.',
	error: {
		noSupportBrowser: {
			title: 'CAD 데이터 다운로드는 현재 브라우저에서는 이용할 수 없습니다.',
			messageOne:
				'※CAD 데이터 다운로드는 Internet Explorer 11.0이상, Edge, Chrome, Firefox를 이용해 주십시오.',
			messageTwo:
				'상품정보만 다운로드 할 경우에는 「ZIP파일 다운로드」 버튼을 클릭해 주십시오.',
		},
		notResolved: {
			messageOne: '이 제품의 ZIP 파일은 CAD 파일은 포함되지 않습니다.',
		},
		generatedFailed: {
			messageOne: 'CAD 데이터 생성에 실패했습니다.',
			messageTwo:
				'잠시 후 다시 이용해 주시거나, 상품정보만 다운로드 할 경우에는 「ZIP파일 다운로드」 버튼을 클릭해 주십시오.',
		},
	},
};
