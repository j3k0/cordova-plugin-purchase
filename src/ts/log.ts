namespace CDVPurchase2
{
    export enum LogLevel {
        QUIET = 0,
        ERROR = 1,
        WARNING = 2,
        INFO = 3,
        DEBUG = 4,
    };

    export interface VerbosityProvider {
        verbosity: LogLevel | boolean;
    }

    export class Logger {

        private prefix: string = '';

        private store: VerbosityProvider;

        constructor(store: VerbosityProvider, prefix: string = '') {
            this.store = store;
            this.prefix = prefix || 'CordovaPurchase';
        }

        child(prefix: string): Logger {
            return new Logger(this.store, this.prefix + '.' + prefix);
        }

        /// ### `store.log.error(message)`
        /// Logs an error message, only if `store.verbosity` >= store.ERROR
        error(o: any) { log(this.store.verbosity, LogLevel.ERROR, this.prefix, o); }

        /// ### `store.log.warn(message)`
        /// Logs a warning message, only if `store.verbosity` >= store.WARNING
        warn(o: any) { log(this.store.verbosity, LogLevel.WARNING, this.prefix, o); }

        /// ### `store.log.info(message)`
        /// Logs an info message, only if `store.verbosity` >= store.INFO
        info(o: any) { log(this.store.verbosity, LogLevel.INFO, this.prefix, o); }

        /// ### `store.log.debug(message)`
        /// Logs a debug message, only if `store.verbosity` >= store.DEBUG
        debug(o: any) { log(this.store.verbosity, LogLevel.DEBUG, this.prefix, o); }

        /**
         * Add warning logs on a console describing an exceptions.
         *
         * This method is mostly used when executing user registered callbacks.
         *
         * @param context - a string describing why the method was called
         * @param error - a javascript Error object thrown by a exception
         */
        logCallbackException(context: string, err: Error | string) {
            this.warn("A callback in \'" + context + "\' failed with an exception.");
            if (typeof err === 'string')
                this.warn("           " + err);
            else if (err) {
                const errAny = err as any;
                if (errAny.fileName)
                    this.warn("           " + errAny.fileName + ":" + errAny.lineNumber);
                if (err.message)
                    this.warn("           " + err.message);
                if (err.stack)
                    this.warn("           " + err.stack);
            }
        }
    }

    const LOG_LEVEL_STRING = ["QUIET", "ERROR", "WARNING", "INFO", "DEBUG"];

    function log(verbosity: boolean | LogLevel, level: LogLevel, prefix: string, o: any) {
        var maxLevel = verbosity === true ? 1 : verbosity;
        if (level > maxLevel)
            return;

        if (typeof o !== 'string')
            o = JSON.stringify(o);

        const fullPrefix = prefix ? `[${prefix}] ` : '';

        const logStr =
            (level === LogLevel.ERROR) ? ((str: string) => console.error(str))
                : (level === LogLevel.WARNING) ? ((str: string) => console.warn(str))
                    : ((str: string) => console.log(str));

        if (LOG_LEVEL_STRING[level])
            logStr(`${fullPrefix}${LOG_LEVEL_STRING[level]}: ${o}`);
        else
            logStr(`${fullPrefix}${o}`);
    }
}
