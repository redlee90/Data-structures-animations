package com.redlee90.linuxkerneldatastructures;

import android.content.DialogInterface;
import android.os.Bundle;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;

import com.redlee90.linuxkerneldatastructures.util.IabHelper;
import com.redlee90.linuxkerneldatastructures.util.IabResult;
import com.redlee90.linuxkerneldatastructures.util.Purchase;

public class MainActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {
    private static final String TAG = "MainActivity";
    private static final String SKU_DONATION_KEY_99 = "donation_key_99";
    private static final String SKU_DONATION_KEY_199 = "donation_key_199";
    private static final int RC_REQUEST = 99;
    private WebView mWebView;
    private WebSettings webSettings;
    private IabHelper mHelper;
    private IabHelper.OnIabPurchaseFinishedListener mPurchasedFinishedListener = new IabHelper.OnIabPurchaseFinishedListener() {
        @Override
        public void onIabPurchaseFinished(IabResult result, Purchase info) {
            if (result.isSuccess()) {
                if (info.getSku().equals(SKU_DONATION_KEY_99)) {
                    Log.d(TAG, "Purchased 0.99 successfully");
                } else if (info.getSku().equals(SKU_DONATION_KEY_199)) {
                    Log.d(TAG, "Purchased 1.99 successfully");
                }
            } else {
                Log.d(TAG, result.getMessage());
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        mWebView = (WebView) findViewById(R.id.webview);
        webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        mWebView.loadUrl("file:///android_asset/index.html");

        String base64EncodedPublicKey = "INSERT YOUR KEY HERE";
        mHelper = new IabHelper(this, base64EncodedPublicKey);

        // enable debug logging (for a production application, you should set this to false).
        mHelper.enableDebugLogging(true);
        // Start setup. This is asynchronous and the specified listener
        // will be called once setup completes.
        Log.d(TAG, "Starting setup.");
        mHelper.startSetup(new IabHelper.OnIabSetupFinishedListener() {
            public void onIabSetupFinished(IabResult result) {
                Log.d(TAG, "Setup finished.");

                if (!result.isSuccess()) {
                    // Oh noes, there was a problem.
                    Log.e(TAG, "Problem setting up in-app billing: " + result);
                    return;
                }

                // Have we been disposed of in the meantime? If so, quit.
                if (mHelper == null) return;
            }
        });

    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.


        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            AlertDialog.Builder ab = new AlertDialog.Builder(this);
            //TextView msg = new TextView(this);
            //msg.setText(Html.fromHtml("Please consider donation to support the developer.<br><a href='https://play.google.com/store/apps/details?id=com.redlee90.donation1&hl=en'>Donate 0.99USD</a> or <a href='https://play.google.com/store/apps/details?id=com.redlee90.donation2&hl=en'>Donate 1.99USD</a>"));
            //msg.setMovementMethod(LinkMovementMethod.getInstance());
            //msg.setClickable(true);
            //ab.setTitle("About");
            ab.setMessage("Please consider donation to support the developer, thanks!");
            ab.setView(R.layout.layout_donation);
            View view = getLayoutInflater().inflate(R.layout.layout_donation, null);
            ab.setView(view);
            Button button_99 = (Button) view.findViewById(R.id.button_99);
            button_99.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (mHelper != null) {
                        mHelper.flagEndAsync();
                    }
                    try {
                        mHelper.launchPurchaseFlow(MainActivity.this, SKU_DONATION_KEY_99, RC_REQUEST, mPurchasedFinishedListener);
                    } catch (IabHelper.IabAsyncInProgressException e) {
                        e.printStackTrace();
                    }

                }
            });
            Button button_199 = (Button) view.findViewById(R.id.button_199);
            button_199.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (mHelper != null) {
                        mHelper.flagEndAsync();
                    }
                    try {
                        mHelper.launchPurchaseFlow(MainActivity.this, SKU_DONATION_KEY_199, RC_REQUEST, mPurchasedFinishedListener);
                    } catch (IabHelper.IabAsyncInProgressException e) {
                        e.printStackTrace();
                    }
                }
            });

            ab.setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                    dialog.dismiss();
                }
            });
            ab.show();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_rb_anim) {
            // Handle the camera action
            //webSettings.setBuiltInZoomControls(false);
            mWebView.loadUrl("file:///android_asset/rb.html");
        } else if (id == R.id.nav_dll_anim) {
            //webSettings.setBuiltInZoomControls(false);
            mWebView.loadUrl("file:///android_asset/dll.html");
        } else if (id == R.id.nav_queue_anim) {
            //webSettings.setBuiltInZoomControls(false);
            mWebView.loadUrl("file:///android_asset/queue.html");
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }
}
