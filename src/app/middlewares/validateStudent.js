import * as Yup from 'yup';
import Student from '../models/Student';

export default async (req, res, next) => {
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

  try {
    await schema.validate(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.errors });
  }

  const studentWithEmail = await Student.findOne({
    where: { email: req.body.email },
  });

  if (studentWithEmail && studentWithEmail.id !== parseInt(req.params.id, 10)) {
    return res.status(400).json({ error: 'email already in use' });
  }

  return next();
};
