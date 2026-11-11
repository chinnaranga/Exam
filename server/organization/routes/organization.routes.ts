import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { enforceTenantIsolation } from '../../tenant/middleware/tenant.middleware';

const router = Router();

router.use(enforceTenantIsolation);

// Organization CRUD APIs
router.get('/organizations', OrganizationController.listOrganizations);
router.post('/organizations', OrganizationController.createOrganization);
router.get('/organizations/:id', OrganizationController.getOrganization);
router.put('/organizations/:id', OrganizationController.updateOrganization);
router.delete('/organizations/:id', OrganizationController.deleteOrganization);

// Tenant Invitation APIs
router.get('/invitations', OrganizationController.listInvitations);
router.post('/invitations', OrganizationController.createInvitation);
router.delete('/invitations/:id', OrganizationController.revokeInvitation);

export default router;
