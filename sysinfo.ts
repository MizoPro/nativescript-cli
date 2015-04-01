///<reference path="../.d.ts"/>
"use strict";

import os = require("os");
import osenv = require("osenv");
import Future = require("fibers/future");
import hostInfo = require("./host-info");

export class SysInfo implements ISysInfo {
	constructor(private $childProcess: IChildProcess,
				private $iTunesValidator: Mobile.IiTunesValidator) { }

	private sysInfoCache: ISysInfoData = undefined;

	getSysInfo(): ISysInfoData {
		if (!this.sysInfoCache) {
			var res: ISysInfoData = Object.create(null);
			var procOutput: string;

			var packageJson = require("../../package.json");
			res.procInfo = packageJson.name + "/" + packageJson.version;

			// os stuff
			res.platform = os.platform();
			res.os = hostInfo.isWindows() ? this.winVer() : this.unixVer();
			res.shell = osenv.shell();
			res.dotNetVer = hostInfo.dotNetVersion(".Net is not installed").wait();

			// node stuff
			res.procArch = process.arch;
			res.nodeVer = process.version;

			procOutput = this.$childProcess.exec("npm -v").wait();
			res.npmVer = procOutput ? procOutput.split("\n")[0] : null;

			// dependencies
			// Java detection is disabled for now. Leaving the code in case we decide to use it later
			// res.javaVer = this.$childProcess.spawnFromEvent("java", ["-version"], "exit").wait().stderr.split(os.EOL)[2];

			procOutput = this.exec("ant -version");
			res.antVer = procOutput ? procOutput.split(os.EOL)[0] : null;

			res.nodeGypVer = this.exec("node-gyp -v");
			res.xcodeVer = hostInfo.isDarwin() ? this.exec("xcodebuild -version") : null;
			res.itunesInstalled = this.$iTunesValidator.getError().wait() === null;

			procOutput = this.exec("adb version");
			res.adbVer = procOutput ? procOutput.split(os.EOL)[0] : null;

			procOutput = this.exec("android -h");
			res.androidInstalled = procOutput ? _.contains(procOutput, "android") : false;

			this.sysInfoCache = res;
		}

		return this.sysInfoCache;
	}

	private exec(cmd: string): string {
		try {
			return this.$childProcess.exec(cmd).wait();
		} catch(e) {
			return null;
		} // if we got an error, assume not working
	}

	private winVer(): string {
		return this.readRegistryValue("ProductName").wait() + " " +
				this.readRegistryValue("CurrentVersion").wait() + "." +
				this.readRegistryValue("CurrentBuild").wait();
	}

	private readRegistryValue(valueName: string): IFuture<string> {
		var future = new Future<string>();
		var Winreg = require("winreg");
		var regKey = new Winreg({
			hive: Winreg.HKLM,
			key:  '\\Software\\Microsoft\\Windows NT\\CurrentVersion'
		});
		regKey.get(valueName, (err: Error, value: any) => {
			if (err) {
				future.throw(err);
			} else {
				future.return(value.value);
			}
		});
		return future;
	}

	private unixVer(): string {
		return this.$childProcess.exec("uname -a").wait();
	}
}
$injector.register("sysInfo", SysInfo);