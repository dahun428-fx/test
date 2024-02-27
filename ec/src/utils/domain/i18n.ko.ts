import { Translation } from '@/i18n/types';

export const domain: Translation = {
	express: {
		deadlineTime: 'Order Deadline - {{time}}',
	},
	quantity: {
		isNullWarning: 'Enter Quantity',
		notIntegerWarning: 'Enter 1 or an integer larger than 1 for the quantity.',
		minQuantityWarning:
			'Minimum order quantity is {{minQuantity}}. Please increase your quantity to {{minQuantity}} or more.',
		minQuantityPackWarning:
			'Minimum order quantity is {{minQuantity}} pack. Please increase your quantity to {{minQuantity}} pack or more.',
		orderUnitWarning:
			'Must be purchased in units of {{orderUnit}}. Please enter a quantity in multiples of {{orderUnit}}.',
		orderUnitPackWarning:
			'Must be purchased in units of {{orderUnit}} pack. Please enter a quantity in multiples of {{orderUnit}}.',
	},
	series: {
		piecePerPackage: '{{piecePerPackage}} Pieces Per Package',
		piecePerPackageWithRange: '{{min}}-{{max}} Pieces Per Package',
	},
	daysToShip: {
		sameDay: 'Same day',
		someDays: `{{days}} Day(s)`,
		shippedSameDay: 'Same-day shipment',
		shipToday: 'Shippable Today',
		needsEstimate: 'Need a quote',
		withInDays: '{{days}} Day(s) or Less',
		all: 'All',
		others: 'Others',
	},
	partNumber: {
		nPieces: '{{n}} Piece(s)',
		nPacks: '{{n}} Pack(s)',
		piecesPerPackage: '{{piecesPerPackage}} Pieces Per Package',
		empty: 'Enter PartNumber.',
		invalidCharacter:
			'Please enter the model number using half-width (single-byte) letters.',
	},
	punchout: {
		error: 'Purchase Linkage Error',
		includesInvalidCharacter:
			'Product number has wrong characters.\nIf you have any questions, please inquire to the person in charge of purchasing.',
		// メッセージが変だが、ect-web-my の通り。
		// The message is strange, but the same as ect-web-my.
		exceedsMaxCheckoutCount:
			'Cart exceeds the number of items allowed for Check Out. Please re-select',
	},
	spec: {
		notNumericalStringError: 'Enter the numerical value.',
		tooManyDecimalPlacesError:
			'The input value can be specified down to the fourth decimal place.',
		outOfRangeError: 'Enter a value matching range condition.',
	},
	brand: {
		brandList: 'Brand List',
		titlePage: 'Page {{page}}',
	},
	category: {
		titlePage: 'Page {{page}}',
	},
	departmentCode: {
		mech: 'smc, 오토닉스, 마이크로미터, 베어링, 경첩, 바퀴, 서보모터, 모터, 기어, spg, 캐스터, 힌지, 커넥터, 체인, 컨베이어 벨트, 오링, 플랜지, 노브, 가스켓, 롤러, 전자석, 풀리, 감속기, 레일, 손잡이, 근접센서, 유니락, 유압실린더, 웜기어, 타이밍벨트, 커플러, 베벨기어, 압력계, 리미트 스위치, 스페이서, 볼스크류, 유니버셜 조인트, 포토센서, 볼베어링, 온도조절기, lm가이드, 방진패드, 로크너트, 스마토, 스러스트 베어링, 널링, 방진고무, 오일씰, o-ring, 매미고리, 접시머리볼트, 원터치 피팅, 스프링핀, 고무발, 슬라이드 레일, DU BUSH, O링, 가스스프링, 알루미늄 프레임, 조절좌, 랙기어, 인장스프링, 진공패드, 아이들러, 압축스프링, 스프링, 프로파일, 클램프, 샤프트, 핀, 커플링, 핸들, 우레탄, 피팅',
		mech_screw:
			'볼트, 나사, 육각렌치, 너트, 와셔, 인서트, 아이볼트 ,스냅링, 헬리코일, 육각볼트, 렌치볼트, 평와셔',
		mech_material: '파이프',
		el_wire: '덕트, 스마토',
		el_control: '오토닉스, 단자대, 스마토',
		fs_machining: '대구텍, 엔드밀, 스마토',
		fs_processing: '자바라, 대구텍, 토크렌치, 노즐, 다이얼게이지, 스마토',
		fs_logistics: '샤클, 스마토',
		fs_health: '펌프, 스마토',
		fs_lab: '스마토',
		press: '와이어, 리테이너, 가스스프링, 평행핀',
		mold: '노즐, 유압실린더',
		injection: '노즐',
	},
	desciption: {
		fix: 'FA, 금형, 배선, 공구, 소모성 MRO자재, 4천개 브랜드 취급, CAD 데이터 및 설계 사례 제공, 도면 특주 제작 서비스, 무료배송',
	},
};
