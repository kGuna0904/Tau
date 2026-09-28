//proxy a middleware helps to redirect to the login page once the session is over
import {NextResponse} from 'next/server';
import {NextRequest} from 'next/server';

export function proxy(req: NextRequest) {
    const session = req.cookies.get('tau_session');
    if(!session){
        return NextResponse.redirect(new URL('/login', req.url));
    } else{
        return NextResponse.next();//means that, to carry on with the session
    }
}

export const config = {
  matcher: [
    '/home/:path*',
    '/dashboard/:path*',
    '/transactions/:path*',
    '/analytics/:path*',
    '/statements/:path*',
    '/accounts/:path*',
  ],
};