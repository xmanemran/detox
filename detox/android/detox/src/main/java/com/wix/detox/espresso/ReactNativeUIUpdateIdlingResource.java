package com.wix.detox.espresso;

import android.support.annotation.NonNull;
import android.support.test.espresso.IdlingResource;
import android.util.Log;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created by simonracz on 26/07/2017.
 */

/**
 * <p>
 * Espresso IdlingResource for React Native's UI Module.
 * </p>
 *
 * <p>
 * Hooks up to React Native internals to grab the pending ui operations from it.
 * </p>
 */
public class ReactNativeUIUpdateIdlingResource implements IdlingResource {
    private static final String LOG_TAG = "Detox";

    private ResourceCallback callback = null;

    private AtomicBoolean idleNow = new AtomicBoolean(true);

    @Override
    public String getName() {
        return ReactNativeUIUpdateIdlingResource.class.getName();
    }

    @Override
    public boolean isIdleNow() {
        boolean ret = idleNow.get();
        if (!ret) {
            Log.i(LOG_TAG, "UI Update Listener is busy");
        }
        return ret;
    }

    @Override
    public void registerIdleTransitionCallback(ResourceCallback callback) {
        this.callback = callback;     
    }

    // Proxy calls it
    public void onViewHierarchyUpdateFinished() {
        idleNow.set(true);
        if (callback != null) {
            callback.onTransitionToIdle();
        }
        Log.i(LOG_TAG, "UI UPDATE LISTENER transitions to idle.");
    }

    //Proxy calls it
    public void onViewHierarchyUpdateEnqueued() {
        idleNow.set(false);
        Log.i(LOG_TAG, "UI UPDATE LISTENER transitions to busy.");
    }
    
}
