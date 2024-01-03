import { Translation } from '@/i18n/types';
//components.ui.layouts.footers.stackBalloon.message.progress
export const stackBalloon: Translation = {
	title: 'CAD 다운로드',
	downloadPending: '다운로드 대기',
	downloadComplete: '다운로드 완료',
	downloadFail: '다운로드 실패',
	downloadProgress: '다운로드 중',
	totalPreffix: '총',
	totalSuffix: '건',
	choosedSuffix: '건 선택',
	selectAll: '전체 선택',
	delete: '삭제',
	noCadData: 'CAD 데이터가 없습니다',
	cadHistory: 'CAD 다운로드 이력조회',
	close: '닫기',
	complete: '완료',
	downloadButton: '다운로드',
	message: {
		common: {
			yes: '예',
			no: '아니오',
		},
		download: {
			progress: '다운로드 진행 중입니다.',
			reject: '다운로드 할 데이터를 선택하여 주세요.',
		},
		delete: {
			choice: '삭제할 데이터를 선택하세요.',
			confirm: '선택한 데이터 {{length}}건을 삭제하시겠습니까?',
		},
		progress: '다운로드 진행 중입니다. 잠시 후 다시 시도하세요.',
		error: {
			system: '시스템 오류가 발생했습니다. 잠시 후 다시 이용해 주십시오.',
		},
	},
};
