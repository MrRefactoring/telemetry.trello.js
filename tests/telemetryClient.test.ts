import { Telemetry, TelemetryClient } from '../src';

const startDate = new Date(1);
const endDate = new Date(2);

const telemetryMock: Telemetry = {
  libVersion: '2.0.0',
  libVersionHash: 'd233662f9c26d1a06118c93ef2fd1de9',
  requestStatusCode: 200,
  methodName: 'getProjects',
  authenticated: true,
  callbackUsed: false,
  onResponseMiddlewareUsed: false,
  onErrorMiddlewareUser: false,
  queryExists: true,
  bodyExists: false,
  requestStartTime: startDate,
  requestEndTime: endDate,
  timeout: 0,
};

describe('TelemetryClient', () => {
  it('should be defined', () => {
    expect(TelemetryClient).toBeDefined();
  });

  it('should accept \'undefined\' config value', () => {
    const telemetryClient = new TelemetryClient();

    // @ts-ignore
    expect(telemetryClient.config).toBeDefined();
    // @ts-ignore
    expect(telemetryClient.config).toBeTruthy();
  });

  it('should accept \'false\' config value', () => {
    const telemetryClient = new TelemetryClient(false);

    // @ts-ignore
    expect(telemetryClient.config).toBeDefined();
    // @ts-ignore
    expect(telemetryClient.config).toBeFalsy();
  });

  it('should accept \'true\' config value', () => {
    const telemetryClient = new TelemetryClient(true);

    // @ts-ignore
    expect(telemetryClient.config).toBeTruthy();
  });

  it('should accept empty config value', () => {
    const telemetryClient = new TelemetryClient({});

    // @ts-ignore
    expect(telemetryClient.config).toEqual({});
  });

  it('should accept full config value', () => {
    const telemetryClient = new TelemetryClient({
      allowedToPassRequestTimings: true,
      allowedToPassTimeout: true,
      allowedToPassAuthenticationStatus: true,
      allowedToPassRequestStatusCode: true,
    });

    // @ts-ignore
    expect(telemetryClient.config).toEqual({
      allowedToPassRequestTimings: true,
      allowedToPassTimeout: true,
      allowedToPassAuthenticationStatus: true,
      allowedToPassRequestStatusCode: true,
    });
  });

  it('should accept partial filled config value', () => {
    const telemetryClient = new TelemetryClient({
      allowedToPassAuthenticationStatus: false,
    });

    // @ts-ignore
    expect(telemetryClient.config).toEqual({
      allowedToPassRequestTimings: undefined,
      allowedToPassTimeout: undefined,
      allowedToPassAuthenticationStatus: false,
      allowedToPassRequestStatus: undefined,
    });
  });

  describe('prepareTelemetry method', () => {
    it('should not send telemetry when config is \'false\'', () => {
      const telemetryClient = new TelemetryClient(false);

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual({});
    });

    it('should return empty telemetry data case 1', () => {
      const telemetryClient = new TelemetryClient({});

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual({});
    });

    it('should return empty telemetry data case 2', () => {
      const telemetryClient = new TelemetryClient(false);

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual({});
    });

    it('should return empty telemetry data case 3', () => {
      const telemetryClient = new TelemetryClient({
        allowedToPassRequestTimings: false,
        allowedToPassTimeout: false,
        allowedToPassAuthenticationStatus: false,
        allowedToPassRequestStatusCode: false,
      });

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual({
        bodyExists: false,
        callbackUsed: false,
        libVersion: '2.0.0',
        libVersionHash: 'd233662f9c26d1a06118c93ef2fd1de9',
        methodName: 'getProjects',
        onErrorMiddlewareUser: false,
        onResponseMiddlewareUsed: false,
        queryExists: true,
      });
    });

    it('should return full telemetry data case 1', () => {
      const telemetryClient = new TelemetryClient();

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual(telemetryMock);
    });

    it('should return full telemetry data case 2', () => {
      const telemetryClient = new TelemetryClient(true);

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual(telemetryMock);
    });

    it('should return full telemetry data case 3', () => {
      const telemetryClient = new TelemetryClient({
        allowedToPassRequestStatusCode: true,
        allowedToPassAuthenticationStatus: true,
      });

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual(telemetryMock);
    });

    it('should return only request status', () => {
      const telemetryClient = new TelemetryClient({
        allowedToPassAuthenticationStatus: false,
      });

      // @ts-ignore
      const preparedTelemetry = telemetryClient.prepareTelemetry(telemetryMock);

      expect(preparedTelemetry).toEqual({
        ...telemetryMock,
        authenticated: undefined,
      });
    });
  });
});
