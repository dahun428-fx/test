import React, { Children, useMemo } from 'react';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';
import { SupplementType } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';

export type SpecDetail = {
	specName: string;
	detailHtml?: string;
	supplementType?: SupplementType;
	specImageUrl?: string;
	specDescriptionImageUrl?: string;
};

export type Props = {
	spec: SpecDetail;
	className?: string;
};

/**
 * Popover aside contents
 */
export const SpecPopoverAside: React.VFC<Props> = ({ spec, className }) => {
	const {
		specName,
		supplementType,
		specImageUrl,
		detailHtml,
		specDescriptionImageUrl,
	} = spec;

	const htmlAsideContents = useMemo(() => {
		if (supplementType === SupplementType.DETAIL && detailHtml) {
			return <LegacyStyledHtml html={detailHtml} />;
		}

		if (supplementType === SupplementType.DRAWING && specImageUrl) {
			return (
				<img // eslint-disable-line @next/next/no-img-element
					src={specImageUrl}
					alt={specName}
				/>
			);
		}

		if (specDescriptionImageUrl) {
			return (
				<img // eslint-disable-line @next/next/no-img-element
					src={specDescriptionImageUrl}
					alt={specName}
				/>
			);
		}
		return null;
	}, [
		detailHtml,
		specDescriptionImageUrl,
		specImageUrl,
		specName,
		supplementType,
	]);

	return (
		<AsideContents className={className}>{htmlAsideContents}</AsideContents>
	);
};
SpecPopoverAside.displayName = 'SpecPopoverAside';

const AsideContents: React.FC<{ className?: string }> = ({
	children,
	className,
}) => {
	if (Children.toArray(children).length === 0) {
		return null;
	}

	return <div className={className}>{children}</div>;
};
AsideContents.displayName = 'AsideContents';
