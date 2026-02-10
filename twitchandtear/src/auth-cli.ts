#!/usr/bin/env node
import http from 'http';
import { URL } from 'url';
import { TwitchAuth } from './twitch/auth';
import logger from './config/logger';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_PORT = parseInt(process.env.REDIRECT_PORT || '3000', 10);
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;
const SCOPES = ['chat:read', 'chat:edit'];

async function main(): Promise<void> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Error: CLIENT_ID and CLIENT_SECRET environment variables are required');
    console.error('');
    console.error('Usage:');
    console.error('  CLIENT_ID=your_client_id CLIENT_SECRET=your_client_secret npm run auth');
    process.exit(1);
  }

  const authUrl = TwitchAuth.getAuthorizationUrl(CLIENT_ID, REDIRECT_URI, SCOPES);

  console.log('');
  console.log('='.repeat(60));
  console.log('TwitchAndTear Authorization');
  console.log('='.repeat(60));
  console.log('');
  console.log('1. Open this URL in your browser:');
  console.log('');
  console.log(`   ${authUrl}`);
  console.log('');
  console.log('2. Log in to Twitch and authorize the application');
  console.log('');
  console.log(`3. You will be redirected to localhost:${REDIRECT_PORT}`);
  console.log('   (this script is listening for the callback)');
  console.log('');
  console.log('Waiting for authorization callback...');
  console.log('');

  const server = http.createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(400);
      res.end('Bad request');
      return;
    }

    const url = new URL(req.url, REDIRECT_URI);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end(`<html><body><h1>Authorization Failed</h1><p>Error: ${error}</p></body></html>`);
      console.error(`Authorization failed: ${error}`);
      server.close();
      process.exit(1);
    }

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<html><body><h1>Missing authorization code</h1></body></html>');
      return;
    }

    try {
      logger.info('Exchanging authorization code for tokens...');
      const tokens = await TwitchAuth.exchangeCodeForTokens(
        CLIENT_ID!,
        CLIENT_SECRET!,
        code,
        REDIRECT_URI,
      );

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body>
            <h1>Authorization Successful!</h1>
            <p>You can close this window.</p>
            <p>Check your terminal for the refresh token.</p>
          </body>
        </html>
      `);

      console.log('');
      console.log('='.repeat(60));
      console.log('Authorization Successful!');
      console.log('='.repeat(60));
      console.log('');
      console.log('Add this to your environment or docker run command:');
      console.log('');
      console.log(`  REFRESH_TOKEN=${tokens.refreshToken}`);
      console.log('');
      console.log('Full docker run example:');
      console.log('');
      console.log(`  docker run \\`);
      console.log(`    -e CLIENT_ID="${CLIENT_ID}" \\`);
      console.log(`    -e CLIENT_SECRET="${CLIENT_SECRET}" \\`);
      console.log(`    -e REFRESH_TOKEN="${tokens.refreshToken}" \\`);
      console.log(`    -e CHANNELS="your_channel" \\`);
      console.log(`    -e STREAM_KEY="your_stream_key" \\`);
      console.log(`    -e TARGET_HOST="zandronum.server.com" \\`);
      console.log(`    -v /path/to/wads:/wads \\`);
      console.log(`    frozenfoxx/twitchandtear:latest`);
      console.log('');

      server.close();
      process.exit(0);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<html><body><h1>Token Exchange Failed</h1><p>${err}</p></body></html>`);
      console.error('Failed to exchange code for tokens:', err);
      server.close();
      process.exit(1);
    }
  });

  server.listen(REDIRECT_PORT, () => {
    logger.info(`Listening for OAuth callback on port ${REDIRECT_PORT}`);
  });
}

main();
