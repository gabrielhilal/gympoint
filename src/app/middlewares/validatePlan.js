import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    title: Yup.string().required(),
    duration: Yup.number()
      .integer()
      .positive()
      .required(),
    price: Yup.number()
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
