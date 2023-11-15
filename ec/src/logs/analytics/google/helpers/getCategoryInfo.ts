import { ClassCode } from '@/logs/constants';

export function getCategoryClassName(categoriesLength: number) {
	const className: Record<number, string> = {
		1: 'Grand Categories',
		2: 'Large Categories',
		3: 'Middle Categories',
		4: 'Small Categories',
		5: 'Little Categories',
	};

	return className[categoriesLength];
}

export function getCategoryClassCode(categoriesLength: number) {
	const classCode: Record<number, ClassCode> = {
		1: ClassCode.GRAND_CATEGORY,
		2: ClassCode.LARGE_CATEGORY,
		3: ClassCode.MIDDLE_CATEGORY,
		4: ClassCode.SMALL_CATEGORY,
		5: ClassCode.LITTLE_CATEGORY,
	};

	return classCode[categoriesLength];
}

// TODO: Use Option from DisplayTypeSwitch instead of this function
export function getDisplayLayout(displayMethod: string | undefined) {
	if (!displayMethod) {
		return;
	}

	const displayLayout: Record<string, string> = {
		'1': 'List',
		'2': 'Photo',
		'3': 'Spec. Comparison',
	} as const;

	return displayLayout[displayMethod];
}
