import { PUSpecViewType } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import { Flag } from '@/models/api/Flag';
import { OpenCloseType } from '@/models/api/constants/OpenCloseType';
import {
	SpecValueRange,
	SpecViewType as PartNumberSpecViewType,
	SupplementType,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SpecViewType as SeriesSpecViewType } from '@/models/api/msm/ect/series/SearchSeriesResponse';
type ValueOf<T> = T[keyof T];

export type NormalizedSpec = {
	specCode: string;
	specName: string;
	specUnit?: string;
	specViewType:
		| PartNumberSpecViewType
		| SeriesSpecViewType
		| ValueOf<typeof PUSpecViewType>;
	supplementType?: SupplementType;
	specImageUrl?: string;
	detailHtml?: string;
	specDescriptionImageUrl?: string;
	specNoticeText?: string;
	numericSpec?: NumericSpec;
	specValueList: SpecValue[];
	openCloseType?: OpenCloseType;
	selectedFlag?: Flag;
	refinedFlag?: Flag;
};

export type NumericSpec = {
	hiddenFlag: Flag;
	specValue?: string;
	specValueRangeList: SpecValueRange[];
};

export type SpecValue = {
	specValue: string;
	specValueDisp: string;
	specValueImageUrl?: string;
	hiddenFlag: Flag;
	selectedFlag: Flag;
	childSpecValueList?: ChildSpecValue[];
	defaultFlag: Flag;
};

export type ChildSpecValue = {
	specValue: string;
	specValueDisp: string;
	hiddenFlag: Flag;
	selectedFlag: Flag;
};

export type SendLogPayload = {
	specName: string;
	specValueDisp: string;
	selected: boolean;
};
