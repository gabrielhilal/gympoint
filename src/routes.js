import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrolmentController from './app/controllers/EnrolmentController';

import authMiddleware from './app/middlewares/auth';

import checkStudentMiddleware from './app/middlewares/checkStudent';
import validateStudentMiddleware from './app/middlewares/validateStudent';

import checkPlanMiddleware from './app/middlewares/checkPlan';
import validatePlanMiddleware from './app/middlewares/validatePlan';

import checkEnrolmentMiddleware from './app/middlewares/checkEnrolment';
import validateEnrolmentMiddleware from './app/middlewares/validateEnrolment';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
// all router defined below will use the authMiddleware

routes.get('/students', StudentController.index);
routes.post('/students', validateStudentMiddleware, StudentController.store);
routes.put(
  '/students/:id',
  checkStudentMiddleware,
  validateStudentMiddleware,
  StudentController.update
);
routes.delete(
  '/students/:id',
  checkStudentMiddleware,
  StudentController.delete
);

routes.get('/plans', PlanController.index);
routes.post('/plans', validatePlanMiddleware, PlanController.store);
routes.put(
  '/plans/:id',
  checkPlanMiddleware,
  validatePlanMiddleware,
  PlanController.update
);
routes.delete('/plans/:id', checkPlanMiddleware, PlanController.delete);

routes.get('/enrolments', EnrolmentController.index);
routes.post(
  '/enrolments',
  validateEnrolmentMiddleware,
  EnrolmentController.store
);
routes.put(
  '/enrolments/:id',
  checkEnrolmentMiddleware,
  validateEnrolmentMiddleware,
  EnrolmentController.update
);
routes.delete(
  '/enrolments/:id',
  checkEnrolmentMiddleware,
  EnrolmentController.delete
);

export default routes;
