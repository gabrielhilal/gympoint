import * as Yup from 'yup';
import { Op } from 'sequelize';

import Plan from '../models/Plan';
import Student from '../models/Student';
import Enrolment from '../models/Enrolment';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    start_date: Yup.date().required(),
    plan_id: Yup.number().required(),
    student_id: Yup.number().required(),
  });

  try {
    await schema.validate(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.errors });
  }

  const student = await Student.findByPk(req.body.student_id);

  if (!student) {
    return res.status(400).json({ error: 'student not found' });
  }

  const plan = await Plan.findByPk(req.body.plan_id);

  if (!plan) {
    return res.status(400).json({ error: 'plan not found' });
  }

  const activePlan = await Enrolment.findOne({
    where: {
      student_id: req.body.student_id,
      end_date: {
        [Op.gt]: new Date(),
      },
    },
  });

  if (activePlan && activePlan.id !== parseInt(req.params.id, 10)) {
    return res.status(400).json({ error: 'student has an active plan' });
  }

  return next();
};
