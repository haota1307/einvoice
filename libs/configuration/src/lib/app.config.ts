import { Logger } from '@nestjs/common';
import { IsNumber, validateSync } from 'class-validator';

export class AppConfiguration {
  @IsNumber()
  PORT: number;

  constructor() {
    this.PORT = Number(process.env['PORT']) || 3300;
  }

  validate() {
    const errors = validateSync(this);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => error.constraints);
      Logger.error(formattedErrors, 'AppConfiguration');
      throw new Error('AppConfiguration is invalid');
    }
  }
}
