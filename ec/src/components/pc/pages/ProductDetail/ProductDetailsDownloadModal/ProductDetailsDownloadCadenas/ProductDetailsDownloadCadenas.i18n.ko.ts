import { Translation } from '@/i18n/types';

export const productDetailsDownloadCadenas: Translation = {
	loadingTitle: 'CAD데이터 생성중',
	loadingMessage:
		'CAD데이터 생성에는 약 {{ estimatedTime }}초가 걸립니다.<0></0>생성완료까지 잠시 기다려 주십시오.',
	error: {
		notResolved: {
			noZipFile: '이 제품의 ZIP 파일은 CAD 파일은 포함되지 않습니다.',
			alternativeLink: '선택하신 형번으로는 CAD를 이용할 수 없습니다.',
			cadConfigurator: '[CAD/형번생성 서비스]로부터 지정',
		},
		noCadData: {
			title: '선택하신 형번으로는 CAD를 이용할 수 없습니다.',
			message:
				'불편을 드려 죄송합니다 다시 선택하여 주십시오. <0>이곳</0>에서 확인하여 주십시오.',
		},
	},
};
