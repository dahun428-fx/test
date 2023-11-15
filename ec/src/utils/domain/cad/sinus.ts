import { Flag } from '@/models/api/Flag';
import {
	AlterationSpec,
	PartNumber,
	PartNumberSpecValue,
	Spec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { getIEVersion, isChrome, isEdge, isFirefox } from '@/utils/device';

type GetSpecValueListPayload = {
	partNumber: PartNumber;
	specList?: Spec[];
};

type GetAlterationSpecListPayload = {
	alterationSpecList: AlterationSpec[];
};

export type SpecValue = {
	specCADCode: string | undefined;
	specCADValue: string | undefined;
};

/**
 * Return specValueList for SINUS API request
 */
export const getSpecValueList = ({
	specList,
	partNumber,
}: GetSpecValueListPayload): SpecValue[] =>
	specList
		?.filter(spec => spec.cadSpecCode)
		.map(spec => {
			const specValue: PartNumberSpecValue | undefined =
				partNumber.specValueList.find(
					specValue => specValue.specCode === spec.specCode
				);
			return {
				specCADCode: spec.cadSpecCode,
				specCADValue:
					specValue == null
						? ''
						: specValue.cadSpecValue || specValue.specValue,
			};
		}) ?? [];

/**
 * Return alterationSpecList for SINUS API request
 */
export const getAlterationSpecList = ({
	alterationSpecList,
}: GetAlterationSpecListPayload) =>
	alterationSpecList
		.filter(spec => spec.cadSpecCode && Flag.isTrue(spec.selectedFlag))
		.map(spec => {
			const specValueList = spec.specValueList
				.filter(specValue => Flag.isTrue(specValue.selectedFlag))
				.map(specValue => specValue.cadSpecValue || specValue.specValue);
			if (spec.numericSpec && spec.numericSpec.specValue) {
				specValueList.push(spec.numericSpec.specValue);
			}
			return {
				specCADCode: spec.cadSpecCode,
				specCADValue: specValueList
					.filter(
						// unique only
						(specValue, index, specValueList) =>
							specValueList.indexOf(specValue) === index
					)
					.join(),
			};
		});

export const isSinusBrowser = () =>
	isFirefox() || isChrome() || isEdge() || Number(getIEVersion()) >= 11;
