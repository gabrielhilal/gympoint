import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }) {
    const { student, helpOrder } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Respondemos sua pergunta',
      template: 'help_order_answer',
      context: {
        student: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new HelpOrderAnswerMail();
