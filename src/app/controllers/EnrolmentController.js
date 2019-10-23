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
    const enrolment = await Enrolment.create(req.body);

    return res.json(enrolment);
  }

  async update(req, res) {
    const enrolment = await Enrolment.findByPk(req.params.id);
    await enrolment.update(req.body);

    return res.json(enrolment);
  }

  async delete(req, res) {
    const enrolment = await Enrolment.findByPk(req.params.id);
    await enrolment.destroy();

    return res.send();
  }
}

export default new EnrolmentController();
