import { cadDownloadDataCadenas } from './CadDownloadDataCadenas/CadDownloadDataCadenas.i18n.en';
import { cadDownloadDataSinus } from './CadDownloadDataSinus/CadDownloadDataSinus.i18n.en';
import { cadDownloadDataWeb2Cad } from './CadDownloadDataWeb2Cad/CadDownloadDataWeb2Cad.i18n.en';
import { cadDownloadError } from './CadDownloadError.i18n.en';
import { cadDownloadFixed } from './CadDownloadFixed/CadDownloadFixed.i18n.en';
import { cadDownloadPolicy } from './CadDownloadPolicy/CadDownloadPolicy.i18n.en';
import { cadenasFormatSelect } from './CadenasFormatSelect_origin/CadenasFormatSelect.i18n.en';
import { Translation } from '@/i18n/types';

export const cadDownload: Translation = {
	cadDownloadPolicy,
	cadDownloadDataCadenas,
	cadDownloadDataSinus,
	cadDownloadFixed,
	cadDownloadDataWeb2Cad,
	cadDownloadError,
	cadenasFormatSelect,
	cadDownloadButtonOn: 'CAD Download',
	cadDownloadButtonOnPre: 'CAD Data unavailable',
	cadDataIsNotAvailable:
		'We are sorry. No CAD data meeting the specified conditions are available.',
};
