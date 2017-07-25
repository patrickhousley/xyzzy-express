import { AuthUser } from 'src/server/shared/AuthUser.interface';

declare global {
    namespace Express {
        export interface Request {
            auth?: any;
            user?: AuthUser;
            loggerKey?: string;
        }
    }
}