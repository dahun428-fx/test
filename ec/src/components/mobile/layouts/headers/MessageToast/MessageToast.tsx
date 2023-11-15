import classNames from 'classnames';
import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './MessageToast.module.scss';
import { Anchor } from '@/components/mobile/ui/links';
import { url } from '@/utils/url';

type Props = {
	isOpen: boolean;
};

export const MessageToast: React.VFC<Props> = ({ isOpen }) => {
	const ref = useRef(null);

	return (
		<CSSTransition
			nodeRef={ref}
			in={isOpen}
			timeout={300}
			classNames={{
				enter: styles.enterSlideFromRight,
				enterActive: styles.enterActiveSlideFromRight,
				exitActive: styles.exitActive,
			}}
			unmountOnExit
		>
			<div
				ref={ref}
				className={classNames(styles.messageToast, styles.slideFromLeft)}
			>
				<Anchor href={url.myPage.top}>
					<span className={styles.messageBox} />
				</Anchor>
			</div>
		</CSSTransition>
	);
};
