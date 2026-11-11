import { describe, it, expect } from 'vitest';
import { computeClientHmac } from '../hooks/useSignedEventChannel';
import { computeEventHmac, ExamSessionAuthority } from '../../../../server/integrity/ExamSessionAuthority';

describe('Client-Server Signed Event Cryptographic Interoperability', () => {
  const secretKey = 'session_secret_client_server_interop_key_99';
  const authority = new ExamSessionAuthority();
  const sessionId = 'session_interop_101';

  it('client computeClientHmac and server computeEventHmac should produce identical SHA-256 HMAC', async () => {
    const event = {
      type: 'FocusLost',
      ts: 1700000050000,
      seq: 1,
      payload: { app: 'Slack', windowTitle: 'General Channel', durationSec: 12 },
    };

    const clientHmac = await computeClientHmac(secretKey, event);
    const serverHmac = computeEventHmac(secretKey, event);

    expect(clientHmac).toBe(serverHmac);
    expect(clientHmac.length).toBe(64); // 256 bits in hex
  });

  it('server should successfully verify events signed by computeClientHmac', async () => {
    authority.startSession({
      sessionId,
      durationSeconds: 1800,
      sessionSecret: secretKey,
    });

    const event = {
      type: 'DevToolsOpened',
      ts: 1700000060000,
      seq: 1,
      payload: { dockSide: 'bottom', consoleInspected: true },
    };

    const clientHmac = await computeClientHmac(secretKey, event);
    const result = authority.verifyAndIngestEvent(sessionId, {
      ...event,
      hmac: clientHmac,
    });

    expect(result.valid).toBe(true);
    expect(result.record).toBeDefined();
    expect(result.record?.eventData.type).toBe('DevToolsOpened');

    // Verify ledger integrity
    const ledgerCheck = authority.verifyLedger(sessionId);
    expect(ledgerCheck.valid).toBe(true);
  });
});

