import { SendLogPayload } from '@/utils/domain/spec/types';

export type SpecCode = string;
export type SpecValues = string | string[] | number | undefined;

/** spec change payload */
export type ChangePayload = {
	selectedSpecs: Record<SpecCode, SpecValues>;
	/** ect-api log */
	log?: SendLogPayload | SendLogPayload[];
};
