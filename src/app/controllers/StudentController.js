import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll({
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
    });

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    // Validate schema
    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const studentWithEmail = await Student.findOne({
      where: { email: req.body.email },
    });

    // Check if student with given email already exist
    if (studentWithEmail) {
      return res.status(400).json({ error: 'user already exists' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    // Validate schema
    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const student = await Student.findByPk(req.params.id);

    // Check if there is a student with the given id
    if (!student) {
      return res.status(400).json({ error: 'student not found' });
    }

    const studentWithEmail = await Student.findOne({
      where: { email: req.body.email },
    });

    // Check if there is any other student with the given email (unless updating the same user)
    if (studentWithEmail && studentWithEmail.id !== student.id) {
      return res.status(400).json({ error: 'email already in use' });
    }

    await student.update(req.body);

    return res.json(student);
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);

    // Check if there is a student with the given id
    if (!student) {
      return res.status(400).json({ error: 'student not found' });
    }

    await student.destroy();

    return res.send();
  }
}

export default new StudentController();
