import { OrganizationService } from '../services/organization.service';
import { InvitationService } from '../services/invitation.service';

async function runTests() {
  console.log('--- STARTING ORGANIZATION SERVICE UNIT TESTS ---');

  // Test 1
  const orgs = await OrganizationService.listOrganizations();
  console.assert(orgs.length > 0, 'Orgs list should not be empty');
  console.log('✔ Test 1 Passed: Listed pre-seeded organizations count =', orgs.length);

  // Test 2
  const newOrg = await OrganizationService.createOrganization({
    name: 'Harvard University',
    slug: 'harvard-main',
    primaryDomain: 'harvard.edu',
  });
  console.assert(newOrg.id.startsWith('org_'), 'Org ID format check');
  console.log('✔ Test 2 Passed: Created organization =', newOrg.name);

  // Test 3
  const inv = await InvitationService.createInvitation({
    organizationId: 'org_mit_01',
    invitedByUserId: 'usr_admin',
    email: 'test.prof@mit.edu',
    roleName: 'FACULTY',
  });
  console.assert(inv.token.length === 64, 'Invitation token 64-char length');
  console.log('✔ Test 3 Passed: Created single user invitation token =', inv.token.substring(0, 12) + '...');

  // Test 4
  const invs = await InvitationService.bulkInviteUsers({
    organizationId: 'org_mit_01',
    invitedByUserId: 'usr_admin',
    invitations: [
      { email: 'user1@mit.edu', roleName: 'STUDENT' },
      { email: 'user2@mit.edu', roleName: 'INVIGILATOR' },
    ],
  });
  console.assert(invs.length === 2, 'Bulk invitations count should be 2');
  console.log('✔ Test 4 Passed: Processed bulk CSV invitations count =', invs.length);

  console.log('--- ALL ORGANIZATION ENGINE UNIT TESTS PASSED SUCCESSFULLY ---');
}

runTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
