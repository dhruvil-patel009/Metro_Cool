declare module "swagger-jsdoc" {
  import { OpenAPIV3 } from "openapi-types";

  interface SwaggerJsdocOptions {
    definition: OpenAPIV3.Document;
    apis: string[];
  }

  function swaggerJSDoc(options: SwaggerJsdocOptions): OpenAPIV3.Document;

  export default swaggerJSDoc;
}
