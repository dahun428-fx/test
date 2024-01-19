import { Translation } from '@/i18n/types';

export const cadDownloadError: Translation = {
	notFixedPartNumberError: {
		message:
			'형번이 확정되지 않아 CAD 다운로드 및 3D 미리보기를 이용할 수 없습니다.',
		guide: `※CAD다운로드·3D미리보기를 진행하기 위해서는 형번이 확정된 상태여야 합니다.<0></0>좌측의 「형번 옵션 선택」을 통해 형번 확정 후, CAD 다운로드·3D미리보기를 진행해 주세요.`,
	},
	ie11: {
		message: '현재 브라우저에서는 이용할 수 없습니다.',
		guide:
			'※선택하신 상품의 CAD 다운로드·3D 미리보기는 Internet Explorer 11.0이상, \nEdge, Chrome, Firefox를 이용해 주십시오.',
	},
	notAvailable: {
		message: '선택하신 형번의 CAD 데이터는 준비되어 있지 않습니다.',
		guide: '번거로우시겠지만 다시 선택해 주십시오.',
	},
};
