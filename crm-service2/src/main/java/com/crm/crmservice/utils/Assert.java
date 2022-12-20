package com.crm.crmservice.utils;


import com.crm.crmservice.common.enums.ResultCode;
import com.crm.crmservice.exception.CustomException;
import org.springframework.lang.Nullable;
import org.springframework.util.ObjectUtils;

/**
 * 断言
 *
 * @author LCB371
 */
public class Assert {

    public static <T> T checkNotNull(T reference, @Nullable Object errorMessage) {
        if (ObjectUtils.isEmpty(reference)) {
            throw new CustomException(ResultCode.BUSINESS_ERROR, String.valueOf(errorMessage));
        }
        return reference;
    }

    public static void checkArgument(boolean expression, @Nullable Object errorMessage) {
        if (!expression) {
            throw new CustomException(ResultCode.BUSINESS_ERROR, String.valueOf(errorMessage));
        }
    }
}
