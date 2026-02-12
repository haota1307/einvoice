import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';
class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  constructor() {
    super();
    this.validate();
    this.APP_CONFIG.validate();
  }
}

export const CONFIGURATION = new Configuration();
export type TConfiguration = typeof CONFIGURATION;
