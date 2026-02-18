import 'dotenv/config';

// Backend entry point
// In production this runs as Vercel serverless functions.
// Locally, this file provides a dev entry point for ts-node.

console.log('BakeBot backend starting...');

// Re-export handlers for local development
export { handler as tractionReportHandler } from './traction-report';

console.log('Backend ready. Available handlers: tractionReportHandler');
