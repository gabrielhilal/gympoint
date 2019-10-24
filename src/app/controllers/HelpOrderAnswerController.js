import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';
import Queue from '../../lib/Queue';

class HelpOrderAnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    // Validate schema
    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const helpOrder = await HelpOrder.findByPk(req.params.helpOrderId);

    // Check if there is a help-order with the given id
    if (!helpOrder) {
      return res.status(400).json({ error: 'help-order not found' });
    }

    if (helpOrder.answer_at) {
      return res.status(400).json({ error: 'help-order already answered' });
    }

    await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    const student = await Student.findByPk(helpOrder.student_id);

    await Queue.add(HelpOrderAnswerMail.key, { student, helpOrder });

    return res.json(helpOrder);
  }
}

export default new HelpOrderAnswerController();
