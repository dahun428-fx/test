import classNames from 'classnames';
import React from 'react';
import { useStandardSpecList } from './StandardSpecList.hooks';
import styles from './StandardSpecList.module.scss';
import { StandardSpec } from '@/components/mobile/pages/ProductDetail/StandardSpecList/StandardSpec';

type Props = {
	className?: string;
};

/**
 * Series spec list
 */
export const StandardSpecList: React.VFC<Props> = ({ className }) => {
	const { standardSpecList, categoryCodeList } = useStandardSpecList();

	if (!standardSpecList.length) {
		return null;
	}

	return (
		<ul className={classNames(className, styles.container)}>
			{standardSpecList.map((standardSpec, index) => (
				<li key={index}>
					<dl className={styles.spec}>
						<dt
							className={styles.specName}
							dangerouslySetInnerHTML={{
								__html: `${standardSpec.specName ?? ''}: `,
							}}
						/>
						<dd>
							<StandardSpec
								{...{
									specCode: standardSpec.specCode,
									specType: standardSpec.specType,
									specValue: standardSpec.specValue,
									specValueDisp: standardSpec.specValueDisp,
									categoryCodeList,
								}}
							/>
						</dd>
					</dl>
				</li>
			))}
		</ul>
	);
};
StandardSpecList.displayName = 'StandardSpecList';
