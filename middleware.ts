import { updateSession } from "./src/lib/middleware";
import {type NextRequest} from "next/server";


export async function middleware(request: NextRequest) {
    return updateSession(request);
}


export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)$).*)",
    ],
};