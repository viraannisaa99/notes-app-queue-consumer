// consumer dari queue

require('dotenv').config();
const amqp = require('amqplib');
const NotesService = require('./NotesService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
  const notesService = new NotesService();
  const mailSender = new MailSender();
  const listener = new Listener(notesService, mailSender);

  // buat koneksi dan channel
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  // pastikan queue export:notes telah tersedia
  await channel.assertQueue('export:notes', {
    durable: true,
  });

  // panggil listener untuk mengkonsumsi queue
  channel.consume('export:notes', listener.listen, { noAck: true });
};

init();
