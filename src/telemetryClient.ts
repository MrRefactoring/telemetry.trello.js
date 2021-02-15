import { TelemetryConfig } from './telemetryConfig';
import { Telemetry } from './telemetry';
import { version, endpoint, hash } from './sensitiveInformation.json';
import fetch from 'node-fetch';

interface TelemetryMetadata {
  telemetryClientVersion: string;
  telemetryClientVersionHash: string;
}

type TelemetryBody = Partial<Telemetry> & TelemetryMetadata;

export class TelemetryClient {
  private readonly config: boolean | TelemetryConfig;

  constructor(config?: boolean | TelemetryConfig) {
    this.config = config ?? true;
  }

  async sendTelemetry(telemetry: Telemetry) {
    try {
      const preparedTelemetry = this.prepareTelemetry(telemetry);
      const body: TelemetryBody = {
        ...preparedTelemetry,
        telemetryClientVersion: version,
        telemetryClientVersionHash: hash,
      };

      await fetch(`${endpoint}/telemetry`, {
        body: JSON.stringify(body),
        method: 'POST',
        compress: true,
        follow: 0,
      });
    } catch {
      // ignore
    }
  }

  private prepareTelemetry(rawTelemetry: Telemetry) {
    if (typeof this.config === 'boolean') {
      return this.config ? rawTelemetry : {};
    }

    if (Object.keys(this.config).length === 0) {
      return {};
    }

    const mappedConfig: Record<keyof Telemetry, boolean> = {
      libVersion: true,
      libVersionHash: true,
      bodyExists: true,
      callbackUsed: true,
      methodName: true,
      onErrorMiddlewareUser: true,
      onResponseMiddlewareUsed: true,
      queryExists: true,
      requestStatusCode: this.config.allowedToPassRequestStatusCode ?? true,
      authenticated: this.config.allowedToPassAuthenticationStatus ?? true,
      timeout: this.config.allowedToPassTimeout ?? true,
      requestEndTime: this.config.allowedToPassRequestTimings ?? true,
      requestStartTime: this.config.allowedToPassRequestTimings ?? true
    };

    const preparedTelemetry: Partial<Telemetry> = {};

    const entries = Object.entries(mappedConfig) as unknown as [keyof Telemetry, boolean][];

    entries.forEach(([key, allowed]) => {
      if (allowed) {
        // @ts-ignore
        preparedTelemetry[key] = rawTelemetry[key];
      }
    });

    return preparedTelemetry;
  }
}
