package com.ksbm.astrofortunetalk;

import android.os.Bundle;
import com.facebook.react.ReactActivity;

public class FullScreenActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "AstroFortuneTalk";
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // getMainComponentName();
  }
}
