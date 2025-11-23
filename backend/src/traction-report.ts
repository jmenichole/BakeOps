import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const transporter = nodemailer.createTransport({
  service: 'Outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function generateTractionReport() {
  try {
    const { data: waitlist, error } = await supabase
      .from('waitlist')
      .select('*');

    if (error) {
      throw new Error(`Error fetching waitlist: ${error.message}`);
    }

    const emailContent = `
      <h1>Monthly Traction Report</h1>
      <p>Total Waitlist Signups: ${waitlist.length}</p>
      <ul>
        ${waitlist.map((entry) => `<li>${entry.email}</li>`).join('')}
      </ul>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'jmenichole007@outlook.com',
      subject: 'Monthly Traction Report',
      html: emailContent,
    });

    console.log('Traction report sent successfully!');
  } catch (error) {
    console.error('Error generating traction report:', error);
  }
}

// Schedule the report to run on the 1st of every month
const schedule = require('node-schedule');
schedule.scheduleJob('0 0 1 * *', generateTractionReport);