import dayjs from 'dayjs';
import { config } from '@/config';

export const date = (
	value: string | undefined,
	specifiedFormat?: string
): string | undefined => {
	if (!value) {
		return undefined;
	}

	const localDateTime = dayjs(value);

	// NOTE: もう少しちゃんと検証したほうがいい気もするが、
	//       現状は表示項目に対するフォーマットなので、dayjs で検証できるレベルにしておく。
	//       自由入力項目などに利用する場合は再考する。
	if (!localDateTime.isValid()) {
		return undefined;
	}
	const dateFormat = specifiedFormat || config.format.date;
	return localDateTime.format(dateFormat);
};

export const dateTime = (
	value: string | undefined,
	specifiedFormat?: string
): string | undefined => {
	if (!value) {
		return undefined;
	}

	const localDateTime = dayjs(value);

	if (!localDateTime.isValid()) {
		return undefined;
	}
	const dateFormat = specifiedFormat || config.format.dateTime;
	return localDateTime.format(dateFormat);
};
