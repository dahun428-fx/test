import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ectLogger } from '@/logs/ectLogger';
import { CadDownloadStackItem } from '@/models/localStorage/CadDownloadStack_origin';
import { assertNotNull } from '@/utils/assertions';
import { downloadCadLink } from '@/utils/cad';
import { url } from '@/utils/url';

/** CAD download hook */
export const useCadDownloadStatus = () => {
	const [t] = useTranslation();

	const cadDownload = useCallback(
		async (stackItem: CadDownloadStackItem) => {
			try {
				if (stackItem.type === 'sinus') {
					downloadCadLink(
						url.cadDownload(stackItem.cadFilename, stackItem.fileName)
					);
				} else {
					assertNotNull(stackItem.downloadHref);
					downloadCadLink(
						url.cadDownload(stackItem.downloadHref, stackItem.fileName)
					);
				}
				ectLogger.cad.download(stackItem, t);
			} catch {
				// noop
			}
		},
		[t]
	);

	return { cadDownload };
};
