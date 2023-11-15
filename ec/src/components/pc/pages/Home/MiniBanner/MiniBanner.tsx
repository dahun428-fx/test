type Props = {
	miniBannerHtml: string;
};

/**
 * Mini banner
 * @param props
 * @returns
 */
export const MiniBanner: React.VFC<Props> = props => {
	return <div dangerouslySetInnerHTML={{ __html: props.miniBannerHtml }} />;
};
