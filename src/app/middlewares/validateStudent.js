import * as Yup from 'yup';

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

  return next();
};
