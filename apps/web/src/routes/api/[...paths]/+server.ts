import { app } from "@packages/server";

type RequestHandler = (handler: { request: Request }) => Response | Promise<Response>;

export const GET: RequestHandler = (handler) => app.handle(handler.request);
export const POST: RequestHandler = (handler) => app.handle(handler.request);
export const PUT: RequestHandler = (handler) => app.handle(handler.request);
export const DELETE: RequestHandler = (handler) => app.handle(handler.request);
export const PATCH: RequestHandler = (handler) => app.handle(handler.request);

// these won't happen but just in case
export const OPTIONS: RequestHandler = (handler) => app.handle(handler.request);
export const HEAD: RequestHandler = (handler) => app.handle(handler.request);
