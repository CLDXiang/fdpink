import * as hbs from 'handlebars';
import * as fs from 'fs';
import { join } from 'path';

export enum MailTemplateType {
  Test = 'test',
  Activate = 'activate',
  ResetPassword = 'reset-password',
  ResetMail = 'reset-mail',
}

export const mailRegex = /@fudan.edu.cn|@m.fudan.edu.cn/;

export interface MailTemplate {
  type: MailTemplateType;
  subject: string;
  template: any;
  defaultArgs: object;
}

function makeTemplate(tp: MailTemplateType, subject: string, defaultArgs: object): MailTemplate {
  const templateStr = fs.readFileSync(join(__dirname, '..', '..', 'views', 'mail', `${tp}.hbs`)).toString();
  const template = hbs.compile(templateStr);
  return {
    type: tp,
    template,
    subject,
    defaultArgs,
  };
}

const templates = new Map([
  [
    MailTemplateType.Test,
    makeTemplate(MailTemplateType.Test, 'An email from fdpink', { code: 123456, receiver: 'test' }),
  ],
  [
    MailTemplateType.Activate,
    makeTemplate(MailTemplateType.Activate, 'Welcome to fdpink', { code: 123456, receiver: 'test' }),
  ],
  [
    MailTemplateType.ResetPassword,
    makeTemplate(MailTemplateType.ResetPassword, 'Reset password on fdpink', {
      code: 123456,
      receiver: 'test',
    }),
  ],
  [
    MailTemplateType.ResetMail,
    makeTemplate(MailTemplateType.ResetMail, 'Reset binded mail on fdpink', {
      code: 123456,
      receiver: 'test',
    }),
  ],
]);

export function getTemplate(tp: MailTemplateType): MailTemplate {
  return templates.get(tp);
}

export function render(tp: MailTemplateType, args?: object): string {
  const template = templates.get(tp);
  return template.template(args || template.defaultArgs);
}
