import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

// Format personnalisé pour les logs
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });
  
  const logger = createLogger({
    level: 'info', // Niveau minimum de log
    format: combine(
      timestamp(),
      myFormat
    ),
    transports: [
      new transports.Console(), // Transport vers la console
      new transports.File({ filename: 'info.log' }) // Transport vers un fichier
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'exceptions.log' }) // Fichier dédié pour les exceptions
      ],
      rejectionHandlers: [
        new transports.File({ filename: 'rejections.log' }) // Fichier dédié pour les promesses rejetées
      ]
  });


  // Attraper les erreurs non gérées et les rejets de promesses
process.on('uncaughtException', (error) => {
    logger.error('Erreur non gérée', error);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Rejet de promesse non géré', reason);
  });

  export  {logger}