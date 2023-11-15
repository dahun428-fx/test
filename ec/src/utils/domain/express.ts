import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TFunction } from 'react-i18next';

dayjs.extend(customParseFormat);

export function formatTime(time: string | undefined, t: TFunction): string {
	if (time == null) {
		return '';
	}

	const parsedTime = dayjs(time, 'hh:mm');

	if (!parsedTime.isValid()) {
		return time;
	}

	return t('utils.domain.express.deadlineTime', {
		time: parsedTime.format('h:mm a'),
	});
}
