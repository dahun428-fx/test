import { SharedQuery } from './chat.types';
import { Chat } from '@/components/pc/pages/Chat';
import { None } from '@/layouts/none';
import { NextPageWithLayout } from '@/pages/types';

export type Query = SharedQuery;

/** Chat Plus */
const ChatPage: NextPageWithLayout = () => {
	return <Chat />;
};

ChatPage.displayName = 'Chat';
ChatPage.getLayout = None;
export default ChatPage;
