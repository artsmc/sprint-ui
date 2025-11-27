/**
 * API Documentation Page
 *
 * Server component that renders the Swagger UI with the API specification.
 * The spec is generated server-side using next-swagger-doc.
 */

import { getApiDocs } from '@/swagger/config';
import SwaggerUIClient from './swagger-ui';

export const metadata = {
  title: 'Sprint UI API Documentation',
  description: 'Interactive API documentation for Sprint UI',
};

export default async function ApiDocPage() {
  const spec = getApiDocs() as Record<string, unknown>;

  return (
    <section className="min-h-screen bg-white">
      <SwaggerUIClient spec={spec} />
    </section>
  );
}
