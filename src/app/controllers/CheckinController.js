import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll({
      where: { student_id: req.params.studentId },
      order: [['createdAt', 'DESC']],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.studentId);

    // Check if there is a studen with the given id
    if (!student) {
      return res.status(400).json({ error: 'student not found' });
    }

    const checkinsInOneWeek = await Checkin.count({
      where: {
        student_id: student.id,
        createdAt: {
          [Op.between]: [
            subDays(startOfDay(new Date()), 7),
            endOfDay(new Date()),
          ],
        },
      },
    });

    // Check the limit of checkins in 7 days
    if (checkinsInOneWeek >= 5) {
      return res
        .status(400)
        .json({ error: 'exceeded the limit of checkins in 7 days' });
    }

    const checkin = await Checkin.create({
      student_id: req.params.studentId,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
