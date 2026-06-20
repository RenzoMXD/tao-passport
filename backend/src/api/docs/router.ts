import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { parse as parseYaml } from 'yaml';

const RELATIVE_SPEC_PATH = join('docs', 'openapi.yaml');

/**
 * Resolve the OpenAPI spec by walking up from this module's directory until a
 * `docs/openapi.yaml` is found. This keeps the path stable whether the backend
 * runs from TypeScript sources (tsx) or the compiled `dist/` output, and
 * regardless of the process working directory.
 */
function resolveSpecPath(): string {
  const candidates: string[] = [];
  let current = dirname(fileURLToPath(import.meta.url));

  for (let depth = 0; depth < 8; depth += 1) {
    candidates.push(join(current, RELATIVE_SPEC_PATH));
    current = dirname(current);
  }

  candidates.push(join(process.cwd(), RELATIVE_SPEC_PATH));

  const specPath = candidates.find((candidate) => existsSync(candidate));

  if (!specPath) {
    throw new Error(`Unable to locate OpenAPI specification (${RELATIVE_SPEC_PATH}).`);
  }

  return specPath;
}

const specPath = resolveSpecPath();
export const openApiDocument = parseYaml(readFileSync(specPath, 'utf8')) as Record<string, unknown>;

export const docsRouter = Router();

// Raw machine-readable spec, useful for codegen and Postman/Insomnia import.
docsRouter.get('/openapi.json', (_request, response) => {
  response.json(openApiDocument);
});

// Interactive Swagger UI.
docsRouter.use('/', swaggerUi.serve);
docsRouter.get(
  '/',
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: 'TAO Passport API Docs',
    swaggerOptions: { displayRequestDuration: true },
  }),
);
