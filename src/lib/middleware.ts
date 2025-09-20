import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";


export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next(
        request
    )

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value, options}) => 
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request
                    });
                    cookiesToSet.forEach(({name, value, options}) => 
                        supabaseResponse.cookies.set(name, value, options)
                    );
                }
            }
        }
    )

    const {
        data: {user}
    } = await supabase.auth.getUser();

    // Handle root path redirect
    if(request.nextUrl.pathname === "/" && user) {
        const url = request.nextUrl.clone();
        url.pathname = user ? "/dashboard" : "/signin";
        return NextResponse.redirect(url, { status: 307 });
    }

    // Redirect logged-in users away from signin page
    if(request.nextUrl.pathname === "/signin" && user) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url, { status: 307 });
    }

    // Redirect unauthenticated users to signin page for protected routes
    if(
        !user &&
        !request.nextUrl.pathname.startsWith("/signin") &&
        !request.nextUrl.pathname.startsWith("/auth") &&
        !request.nextUrl.pathname.startsWith("/_next") &&
        !request.nextUrl.pathname.startsWith("/favicon")
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/signin";
        return NextResponse.redirect(url, { status: 307 });
    }

    return supabaseResponse;
}