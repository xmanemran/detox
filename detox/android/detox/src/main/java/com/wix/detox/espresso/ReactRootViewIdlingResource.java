package com.wix.detox.espresso;

import android.support.annotation.NonNull;
import android.support.test.espresso.IdlingResource;
import android.util.Log;
import android.view.Choreographer;

import org.joor.Reflect;
import org.joor.ReflectException;

/**
 * Created by simonracz on 06/04/2018.
 */

/**
 * <p>
 * Espresso IdlingResource for React Native's RootViews layout requests.
 * </p>
 *
 */
public class ReactRootViewIdlingResource implements IdlingResource, Choreographer.FrameCallback {
    private static final String LOG_TAG = "Detox";

    private final static String CLASS_UI_MANAGER_MODULE = "com.facebook.react.uimanager.UIManagerModule";

    private final static String METHOD_HAS_CATALYST_INSTANCE = "hasActiveCatalystInstance";
    private final static String METHOD_GET_NATIVE_MODULE = "getNativeModule";
    private final static String METHOD_HAS_NATIVE_MODULE = "hasNativeModule";
    private final static String METHOD_GET_UI_IMPLEMENTATION = "getUIImplementation";
    private final static String METHOD_GET_UI_OPERATION_QUEUE = "getUIViewOperationQueue";
    private final static String METHOD_GET_VIEW_MANAGER = "getNativeViewHierarchyManager";
    private final static String METHOD_IS_EMPTY = "isEmpty";
    private final static String METHOD_VALUE_AT = "valueAt";
    private final static String METHOD_SIZE = "size";
    private final static String METHOD_IS_LAYOUT_REQUESTED = "isLayoutRequested";
    private final static String FIELD_GET_TAGS_TO_VIEWS = "mTagsToViews";    
    private final static String FIELD_DISPATCH_RUNNABLES = "mDispatchUIRunnables";
    private final static String FIELD_NON_BATCHES_OPERATIONS = "mNonBatchedOperations";
    private final static String LOCK_RUNNABLES = "mDispatchRunnablesLock";
    private final static String LOCK_OPERATIONS = "mNonBatchedOperationsLock";

    private ResourceCallback callback = null;
    private Object reactContext = null;

    public ReactRootViewIdlingResource(@NonNull Object reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return ReactRootViewIdlingResource.class.getName();
    }

    @Override
    public boolean isIdleNow() {
        Class<?> uiModuleClass = null;
        try {
            uiModuleClass = Class.forName(CLASS_UI_MANAGER_MODULE);
        } catch (ClassNotFoundException e) {
            Log.e(LOG_TAG, "UIManagerModule is not on classpath.");
            if (callback != null) {
                callback.onTransitionToIdle();
            }
            return true;
        }

        try {
            // reactContext.hasActiveCatalystInstance() should be always true here
            // if called right after onReactContextInitialized(...)
            if (!(boolean) Reflect.on(reactContext).call(METHOD_HAS_CATALYST_INSTANCE).get()) {
                Log.e(LOG_TAG, "No active CatalystInstance. Should never see this.");
                return false;
            }

            if (!(boolean)Reflect.on(reactContext).call(METHOD_HAS_NATIVE_MODULE, uiModuleClass).get()) {
                Log.e(LOG_TAG, "Can't find UIManagerModule.");
                if (callback != null) {
                    callback.onTransitionToIdle();
                }
                return true;
            }

            Object viewManager = Reflect.on(reactContext)
                    .call(METHOD_GET_NATIVE_MODULE, uiModuleClass)
                    .call(METHOD_GET_UI_IMPLEMENTATION)
                    .call(METHOD_GET_UI_OPERATION_QUEUE)
                    .call(METHOD_GET_VIEW_MANAGER)
                    .get();
            Object tagsToViews = Reflect.on(viewManager)
                    .field(FIELD_GET_TAGS_TO_VIEWS)
                    .get();

            int nsize = Reflect.on(tagsToViews).call(METHOD_SIZE).get();

            boolean layoutBitSet = false;
            for (int i = 0; i < nsize; i++) {
                layoutBitSet = (boolean) Reflect.on(tagsToViews)
                    .call(METHOD_VALUE_AT, i)
                    .call(METHOD_IS_LAYOUT_REQUESTED)
                    .get();
                if (layoutBitSet) {
                    Choreographer.getInstance().postFrameCallback(this);
                    Log.i(LOG_TAG, "LayoutRequestIR is busy in tag: " + Integer.toString(i));
                    return false;
                }
            }            
            
            if (callback != null) {
               callback.onTransitionToIdle();
            }            
            return true;
        } catch (ReflectException e) {
            Log.e(LOG_TAG, "Can't set up LayoutRequestIR", e.getCause());
        }

        if (callback != null) {
            callback.onTransitionToIdle();
        }
        return true;
    }

    @Override
    public void registerIdleTransitionCallback(ResourceCallback callback) {
        this.callback = callback;

        Choreographer.getInstance().postFrameCallback(this);
    }

    @Override
    public void doFrame(long frameTimeNanos) {
        isIdleNow();
    }
}


