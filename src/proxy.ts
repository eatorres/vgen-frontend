import { NextRequest, NextResponse } from 'next/server';

import config from './config';
import apiFetch from './functions/apiFetch';
import getAuthHeaders from './functions/getAuthHeaders';

const ROUTES_TO_PROTECT = ['/', '/todos', '/create'];

export async function proxy(req: NextRequest): Promise<NextResponse> {
    // Prevent users that aren't signed in from accessing certain protectereq.nextUrl.pathname === '/' || req.nextUrl.pathname === '/create'd pages
    if (ROUTES_TO_PROTECT.includes(req.nextUrl.pathname)) {
        try {
            let response = await apiFetch('/user/session', {
                headers: getAuthHeaders(req),
            });
            if (response.status !== 200) {
                throw 'Unauthorized';
            } else {
                return NextResponse.next();
            }
        } catch (err) {
            console.log(err);
            return NextResponse.redirect(`${config.FRONT_END_URL}/signin`);
        }
    } else {
        return NextResponse.next();
    }
}
