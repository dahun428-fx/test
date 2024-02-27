import { FC } from 'react';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';

type Props = {
	bannerContent: string;
};

/** Banner component */
export const Banner: FC<Props> = ({ bannerContent }) => {
	return <LegacyStyledHtml html={bannerContent} />;
};
Banner.displayName = 'Banner';
