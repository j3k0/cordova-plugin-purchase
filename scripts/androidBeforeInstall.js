//
// hook: before_plugin_install for android.
//
// Initialize the content of the billing_key_param.xml file at the right location
// (Paths are different if the project is eclipse-like or android-studio-like)
//
// This is necessary so patching of the billing_key_param.xml won't fail.
//
const xmlContent = `<?xml version='1.0' encoding='utf-8'?>
<resources xmlns:tools="http://schemas.android.com/tools" tools:ignore="MissingTranslation">
</resources>`;

module.exports = function (ctx) {
  const fs = ctx.requireCordovaModule('fs');
  const path = ctx.requireCordovaModule('path');
  const platformRoot = path.join(ctx.opts.projectRoot, 'platforms/android');

  if (fs.existsSync(path.join(platformRoot, 'res'))) {
		// Eclipse or similar
		mkdirByPathSync(path.join(platformRoot, 'res/value'));
    fs.writeFileSync(path.join(platformRoot, 'res/value/billing_key_param.xml'), xmlContent);
	}
	else {
		// Android Studio or similar
		mkdirByPathSync(path.join(platformRoot, 'app/src/main/res/values'));
    fs.writeFileSync(path.join(platformRoot, 'app/src/main/res/values/billing_key_param.xml'), xmlContent);
	}

	// Source: https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync
	function mkdirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
		const sep = path.sep;
		const initDir = path.isAbsolute(targetDir) ? sep : '';
		const baseDir = isRelativeToScript ? __dirname : '.';

		return targetDir.split(sep).reduce((parentDir, childDir) => {
			const curDir = path.resolve(baseDir, parentDir, childDir);
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

				const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
				if (!caughtErr || caughtErr && targetDir === curDir) {
					throw err; // Throw if it's just the last created dir.
				}
			}

			return curDir;
		}, initDir);
	}
};
