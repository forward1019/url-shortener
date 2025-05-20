import { plainToClass } from 'class-transformer';
import { IsString, IsOptional, IsNumber, validateSync, IsIn } from 'class-validator';
export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  APP_DOMAIN: string;

  @IsNumber()
  @IsOptional()
  PORT: number;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsIn(['development', 'production', 'test'])
  @IsOptional()
  NODE_ENV: string;

  @IsString()
  SUPABASE_URL: string;

  @IsString()
  SUPABASE_ANON_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
