import { ServerResponse as HttpServerResponse } from 'http';

/**
 * ServerResponse class から型のみを取り出した ServerResponse type
 * - client がこれを import type しても、node.js 再現実装がブラウザに降ることがないようにしています。
 * - WARN: import type で import してください。
 */
export type ServerResponse = InstanceType<typeof HttpServerResponse>;
