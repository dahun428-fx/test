import classNames from 'classnames';
import { forwardRef } from 'react';
import commonStyles from '@/styles/pc/legacy/common.module.scss';
import complexDetailStyles from '@/styles/pc/legacy/style_complex.module.scss';
import simpleDetailStyles from '@/styles/pc/legacy/style_simple.module.scss';

type Props = {
	html: string;
	parentHtmlTag?: React.ElementType;
	childHtmlTag?: React.ElementType;
	className?: string;
	isDetail?: boolean;
	isComplex?: boolean;
	isWysiwyg?: boolean;
	childClassName?: string;
};

export const LegacyStyledHtml = forwardRef<HTMLDivElement, Props>(
	(
		{
			html,
			parentHtmlTag: ParentTag = 'div',
			childHtmlTag: ChildTag = 'div',
			className,
			isDetail,
			isComplex,
			isWysiwyg,
			childClassName = '',
		},
		ref
	) => {
		return (
			<ParentTag
				className={classNames(
					isDetail
						? isComplex
							? complexDetailStyles.detail
							: simpleDetailStyles.detail
						: '',
					commonStyles.common,
					className
				)}
			>
				<ChildTag
					className={isWysiwyg ? 'wysiwyg_area' : childClassName}
					dangerouslySetInnerHTML={{
						__html: html,
					}}
					ref={ref}
				/>
			</ParentTag>
		);
	}
);
LegacyStyledHtml.displayName = 'LegacyStyledHtml';
