namespace CdvPurchase
{
    /**
     * Desired logging level for the {@link Logger}
     *
     * @see {@link Store.verbosity}
     */
    export enum LogLevel {
        /** Disable all logging (default) */
        QUIET = 0,
        /** Show only error messages */
        ERROR = 1,
        /** Show warnings and errors */
        WARNING = 2,
        /** Also show information messages */
        INFO = 3,
        /** Enable internal debugging messages. */
        DEBUG = 4,
    };

    /** @internal */
    export interface VerbosityProvider {
        verbosity: LogLevel | boolean;
    }

    export class Logger {

        /** All log lines are prefixed with this string */
        private prefix: string = '';

        /**
         * Object that provides the desired level of verbosity
         */
        private store: VerbosityProvider;

        /** @internal */
        constructor(store: VerbosityProvider, prefix: string = '') {
            this.store = store;
            this.prefix = prefix || 'CdvPurchase';
        }

        /**
         * Create a child logger, whose prefix will be this one's + the given string.
         *
         * @example
         * const log = store.log.child('AppStore')
         */
        child(prefix: string): Logger {
            return new Logger(this.store, this.prefix + '.' + prefix);
        }

        /**
         * Logs an error message, only if `store.verbosity` >= store.ERROR
         */
        error(o: any) {
            log(this.store.verbosity, LogLevel.ERROR, this.prefix, o);
            // show the stack trace
            try {
                throw new Error(toString(o));
            } catch (e) {
                log(this.store.verbosity, LogLevel.ERROR, this.prefix, (e as Error).stack);
            }
        }

        /**
         * Logs a warning message, only if `store.verbosity` >= store.WARNING
         */
        warn(o: any) { log(this.store.verbosity, LogLevel.WARNING, this.prefix, o); }

        /**
         * Logs an info message, only if `store.verbosity` >= store.INFO
         */
        info(o: any) { log(this.store.verbosity, LogLevel.INFO, this.prefix, o); }

        /**
         * Logs a debug message, only if `store.verbosity` >= store.DEBUG
         */
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

        /**
         * Console object used to display log lines.
         *
         * It can be replaced by your implementation if you want to, for example, send logs to a remote server.
         *
         * @example
         * Logger.console = {
         *   log: (message) => { remoteLog('LOG', message); }
         *   warn: (message) => { remoteLog('WARN', message); }
         *   error: (message) => { remoteLog('ERROR', message); }
         * }
         */
        static console: Console = window.console;
    }

    /**
     * Interface to implement to provide custom logging facility.
     */
    export interface Console {
        log(message: string): void;
        warn(message: string): void;
        error(message: string): void;
    }

    const LOG_LEVEL_STRING = ["QUIET", "ERROR", "WARNING", "INFO", "DEBUG"];

    function toString(o: any) {
        if (typeof o !== 'string')
            o = JSON.stringify(o);
        return o;
    }

    function log(verbosity: boolean | LogLevel, level: LogLevel, prefix: string, o: any) {
        var maxLevel = verbosity === true ? 1 : verbosity;
        if (level > maxLevel)
            return;

        if (typeof o !== 'string')
            o = JSON.stringify(o);

        const fullPrefix = prefix ? `[${prefix}] ` : '';

        const logStr =
            (level === LogLevel.ERROR) ? ((str: string) => Logger.console.error(str))
                : (level === LogLevel.WARNING) ? ((str: string) => Logger.console.warn(str))
                    : ((str: string) => Logger.console.log(str));

        if (LOG_LEVEL_STRING[level])
            logStr(`${fullPrefix}${LOG_LEVEL_STRING[level]}: ${o}`);
        else
            logStr(`${fullPrefix}${o}`);
    }
}
