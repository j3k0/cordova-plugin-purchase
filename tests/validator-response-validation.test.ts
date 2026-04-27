import '../www/store';

describe('isValidatorResponsePayload', () => {
  describe('when ok is true', () => {
    test('rejects payload missing data field', () => {
      const payload = { ok: true };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(false);
    });

    test('rejects payload with data missing id', () => {
      const payload = { ok: true, data: { latest_receipt: true, transaction: { type: 'test' } } };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(false);
    });

    test('rejects payload with data missing latest_receipt', () => {
      const payload = { ok: true, data: { id: 'com.test.product', transaction: { type: 'test' } } };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(false);
    });

    test('rejects payload with data missing transaction', () => {
      const payload = { ok: true, data: { id: 'com.test.product', latest_receipt: true } };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(false);
    });

    test('rejects payload with data.id not a string', () => {
      const payload = { ok: true, data: { id: 123, latest_receipt: true, transaction: { type: 'test' } } };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(false);
    });

    test('rejects payload with data.latest_receipt not a boolean', () => {
      const payload = { ok: true, data: { id: 'com.test.product', latest_receipt: 'yes', transaction: { type: 'test' } } };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(false);
    });

    test('rejects payload with data.transaction not an object', () => {
      const payload = { ok: true, data: { id: 'com.test.product', latest_receipt: true, transaction: 'invalid' } };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(false);
    });
  });

  describe('when ok is false', () => {
    test('accepts payload without data', () => {
      const payload = { ok: false, code: CdvPurchase.ErrorCode.BAD_RESPONSE, message: 'Invalid' };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(true);
    });

    test('accepts payload with data', () => {
      const payload = { ok: false, code: CdvPurchase.ErrorCode.BAD_RESPONSE, message: 'Invalid', data: { latest_receipt: true } };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(true);
    });
  });

  describe('invalid payloads', () => {
    test('rejects null', () => {
      expect(CdvPurchase.Internal.isValidatorResponsePayload(null)).toBe(false);
    });

    test('rejects undefined', () => {
      expect(CdvPurchase.Internal.isValidatorResponsePayload(undefined)).toBe(false);
    });

    test('rejects string', () => {
      expect(CdvPurchase.Internal.isValidatorResponsePayload('ok')).toBe(false);
    });

    test('rejects object without ok field', () => {
      expect(CdvPurchase.Internal.isValidatorResponsePayload({ data: {} })).toBe(false);
    });
  });

  describe('valid success payloads', () => {
    test('accepts well-formed success payload', () => {
      const payload = {
        ok: true,
        data: {
          id: 'com.test.product',
          latest_receipt: true,
          transaction: { type: 'test' },
        },
      };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(true);
    });

    test('accepts success payload with optional collection field', () => {
      const payload = {
        ok: true,
        data: {
          id: 'com.test.product',
          latest_receipt: true,
          transaction: { type: 'test' },
          collection: [{ id: 'com.test.product', transactionId: 'txn1' }],
        },
      };
      expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(true);
    });
  });
});

describe('Validator.runValidatorRequest invalid response handling', () => {
  test('isValidatorResponsePayload returns false for ok:true with missing data', () => {
    const payload = { ok: true } as unknown;
    expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(false);
  });

  test('isValidatorResponsePayload returns true for valid success payload', () => {
    const payload = {
      ok: true,
      data: {
        id: 'com.example.product',
        latest_receipt: true,
        transaction: { type: 'android-playstore', purchaseToken: 'token' },
      },
    };
    expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(true);
  });

  test('isValidatorResponsePayload returns true for error payload without data', () => {
    const payload = {
      ok: false,
      code: CdvPurchase.ErrorCode.BAD_RESPONSE,
      message: 'Something went wrong',
    };
    expect(CdvPurchase.Internal.isValidatorResponsePayload(payload)).toBe(true);
  });
});