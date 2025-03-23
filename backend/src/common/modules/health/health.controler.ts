import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { IAppConfig } from 'src/common/configs/app.config';
import { ConfigNames } from 'src/common/types/enums/configNames.enum';

@Controller()
export class HealthController {
  private _config: IAppConfig;

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private readonly _configService: ConfigService,
  ) {
    this._config = this._configService.getOrThrow<IAppConfig>(ConfigNames.APP);
  }

  @Get('health')
  @HealthCheck()
  async check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'api',
          `http://localhost:${this._config.port}/api/docs`,
        ),
      () => this.db.pingCheck('database'),
    ]);
  }
}
