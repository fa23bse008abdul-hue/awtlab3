import { Router, Request, Response } from 'express';
import { executeGraphQL, schema } from '../graphql/schema';

const router = Router();

/**
 * POST /graphql
 * Enterprise GraphQL endpoint solving the REST Over-fetching dilemma.
 * Mobile clients request exactly the fields needed for the viewport.
 */
router.post('/', async (req: Request, res: Response) => {
  const { query, variables, operationName } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      errors: [
        {
          message: 'Must provide a valid GraphQL query string in request body',
          extensions: { code: 'GRAPHQL_PARSE_FAILED' }
        }
      ]
    });
  }

  const startTime = performance.now();
  const result = await executeGraphQL(query, variables, operationName);
  const executionMs = Number((performance.now() - startTime).toFixed(2));

  const payloadString = JSON.stringify(result);
  const payloadSizeBytes = Buffer.byteLength(payloadString, 'utf8');

  // Compute overfetching reduction context (compared to fetching 50-field full REST object)
  const fullRestEquivalentBytes = 18500; // Average full enterprise product payload in bytes
  const bytesSaved = Math.max(0, fullRestEquivalentBytes - payloadSizeBytes);
  const savingsPercent = Number(((bytesSaved / fullRestEquivalentBytes) * 100).toFixed(1));

  res.setHeader('X-GraphQL-Execution-Time-Ms', executionMs.toString());
  res.setHeader('X-Payload-Size-Bytes', payloadSizeBytes.toString());

  // Return standard GraphQL envelope + metadata for developer transparency
  return res.status(200).json({
    ...result,
    extensions: {
      executionTimeMs: executionMs,
      payloadSizeBytes,
      overfetchingMetrics: {
        payloadSizeBytes,
        fullRestPayloadEstimateBytes: fullRestEquivalentBytes,
        bandwidthSavedBytes: bytesSaved,
        bandwidthSavingsPercent: savingsPercent,
        verdict: savingsPercent > 50 ? 'Massive Bandwidth & Battery Optimization Achieved' : 'Standard Payload'
      }
    }
  });
});

/**
 * GET /graphql
 * Allows quick introspection or GET queries for testing in browser
 */
router.get('/', async (req: Request, res: Response) => {
  const query = req.query.query as string;
  if (!query) {
    return res.status(200).json({
      message: 'GraphQL Endpoint ready. Send POST with { query } or use GET with ?query=...',
      exampleQuery: '{ products(limit: 5) { id title price thumbnailUrl } }'
    });
  }

  const result = await executeGraphQL(query);
  return res.status(200).json(result);
});

export default router;
