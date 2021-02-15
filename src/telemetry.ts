export interface Telemetry {
  libVersion: string;
  libVersionHash: string;
  methodName: string;
  authenticated: boolean;
  callbackUsed: boolean;
  onResponseMiddlewareUsed: boolean;
  onErrorMiddlewareUser: boolean;
  queryExists: boolean;
  bodyExists: boolean;
  requestStatusCode: number;
  requestStartTime: Date;
  requestEndTime: Date;
  timeout: number;
}
