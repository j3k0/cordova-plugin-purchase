package cc.fovea;

public class Constants {

  //
  // Error codes
  //
  // KEEP SYNCHRONIZED with src/ts/error-codes.ts
  //
  public static final int ERROR_CODES_BASE = 6777000;

  public static final int ERR_SETUP = ERROR_CODES_BASE + 1;
  public static final int ERR_LOAD = ERROR_CODES_BASE + 2;
  public static final int ERR_PURCHASE = ERROR_CODES_BASE + 3;
  public static final int ERR_CANCELLED = ERROR_CODES_BASE + 6;
  public static final int ERR_UNKNOWN = ERROR_CODES_BASE + 10;
  public static final int ERR_FINISH = ERROR_CODES_BASE + 13;
  public static final int ERR_COMMUNICATION = ERROR_CODES_BASE + 14;
  public static final int ERR_SUBSCRIPTIONS_NOT_AVAILABLE = ERROR_CODES_BASE + 15;
  public static final int ERR_MISSING_TOKEN = ERROR_CODES_BASE + 16;
  public static final int ERR_VERIFICATION_FAILED = ERROR_CODES_BASE + 17;
  public static final int ERR_BAD_RESPONSE = ERROR_CODES_BASE + 18;
  public static final int ERR_REFRESH = ERROR_CODES_BASE + 19;
  public static final int ERR_PAYMENT_EXPIRED = ERROR_CODES_BASE + 20;
  public static final int ERR_DOWNLOAD = ERROR_CODES_BASE + 21;
  public static final int ERR_SUBSCRIPTION_UPDATE_NOT_AVAILABLE = ERROR_CODES_BASE + 22;

}
