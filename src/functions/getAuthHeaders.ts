import cookie from 'cookie';
import { NextRequest } from 'next/server';

export default (req: NextRequest) => {
    const cookies = req.cookies;

    const sessionCookie = cookies.get('todox-session');
    if (!sessionCookie) {
        return {};
    }

    return {
        Cookie: `${cookie.serialize('todox-session', sessionCookie.value)}`,
    };
};
