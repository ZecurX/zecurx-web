import { query } from '@/lib/db';

export async function getEmailTemplate(templateName: string, variables: Record<string, string>) {
    const result = await query<{ subject: string; body: string }>(
        `SELECT * FROM email_templates WHERE name = $1 AND is_active = true`,
        [templateName]
    );

    const template = result.rows[0];
    if (!template) {
        return null;
    }

    let subject = template.subject;
    let body = template.body;

    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, value || '');
        body = body.replace(regex, value || '');
    });

    return { subject, body, template };
}
