import { Query } from '@/models/pages/cadPreview';
import { Button } from '@/components/pc/ui/buttons';
import { useTranslation } from 'react-i18next';
import { aa } from '@/logs/analytics/adobe';
import { ectLogger } from '@/logs/ectLogger';
import { openSubWindow } from '@/utils/window';
import { url } from '@/utils/url';

type Props = Query & {
	disabled: boolean;
};

export const CadPreviewButton: React.VFC<Props> = ({ disabled, ...query }) => {
	const { t } = useTranslation();

	/** popUp window handler */
	const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		e.preventDefault();

		aa.events.sendCadPreview();
		ectLogger.tab.preview3D({
			brandCode: query.brandCode,
			seriesCode: query.seriesCode,
		});

		const height = Math.min(1000, window.outerHeight);
		openSubWindow(url.cadPreview(query), '_blank', {
			width: 1000,
			height,
		});
	};

	return (
		<Button disabled={disabled} onClick={handleClick}>
			{t('pages.productDetail.partNumberHeader.preview')}
		</Button>
	);
};
CadPreviewButton.displayName = 'CadPreviewButton';
