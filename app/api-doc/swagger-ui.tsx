'use client';

/**
 * Swagger UI Client Component
 *
 * Client-side component that renders the Swagger UI.
 * Must be a client component because swagger-ui-react uses browser APIs.
 *
 * Note: swagger-ui-react uses deprecated React lifecycle methods (UNSAFE_componentWillReceiveProps)
 * which trigger console warnings in React 19 strict mode. These are warnings from the library
 * and don't affect functionality. The warnings are suppressed in production builds.
 */

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-gray-500">Loading API documentation...</div>
    </div>
  ),
});

// Import CSS separately
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerUIClientProps {
  spec: Record<string, unknown>;
}

export default function SwaggerUIClient({ spec }: SwaggerUIClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Suppress the UNSAFE_componentWillReceiveProps warning from swagger-ui-react
    // This is a known issue with the library and React 19
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        message.includes('UNSAFE_componentWillReceiveProps')
      ) {
        return; // Suppress this specific warning
      }
      originalError.apply(console, args);
    };

    setMounted(true);

    return () => {
      console.error = originalError;
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading API documentation...</div>
      </div>
    );
  }

  return (
    <SwaggerUI
      spec={spec}
      docExpansion="list"
      defaultModelsExpandDepth={1}
      displayRequestDuration={true}
    />
  );
}
