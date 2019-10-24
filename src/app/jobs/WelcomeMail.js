import { parseISO, format } from 'date-fns';
import Mail from '../../lib/Mail';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { student, plan, enrolment } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem-vindo à GymPoint',
      template: 'welcome',
      context: {
        student: student.name,
        plan: plan.title,
        price: `R$${enrolment.price}`,
        start_date: format(parseISO(enrolment.start_date), 'dd/MM/yyyy'),
        end_date: format(parseISO(enrolment.end_date), 'dd/MM/yyyy'),
      },
    });
  }
}

export default new WelcomeMail();
