import * as Yup from 'yup';
import { Op } from 'sequelize';
import Enrolment from '../models/Enrolment';
import Student from '../models/Student';
import Plan from '../models/Plan';

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

    const student = await Student.findByPk(req.body.student_id);

    // Check if there is a studen with the given id
    if (!student) {
      return res.status(400).json({ error: 'student not found' });
    }

    const plan = await Plan.findByPk(req.body.plan_id);

    // Check if there is a plan with the given id
    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }

    const activeEnrolment = await Enrolment.findOne({
      where: {
        student_id: req.body.student_id,
        end_date: {
          [Op.gt]: req.body.start_date,
        },
      },
    });

    // Check if there is an active enrolment for the student
    if (activeEnrolment) {
      return res.status(400).json({ error: 'student has an active plan' });
    }

    const enrolment = await Enrolment.create(req.body);

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

    const student = await Student.findByPk(req.body.student_id);

    // Check if there is a studen with the given id
    if (!student) {
      return res.status(400).json({ error: 'student not found' });
    }

    const plan = await Plan.findByPk(req.body.plan_id);

    // Check if there is a plan with the given id
    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }

    const enrolment = await Enrolment.findByPk(req.params.id);

    // Check if there is an enrolment with the given id
    if (!enrolment) {
      return res.status(400).json({ error: 'enrolment not found' });
    }

    await enrolment.update(req.body);

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
