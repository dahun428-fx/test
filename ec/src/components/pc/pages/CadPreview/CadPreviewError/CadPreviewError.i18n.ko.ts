import { Translation } from '@/i18n/types';

export const cadPreviewError: Translation = {
	headword: {
		noSupportBrowser: '현재 브라우저에서는 이용할 수 없습니다.',
		unavailablePartNumber:
			'선택하신 형번의 CAD 데이터는 준비되어 있지 않습니다.',
		partNumberIncomplete:
			'형번이 확정되지 않아 CAD선택하신 형번으로는 CAD를 이용할 수 없습니다.',
	},
	primaryNote: {
		partNumberIncomplete:
			'※CAD다운로드 /3D미리보기를 진행하기 위해서는 형번이 확정된 상태여야 합니다.',
		unavailablePartNumberSinus:
			'선택하신 형번의 CAD 데이터는 준비되어 있지 않습니다.',
		noSupportBrowserSinus:
			'※선택하신 상품의 CAD 다운로드·3D 미리보기는 Internet Explorer 11.0이상, \nEdge, Chrome, Firefox를 이용해 주십시오.',
		unknownServerError:
			'미리보기 생성에 실패했습니다. 잠시 후 다시 이용해 주십시오.',
	},
	secondaryNote: {
		partNumberIncomplete:
			'「형번 옵션 선택」을 통해 형번 확정 후, CAD 다운로드/3D미리보기를 진행해주세요.',
	},
};
