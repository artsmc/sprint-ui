/**
 * Health Check API Route
 *
 * @swagger
 * /api/v1/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Check API health status
 *     description: |
 *       Returns the health status of the API and its dependencies.
 *       Use this endpoint to verify the API is running and connected to PocketBase.
 *     operationId: getHealthStatus
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *             example:
 *               status: ok
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *               version: "1.0.0"
 *               services:
 *                 pocketbase: connected
 *       503:
 *         description: API is degraded (dependencies unavailable)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 *             example:
 *               status: degraded
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *               version: "1.0.0"
 *               services:
 *                 pocketbase: disconnected
 */

import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

interface HealthStatus {
  status: 'ok' | 'degraded';
  timestamp: string;
  version: string;
  services: {
    pocketbase: 'connected' | 'disconnected';
  };
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  let pocketbaseStatus: 'connected' | 'disconnected' = 'disconnected';

  try {
    // Try to check PocketBase health
    await pb.health.check();
    pocketbaseStatus = 'connected';
  } catch {
    // PocketBase is not available
    pocketbaseStatus = 'disconnected';
  }

  const isHealthy = pocketbaseStatus === 'connected';

  const healthStatus: HealthStatus = {
    status: isHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      pocketbase: pocketbaseStatus,
    },
  };

  return NextResponse.json(healthStatus, {
    status: isHealthy ? 200 : 503,
  });
}
