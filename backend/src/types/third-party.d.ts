declare module "swagger-ui-express" {
  import type { RequestHandler } from "express";

  export const serve: RequestHandler;
  export function setup(
    swaggerDoc: any,
    options?: any,
    customCss?: string,
    customfavIcon?: string,
    swaggerUrl?: string,
    customSiteTitle?: string
  ): RequestHandler;
}

declare module "swagger-jsdoc" {
  export default function swaggerJSDoc(options: any): any;
}
