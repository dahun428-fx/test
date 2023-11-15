import classNames from 'classnames';
import React, { ForwardedRef, VFC } from 'react';
import commonStyles from '@/styles/mobile/legacy/common.module.scss';

export type Props = {
	html: string;
	parentHtmlTag?: React.ElementType;
	childHtmlTag?: React.ElementType;
	parentClassName?: string;
	childClassName?: string;
	htmlRef?: ForwardedRef<HTMLElement>;
};

export const LegacyStyledHtml: VFC<Props> = ({
	html,
	parentHtmlTag: ParentTag = 'div',
	childHtmlTag: ChildTag = 'div',
	parentClassName,
	childClassName,
	htmlRef,
}) => {
	return (
		<ParentTag
			className={classNames(commonStyles.common, parentClassName)}
			ref={htmlRef}
		>
			<ChildTag
				className={childClassName}
				dangerouslySetInnerHTML={{
					__html: html,
				}}
			/>
		</ParentTag>
	);
};
