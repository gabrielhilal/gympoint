import Plan from '../models/Plan';

export default async (req, res, next) => {
  const plan = await Plan.findByPk(req.params.id);

  if (!plan) {
    return res.status(400).json({ error: 'plan not found' });
  }

  return next();
};
