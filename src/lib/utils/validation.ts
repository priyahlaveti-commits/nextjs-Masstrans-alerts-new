/**
 * Validation utilities for API request body validation
 */

export interface GetAlarmCountRequest {
  vehicleNumber: string;
  alarmName: string;
  date: string;
}

export interface GetAlarmDetailRequest {
  vehicleNumber: string;
  date: string;
}

export interface SendEmailRequest {
  vehicleNumber: string;
  date: string;
  emails: string[];
}

export function validateAlarmCountRequest(body: any): GetAlarmCountRequest {
  if (!body.vehicleNumber || typeof body.vehicleNumber !== 'string') {
    throw new Error('vehicleNumber is required and must be a string');
  }
  if (!body.alarmName || typeof body.alarmName !== 'string') {
    throw new Error('alarmName is required and must be a string');
  }
  if (!body.date || typeof body.date !== 'string') {
    throw new Error('date is required and must be a string (YYYY-MM-DD)');
  }
  return {
    vehicleNumber: body.vehicleNumber,
    alarmName: body.alarmName,
    date: body.date,
  };
}

export function validateAlarmDetailRequest(body: any): GetAlarmDetailRequest {
  if (!body.vehicleNumber || typeof body.vehicleNumber !== 'string') {
    throw new Error('vehicleNumber is required and must be a string');
  }
  if (!body.date || typeof body.date !== 'string') {
    throw new Error('date is required and must be a string (YYYY-MM-DD)');
  }
  return {
    vehicleNumber: body.vehicleNumber,
    date: body.date,
  };
}

export function validateSendEmailRequest(body: any): SendEmailRequest {
  if (!body.vehicleNumber || typeof body.vehicleNumber !== 'string') {
    throw new Error('vehicleNumber is required and must be a string');
  }
  if (!body.date || typeof body.date !== 'string') {
    throw new Error('date is required and must be a string (YYYY-MM-DD)');
  }
  if (!Array.isArray(body.emails) || body.emails.length === 0) {
    throw new Error('emails is required and must be a non-empty array');
  }
  return {
    vehicleNumber: body.vehicleNumber,
    date: body.date,
    emails: body.emails,
  };
}
