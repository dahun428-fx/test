import { SharedQuery } from './chat.types';
import { Chat } from '@/components/mobile/pages/Chat';
import { Simple } from '@/layouts/mobile/simple';
import { NextPageWithLayout } from '@/pages/types';

export type Query = SharedQuery;

/** Chat Plus */
const ChatPage: NextPageWithLayout = () => {
	return <Chat />;
};

ChatPage.displayName = 'Chat';
ChatPage.getLayout = Simple;
export default ChatPage;
