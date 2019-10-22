import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll({
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
    });

    return res.json(students);
  }

  async store(req, res) {
    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const student = await Student.findByPk(req.params.id);
    await student.update(req.body);

    return res.json(student);
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);
    await student.destroy();

    return res.send();
  }
}

export default new StudentController();
