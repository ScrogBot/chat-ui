"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.middleware = void 0;
const middleware_1 = require("@/lib/supabase/middleware");
const next_i18n_router_1 = require("next-i18n-router");
const server_1 = require("next/server");
const i18nConfig_1 = __importDefault(require("./i18nConfig"));
function middleware(request) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const i18nResult = (0, next_i18n_router_1.i18nRouter)(request, i18nConfig_1.default);
        if (i18nResult)
            return i18nResult;
        try {
            const { supabase, response } = (0, middleware_1.createClient)(request);
            const session = yield supabase.auth.getSession();
            const redirectToChat = session && request.nextUrl.pathname === "/";
            if (redirectToChat) {
                const { data: homeWorkspace, error } = yield supabase
                    .from("workspaces")
                    .select("*")
                    .eq("user_id", (_a = session.data.session) === null || _a === void 0 ? void 0 : _a.user.id)
                    .eq("is_home", true)
                    .single();
                if (!homeWorkspace) {
                    throw new Error(error === null || error === void 0 ? void 0 : error.message);
                }
                return server_1.NextResponse.redirect(new URL(`/${homeWorkspace.id}/chat`, request.url));
            }
            return response;
        }
        catch (e) {
            return server_1.NextResponse.next({
                request: {
                    headers: request.headers
                }
            });
        }
    });
}
exports.middleware = middleware;
exports.config = {
    matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
};
