import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { student_id: req.params.studentId },
      attributes: ['id', 'question', 'answer', 'answer_at'],
    });

    res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    // Validate schema
    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const student = await Student.findByPk(req.params.studentId);

    // Check if there is a studen with the given id
    if (!student) {
      return res.status(400).json({ error: 'student not found' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: req.params.studentId,
      question: req.body.question,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
