//
// hook: before_plugin_install for android.
//
// Initialize the content of the billing_key_param.xml file at the right location
// (Paths are different if the project is eclipse-like or android-studio-like)
//
// This is necessary so patching of the billing_key_param.xml won't fail.
//

var xmlContent = "<?xml version='1.0' encoding='utf-8'?>\n"
  + '<resources xmlns:tools="http://schemas.android.com/tools" tools:ignore="MissingTranslation">\n'
  + '</resources>\n';

module.exports = function (ctx) {
  var fs = ctx.requireCordovaModule('fs');
  var path = ctx.requireCordovaModule('path');
  var platformRoot = path.join(ctx.opts.projectRoot,
    'platforms' + path.sep + 'android');
  var resDir = path.join('res', 'values');

  // Ref #742: https://github.com/j3k0/cordova-plugin-purchase/issues/742
  // Cordova failed to remove this file when uninstalling the plugin, which in
  // turn prevents the plugin from re-installing. Work-around below:
  rmByPathSync(path.join(platformRoot, 'app', 'src', 'main', 'aidl', 'com', 'android', 'vending', 'billing', 'IInAppBillingService.aidl'));
  rmByPathSync(path.join(platformRoot, 'src', 'com', 'android', 'vending', 'billing', 'IInAppBillingService.aidl'));

  // Android Studio or similar
  var baseDir = '';
  if (!fs.existsSync(path.join(platformRoot, 'res'))) {
    baseDir = path.join('app', 'src', 'main');
	}

  var xmlDir = path.join(platformRoot, baseDir, resDir);
  mkdirByPathSync(xmlDir);

  var xmlFile = path.join(xmlDir, 'billing_key_param.xml');
  fs.writeFileSync(xmlFile, xmlContent);

	// Source: https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync
	function mkdirByPathSync(targetDir) {
		var initDir = path.isAbsolute(targetDir) ? path.sep : '';

		return targetDir.split(path.sep).reduce(function (parentDir, childDir) {
			var curDir = path.resolve(parentDir, childDir);
			try {
				fs.mkdirSync(curDir);
			} catch (err) {
				if (err.code === 'EEXIST') { // curDir already exists!
					return curDir;
				}

				// To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
				if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
					throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
				}

				var caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
				if (!caughtErr || caughtErr && targetDir === curDir) {
					throw err; // Throw if it's just the last created dir.
				}
			}

			return curDir;
		}, initDir);
	}

  function rmByPathSync(targetFile) {
    if (fs.existsSync(targetFile))
      fs.unlinkSync(targetFile);
  }
};
