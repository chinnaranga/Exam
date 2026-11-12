import { describe, it } from 'vitest';
import { JwtService } from '../tokens/jwt.service';
import { PasswordService } from '../security/password.service';
import { SessionService } from '../sessions/session.service';
import { DeviceService } from '../devices/device.service';

const assert = (condition: boolean, msg: string) => {
  if (!condition) throw new Error(`Assertion Failed: ${msg}`);
};

export async function runAuthEngineSuite() {
  console.log('[AUTH SUITE] Running Enterprise Auth Engine Tests...');

  // Test 1: Password Service
  const rawPass = 'SecurePass123!';
  const hash = await PasswordService.hashPassword(rawPass);
  assert(hash.includes(':'), 'Password hash must contain salt separator');
  const isValid = await PasswordService.verifyPassword(rawPass, hash);
  assert(isValid === true, 'Password verification failed for correct password');
  const isInvalid = await PasswordService.verifyPassword('WrongPass123!', hash);
  assert(isInvalid === false, 'Password verification succeeded for wrong password');

  // Test 2: JwtService
  const tokenPair = JwtService.generateTokenPair({
    userId: 'usr_test_01',
    tenantId: 'org_mit_01',
    activeRole: 'ORGANIZATION_ADMIN',
    sessionId: 'sess_test_01',
  });
  assert(!!tokenPair.accessToken, 'Access token missing');
  assert(!!tokenPair.refreshToken, 'Refresh token missing');
  const decoded = JwtService.verifyToken(tokenPair.accessToken);
  assert(decoded.sub === 'usr_test_01', 'Incorrect sub claim');
  assert(decoded.tenantId === 'org_mit_01', 'Incorrect tenantId claim');

  // Test 3: SessionService
  const session = await SessionService.createSession({
    userId: 'usr_test_02',
    sessionToken: 'st_mock',
    refreshToken: 'rt_mock',
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0',
    expiresAt: new Date(Date.now() + 60000),
  });
  assert(session.status === 'ACTIVE', 'Session must be ACTIVE');
  await SessionService.revokeSession(session.id);
  const fetchedAfter = await SessionService.getSession(session.id);
  assert(fetchedAfter?.status === 'REVOKED', 'Session status must be REVOKED');

  // Test 4: DeviceService
  const dev = await DeviceService.registerDevice({
    userId: 'usr_test_03',
    deviceFingerprint: 'fingerprint_abc123',
    deviceName: 'Workstation 1',
  });
  assert(dev.isTrusted === false, 'New device must not be trusted by default');
  await DeviceService.setDeviceTrust(dev.id, true);
  const devices = await DeviceService.getUserDevices('usr_test_03');
  assert(devices[0].isTrusted === true, 'Device trust status failed to update');

  console.log('[AUTH SUITE] All 4 Enterprise Auth Engine Tests PASSED successfully!');
}

describe('Enterprise Auth Engine', () => {
  it('runs auth engine suite successfully', async () => {
    await runAuthEngineSuite();
  });
});
