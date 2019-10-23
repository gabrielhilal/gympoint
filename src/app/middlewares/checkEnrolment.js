import Enrolment from '../models/Enrolment';

export default async (req, res, next) => {
  const enrolment = await Enrolment.findByPk(req.params.id);

  if (!enrolment) {
    return res.status(400).json({ error: 'enrolment not found' });
  }

  return next();
};
