import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay, addMonths } from 'date-fns';
import Enrolment from '../models/Enrolment';
import Student from '../models/Student';
import Plan from '../models/Plan';
import WelcomeMail from '../jobs/WelcomeMail';
import Queue from '../../lib/Queue';

class EnrolmentController {
  async index(req, res) {
    const enrolments = await Enrolment.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration'],
        },
      ],
    });

    return res.json(enrolments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
    });

    // Validate schema
    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { plan_id, student_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    // Check if there is a studen with the given id
    if (!student) {
      return res.status(400).json({ error: 'student not found' });
    }

    const plan = await Plan.findByPk(plan_id);

    // Check if there is a plan with the given id
    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }

    const activeEnrolment = await Enrolment.findOne({
      where: {
        student_id,
        end_date: {
          [Op.gt]: start_date,
        },
      },
    });

    // Check if there is an active enrolment for the student
    if (activeEnrolment) {
      return res.status(400).json({ error: 'student has an active plan' });
    }

    const enrolment = await Enrolment.create({
      plan_id,
      student_id,
      start_date: startOfDay(parseISO(start_date)),
      end_date: addMonths(endOfDay(parseISO(start_date)), plan.duration),
      price: plan.total,
    });

    await Queue.add(WelcomeMail.key, {
      student,
      plan,
      enrolment,
    });

    return res.json(enrolment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
    });

    // Validate schema
    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { plan_id, student_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    // Check if there is a studen with the given id
    if (!student) {
      return res.status(400).json({ error: 'student not found' });
    }

    const plan = await Plan.findByPk(plan_id);

    // Check if there is a plan with the given id
    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }

    const enrolment = await Enrolment.findByPk(req.params.id);

    // Check if there is an enrolment with the given id
    if (!enrolment) {
      return res.status(400).json({ error: 'enrolment not found' });
    }

    const activeEnrolment = await Enrolment.findOne({
      where: {
        student_id,
        end_date: {
          [Op.gt]: start_date,
        },
      },
    });

    // Check if there is an active enrolment for the student
    if (activeEnrolment && activeEnrolment.id !== enrolment.id) {
      return res.status(400).json({ error: 'student has an active plan' });
    }

    await enrolment.update({
      plan_id,
      student_id,
      start_date: startOfDay(parseISO(start_date)),
      end_date: addMonths(endOfDay(parseISO(start_date)), plan.duration),
      price: plan.total,
    });

    return res.json(enrolment);
  }

  async delete(req, res) {
    const enrolment = await Enrolment.findByPk(req.params.id);

    // Check if there is an enrolment with the given id
    if (!enrolment) {
      return res.status(400).json({ error: 'enrolment not found' });
    }

    await enrolment.destroy();

    return res.send();
  }
}

export default new EnrolmentController();
