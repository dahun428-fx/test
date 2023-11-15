import { TFunction, TFunctionResult } from 'i18next';

const Category = {
	/** mech (top category code)  */
	MECH: 'mech',
	/** mech_screw (top category code)  */
	MECH_SCREW: 'mech_screw',
	/** mech_material (top category code) */
	MECH_MATERIAL: 'mech_material',
	/** fs_logistics (top category code) */
	FS_LOGISTICS: 'fs_logistics',
	/** fs_health (top category code) */
	FS_HEALTH: 'fs_health',
	/** fs_lab (top category code) */
	FS_LAB: 'fs_lab',
	/** fs_machining (top category code) */
	FS_MACHINING: 'fs_machining',
	/**  fs_processing (top category code) */
	FS_PROCESSING: 'fs_processing',
	/**  press (top category code) */
	PRESS: 'press',
	/**  mold (top category code) */
	MOLD: 'mold',
	/**  injection (top category code) */
	INJECTION: 'injection',
	/**  el_wire (top category code)  */
	EL_WIRE: 'el_wire',
	/**   el_control (top category code) */
	EL_CONTROL: 'el_control',
} as const;
type Category = typeof Category[keyof typeof Category];

const TopCategoryGroup = {
	/** Pattern that top category code is mech/mech_screw/mech_material */
	GROUP_01: '1',
	/** Pattern that top category code is fs_logistics/fs_health/fs_lab */
	GROUP_02: '2',
	/** Pattern that top category code is fs_machining/fs_processing */
	GROUP_03: '3',
	/** Pattern that top category code is press/mold/injection */
	GROUP_04: '4',
	/** Pattern that top category code is  el_wire/el_control */
	GROUP_05: '5',
} as const;
type TopCategoryGroup = typeof TopCategoryGroup[keyof typeof TopCategoryGroup];

export function getDepartmentKeywords(departmentCode: string, t: TFunction) {
	const departments: Record<string, TFunctionResult> = {
		mech: t('utils.domain.departmentCode.mech'),
		el: t('utils.domain.departmentCode.el'),
		fs: t('utils.domain.departmentCode.fs'),
		mold: t('utils.domain.departmentCode.mold'),
		press: t('utils.domain.departmentCode.press'),
	};
	return (departments[departmentCode] as string) ?? '';
}

export function verifyTopCategoryGroup(
	topCategoryCode: string | undefined,
	topCategoryGroup: string
) {
	let group = '';
	const {
		MECH,
		MECH_SCREW,
		MECH_MATERIAL,
		FS_LOGISTICS,
		FS_HEALTH,
		FS_LAB,
		FS_MACHINING,
		FS_PROCESSING,
		PRESS,
		MOLD,
		INJECTION,
		EL_WIRE,
		EL_CONTROL,
	} = Category;

	const { GROUP_01, GROUP_02, GROUP_03, GROUP_04, GROUP_05 } = TopCategoryGroup;

	switch (topCategoryCode) {
		case MECH:
		case MECH_SCREW:
		case MECH_MATERIAL:
			group = GROUP_01;
			break;
		case FS_LOGISTICS:
		case FS_HEALTH:
		case FS_LAB:
			group = GROUP_02;
			break;
		case FS_MACHINING:
		case FS_PROCESSING:
			group = GROUP_03;
			break;
		case PRESS:
		case MOLD:
		case INJECTION:
			group = GROUP_04;
			break;
		case EL_WIRE:
		case EL_CONTROL:
			group = GROUP_05;
			break;
	}
	return group === topCategoryGroup;
}

export function getDescriptionMessage(
	messages: string[],
	topCategoryCode?: string
) {
	const groupIndex = messages.findIndex((message, index) =>
		verifyTopCategoryGroup(topCategoryCode, `${index + 1}`)
	);
	return messages[groupIndex] ?? '';
}
