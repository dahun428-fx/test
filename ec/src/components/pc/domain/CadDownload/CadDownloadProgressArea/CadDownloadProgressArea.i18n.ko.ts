import { Translation } from '@/i18n/types';

export const cadDownloadProgressArea: Translation = {
	cadIdNormal: '{{grp}} | {{formatText}}{{versionText}}',
	cadIdOthers: '{{grp}} | 기타 | {{formatOthersText}}{{versionText}}',
	totalCount: '총 <0>{{count}}</0> 건',
	selectCount: '<0>{{count}}</0> 건 선택',
	totalSelect: '전체 선택',
	delete: '삭제',
	noCadData: 'CAD 데이터가 없습니다',
	download: '즉시 다운로드',
	putsth: '담기',
	close: '닫기',
	notice: '담기 유효시간은 24시간입니다.',
	message: {
		noData: '데이터를 선택하세요.',
		noDelete: '삭제할 데이터를 선택하세요.',
		noAdd: '더 이상 담을 수 없습니다. CAD 데이터 다운로드 후 다시 시도하세요.',
	},
};
