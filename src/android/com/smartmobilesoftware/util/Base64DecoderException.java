

package com.smartmobilesoftware.util;

/**
 * Exception thrown when encountering an invalid Base64 input character.
 *
 * @author ASMAN
 */
public class Base64DecoderException extends Exception {
    public Base64DecoderException() {
        super();
    }

    public Base64DecoderException(String s) {
        super(s);
    }

    private static final long serialVersionUID = 1L;
}
