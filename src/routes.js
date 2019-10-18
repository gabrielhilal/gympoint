import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';
import checkStudentMiddleware from './app/middlewares/checkStudent';
import validateStudentMiddleware from './app/middlewares/validateStudent';

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

export default routes;
