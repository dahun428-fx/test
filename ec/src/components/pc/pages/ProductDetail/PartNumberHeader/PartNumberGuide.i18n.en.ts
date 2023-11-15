import { Translation } from '@/i18n/types';

export const partNumberGuide: Translation = {
	unsettled:
		'<0><0>Not validated yet. </0><1>There are <0>{{totalCount}}</0> candidates.</1></0>',
	noSuitableCandidates: 'There were no matching candidates found.',
	noItemSelect:
		'<0><0>{{totalCount}}</0> Item has not been selected. <1>Please select from <0>Part number list</0> or validate the part number by selecting the specifications</1></0>',
	unfixedSpecMessage:
		'<0>Please validate the part number by selecting from <0>Part number list</0>.</0>',
};
