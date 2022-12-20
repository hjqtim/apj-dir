package com.crm.crmservice.config;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;

public class ResettableServletInputStreamWrapper extends ServletInputStream {
    private final ByteArrayInputStream input;

    public ResettableServletInputStreamWrapper(byte[] data) {
        this.input = new ByteArrayInputStream(data);
    }

    public boolean isFinished() {
        return false;
    }

    public boolean isReady() {
        return false;
    }

    public void setReadListener(ReadListener listener) {
    }

    public int read() throws IOException {
        return this.input.read();
    }

    public synchronized void reset() throws IOException {
        this.input.reset();
    }
}
