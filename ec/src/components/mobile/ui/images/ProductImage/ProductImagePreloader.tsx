import { VFC } from 'react';
import { ImagePreloader } from '@/components/mobile/ui/images/ImagePreloader';
import { convertImageUrl } from '@/utils/domain/image';

type Props = {
	url?: string;
	preset: string;
};

export const ProductImagePreloader: VFC<Props> = ({ url, preset }) => {
	const href = convertImageUrl(url, preset);

	if (!href) {
		return null;
	}

	return <ImagePreloader href={href} />;
};
