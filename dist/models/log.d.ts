export interface ILogMeasurement {
    procId: number;
    host: string;
    message: string;
    severity: Severity;
    severity_code?: number;
    facility?: string;
    facility_code?: number;
    version: number;
}
export declare enum Severity {
    EMERGENCY = "emerg",
    ALERT = "alert",
    CRITICAL = "crit",
    ERROR = "err",
    WARNING = "warning",
    NOTICE = "notice",
    INFO = "info",
    DEBUG = "debug"
}
