///<reference path="../.d.ts"/>

declare module Mobile {

	interface ISyncOptions {
		skipRefresh?: boolean;
	}

	interface IDeviceInfo {
		identifier: string;
		displayName: string;
		model: string;
		version: string;
		vendor: string;
		platform: string;
	}

	interface IDevice {
		deviceInfo: Mobile.IDeviceInfo;
		applicationManager: Mobile.IDeviceApplicationManager;
		fileSystem: Mobile.IDeviceFileSystem;
		deploy(packageFile: string, packageName: string): IFuture<void>;
		openDeviceLogStream(): void;
	}

	interface IAndroidDevice extends IDevice {
		adb: Mobile.IAndroidDebugBridge;
	}

	interface IiOSDevice extends IDevice {
		startService(serviceName: string): number;
		mountImage(): IFuture<void>;
		tryExecuteFunction<TResult>(func: () => TResult): TResult;
		connectToPort(port: number): any;
	}

	interface IDeviceAppData {
		appIdentifier: string;
		deviceProjectRootPath: string;
		isLiveSyncSupported(device: Mobile.IDevice): IFuture<boolean>;
	}

	interface IDeviceAppDataFactory {
		create<T extends Mobile.IDeviceAppData>(appIdentifier: string, platform: string): T;
	}

	interface IDeviceAppDataFactoryRule {
		vanilla: any;
		companion?: any;
	}

	interface IDeviceAppDataProvider {
		createFactoryRules(): IDictionary<Mobile.IDeviceAppDataFactoryRule>;
	}

	interface IAndroidLiveSyncService {
		liveSyncCommands: any;
		livesync(appIdentifier: string, liveSyncRoot: string, commands: string[]): IFuture<void>;
		createCommandsFileOnDevice(commandsFileDevicePath: string, commands: string[]): IFuture<void>;
	}

	interface ILogcatHelper {
		start(deviceIdentifier: string): void;
	}

	interface IDeviceLogProvider {
		logData(line: string, platform: string, deviceIdentifier: string): void;
	}

	interface IDeviceApplicationManager {
		getInstalledApplications(): IFuture<string[]>;
		installApplication(packageFilePath: string): IFuture<void>;
		uninstallApplication(appIdentifier: string): IFuture<void>;
		reinstallApplication(applicationId: string, packageFilePath: string): IFuture<void>;
		startApplication(appIdentifier: string): IFuture<void>;
		stopApplication(appIdentifier: string): IFuture<void>;
		restartApplication(applicationId: string): IFuture<void>;
	}

	interface IDeviceFileSystem {
		listFiles(devicePath: string): IFuture<void>;
		getFile(deviceFilePath: string): IFuture<void>;
		putFile(localFilePath: string, deviceFilePath: string): IFuture<void>;
		deleteFile?(deviceFilePath: string, appIdentifier: string): void;
		transferFiles(appIdentifier: string, localToDevicePaths: Mobile.ILocalToDevicePathData[]): IFuture<void>;
		transferDirectory(deviceAppData: Mobile.IDeviceAppData, localToDevicePaths: Mobile.ILocalToDevicePathData[], projectFilesPath: string): IFuture<void>;
		transferFile?(localFilePath: string, deviceFilePath: string): IFuture<void>;
		createFileOnDevice?(deviceFilePath: string, fileContent: string): IFuture<void>;
	}

	interface IAndroidDebugBridge {
		executeCommand(args: string[]): IFuture<any>;
		executeShellCommand(args: string[]): IFuture<any>;
		sendBroadcastToDevice(action: string, extras?: IStringDictionary): IFuture<number>;
	}

	interface IDebugOnDeviceSetup {
		frontEndPath?: string;
	}

	interface IDeviceDiscovery extends NodeJS.EventEmitter {
		startLookingForDevices(): IFuture<void>;
		checkForDevices(): IFuture<void>;
	}

	interface IAndroidDeviceDiscovery extends IDeviceDiscovery {
		ensureAdbServerStarted(): IFuture<void>;
	}

	interface IDevicesServicesInitializationOptions {
		platform?: string;
		deviceId?: string;
		skipInferPlatform?: boolean;
	}

	interface IDevicesService {
		hasDevices: boolean;
		deviceCount: number;
		execute(action: (device: Mobile.IDevice) => IFuture<void>, canExecute?: (dev: Mobile.IDevice) => boolean, options?: {allowNoDevices?: boolean}): IFuture<void>;
		initialize(data: IDevicesServicesInitializationOptions): IFuture<void>;
		platform: string;
		getDevices(): Mobile.IDeviceInfo[];
		getDeviceInstances(): Mobile.IDevice[];
	}

	interface IiTunesValidator {
		getError(): IFuture<string>;
	}

	interface IiOSCore {
		getCoreFoundationLibrary(): any;
		getMobileDeviceLibrary(): any;
	}

	interface ICoreFoundation {
		runLoopRun(): void;
		runLoopGetCurrent(): any;
		stringCreateWithCString(alloc: NodeBuffer, str: string, encoding: number): NodeBuffer;
		dictionaryGetValue(theDict: NodeBuffer, value: NodeBuffer): NodeBuffer;
		numberGetValue(num: NodeBuffer, theType: number, valuePtr: NodeBuffer): boolean;
		kCFRunLoopCommonModes(): NodeBuffer;
		kCFRunLoopDefaultMode(): NodeBuffer;
		kCFTypeDictionaryKeyCallBacks(): NodeBuffer;
		kCFTypeDictionaryValueCallBacks(): NodeBuffer;
		runLoopTimerCreate(allocator: NodeBuffer, fireDate: number, interval: number, flags: number, order: number, callout: NodeBuffer, context: any): NodeBuffer;
		absoluteTimeGetCurrent(): number;
		runLoopAddTimer(r1: NodeBuffer, timer: NodeBuffer, mode: NodeBuffer): void;
		runLoopRemoveTimer(r1: NodeBuffer, timer: NodeBuffer, mode: NodeBuffer): void;
		runLoopStop(r1: any): void;
		convertCFStringToCString(cfstr: NodeBuffer): string;
		dictionaryCreate(allocator: NodeBuffer, keys: NodeBuffer, values: NodeBuffer, count: number, dictionaryKeyCallbacks: NodeBuffer, dictionaryValueCallbacks: NodeBuffer): NodeBuffer;
		getTypeID(type: NodeBuffer): number;
		stringGetCString(theString: NodeBuffer, buffer: NodeBuffer, bufferSize: number, encoding: number): boolean;
		stringGetLength(theString: NodeBuffer): number;
		dictionaryGetCount(theDict: NodeBuffer): number;
		createCFString(str: string): NodeBuffer;
		dictToPlistEncoding(dict: {[key: string]: {}}, format: number): NodeBuffer;
		dictFromPlistEncoding(str: NodeBuffer): NodeBuffer;
		dictionaryGetTypeID(): number;
		stringGetTypeID(): number;
		dataGetTypeID():  number;
		numberGetTypeID(): number;
		booleanGetTypeID(): number;
		arrayGetTypeID(): number;
		dateGetTypeID(): number;
		setGetTypeID(): number;
		dictionaryGetKeysAndValues(dictionary: NodeBuffer, keys: NodeBuffer, values: NodeBuffer): void;
		dataCreate(allocator: NodeBuffer, data: NodeBuffer, length: number): any;
		cfTypeFrom(value: IDictionary<any>): NodeBuffer;
		cfTypeTo(cfDictionary: NodeBuffer): IDictionary<any>;
	}

	interface IMobileDevice {
		deviceNotificationSubscribe(notificationCallback: NodeBuffer, p1: number, p2: number, context: any, callbackSignature: NodeBuffer): number;
		deviceCopyDeviceIdentifier(devicePointer: NodeBuffer): NodeBuffer;
		deviceCopyValue(devicePointer: NodeBuffer, domain: NodeBuffer, name: NodeBuffer): NodeBuffer;
		deviceConnect(devicePointer: NodeBuffer): number;
		deviceIsPaired(devicePointer: NodeBuffer): number;
		devicePair(devicePointer: NodeBuffer): number;
		deviceValidatePairing(devicePointer: NodeBuffer): number;
		deviceStartSession(devicePointer: NodeBuffer): number;
		deviceStopSession(devicePointer: NodeBuffer): number;
		deviceDisconnect(devicePointer: NodeBuffer): number;
		deviceStartService(devicePointer: NodeBuffer, serviceName: NodeBuffer, socketNumber: NodeBuffer): number;
		deviceTransferApplication(service: number, packageFile: NodeBuffer, options: NodeBuffer, installationCallback: NodeBuffer): number;
		deviceInstallApplication(service: number, packageFile: NodeBuffer, options: NodeBuffer, installationCallback: NodeBuffer): number;
		deviceUninstallApplication(service: number, bundleId: NodeBuffer, options: NodeBuffer, callback: NodeBuffer): number;
		deviceStartHouseArrestService(devicePointer: NodeBuffer, bundleId: NodeBuffer, options: NodeBuffer, fdRef: NodeBuffer): number;
		deviceMountImage(devicePointer: NodeBuffer, imagePath: NodeBuffer, options: NodeBuffer, mountCallBack: NodeBuffer): number;
		deviceLookupApplications(devicePointer: NodeBuffer, appType: number, result: NodeBuffer): number;
		deviceGetInterfaceType(devicePointer: NodeBuffer): number;
		deviceGetConnectionId(devicePointer: NodeBuffer): number;
		afcConnectionOpen(service: number, timeout: number, afcConnection: NodeBuffer): number;
		afcConnectionClose(afcConnection: NodeBuffer): number;
		afcDirectoryCreate(afcConnection: NodeBuffer, path: string): number;
		afcFileInfoOpen(afcConnection: NodeBuffer, path: string, afcDirectory: NodeBuffer): number;
		afcFileRefOpen(afcConnection: NodeBuffer, path: string, mode: number, afcFileRef: NodeBuffer): number;
		afcFileRefClose(afcConnection: NodeBuffer, afcFileRef: number): number;
		afcFileRefWrite(afcConnection: NodeBuffer, afcFileRef: number, buffer: NodeBuffer, byteLength: number): number;
		afcFileRefRead(afcConnection: NodeBuffer, afcFileRef: number, buffer: NodeBuffer, byteLength: NodeBuffer): number;
		afcRemovePath(afcConnection: NodeBuffer, path: string): number;
		afcDirectoryOpen(afcConnection: NodeBuffer, path: string, afcDirectory: NodeBuffer): number;
		afcDirectoryRead(afcConnection: NodeBuffer, afcdirectory: NodeBuffer,  name: NodeBuffer): number;
		afcDirectoryClose(afcConnection: NodeBuffer, afcdirectory: NodeBuffer): number;
		isDataReceivingCompleted(reply: IDictionary<any>): boolean;
		setLogLevel(logLevel: number): number;

		/**
		 * Connect to a port on iOS device connected over USB.
		 * @param connectionId Connection ID obtained throught IMobileDevice deviceGetConnectionId.
		 * @param port Port on the device to connect to. The native API expects it in big endian!
		 * @param socketRef Out param, reference to the socket file descriptor.
		 */
		uSBMuxConnectByPort(connectionId: number, port: number, socketRef: NodeBuffer): number;
	}

	interface IHouseArrestClient {
		getAfcClientForAppContainer(applicationIdentifier: string): Mobile.IAfcClient;
		closeSocket(): void;
	}

	interface IAfcClient {
		open(path: string, mode: string): Mobile.IAfcFile;
		transfer(localFilePath: string, devicePath: string): IFuture<void>;
		deleteFile(devicePath: string): void;
		mkdir(path: string): void;
		listDir(path: string): string[];
	}

	interface IAfcFile {
		write(buffer: any, byteLength?: any): boolean;
		read(len: number): any;
		close(): void;
	}

	interface ILocalToDevicePathData {
		getLocalPath(): string;
		getDevicePath(): string;
		getRelativeToProjectBasePath(): string;
	}

	interface ILocalToDevicePathDataFactory {
		create(fileName: string, localProjectRootPath: string, onDeviceFileName: string, deviceProjectRootPath: string):  Mobile.ILocalToDevicePathData;
	}

	interface IiOSSocketResponseData {
		Status?: string;
		Error?: string;
		PercentComplete?: string;
		Complete?: boolean;
	}

	interface IiOSDeviceSocket {
		receiveMessage(): IFuture<IiOSSocketResponseData>;
		readSystemLog(action: (data: string) => void): void;
		sendMessage(message: {[key: string]: {}}, format?: number): void;
		sendMessage(message: string): void;
		sendAll? (data: NodeBuffer): void;
		receiveAll? (callback: (data: NodeBuffer) => void): void;
		exchange(message: IDictionary<any>): IFuture<IiOSSocketResponseData>;
		close(): void;
	}

	interface IGDBServer {
		run(argv: string[]): IFuture<void>;
		kill(argv: string[]): IFuture<void>;
		destroy(): void;
	}

	interface INotificationProxyClient {
		postNotification(notificationName: string): void;
		postNotificationAndAttachForData(notificationName: string): void;
		addObserver(name: string, callback: (_name: string) => void): any;
		removeObserver(name: string, callback: (_name: string) => void): void;
	}

	interface IPlatformCapabilities {
		wirelessDeploy?: boolean;
		cableDeploy: boolean;
		companion?: boolean;
		hostPlatformsForDeploy: string[];
	}

	interface IAvdInfo {
		target: string;
		targetNum: number;
		path: string;
		device?: string;
		name?: string;
		abi?: string;
		skin?: string;
		sdcard?: string;
	}

	interface IEmulatorPlatformServices {
		checkDependencies(): IFuture<void>;
		checkAvailability(dependsOnProject?: boolean): IFuture<void>;
		startEmulator(app: string, emulatorOptions?: IEmulatorOptions): IFuture<any>;
		getEmulatorId(): IFuture<string>;
	}

	interface IiOSSimulatorService extends IEmulatorPlatformServices {
		postDarwinNotification(notification: string): IFuture<void>;
		sync(appIdentifier: string, projectFilesPath: string, notRunningSimulatorAction: () => IFuture<void>, getApplicationPathForiOSSimulatorAction: () => IFuture<string>): IFuture<void>;
		syncFiles(appIdentifier: string, projectFilesPath: string, projectFiles: string[], notRunningSimulatorAction: () => IFuture<void>, getApplicationPathForiOSSimulatorAction: () => IFuture<string>, relativeToProjectBasePathAction?: (projectFile: string) => string): IFuture<void>;
		isSimulatorRunning(): IFuture<boolean>;
		transferFiles(appIdentifier: string, projectFiles: string[], relativeToProjectBasePathAction?: (_projectFile: string) => string, applicationPath?: string): IFuture<void>;
		removeFiles(appIdentifier: string, projectFilesPath: string, projectFiles: string[], notRunningSimulatorAction: () => IFuture<void>, getApplicationPathForiOSSimulatorAction: () => IFuture<string>, relativeToProjectBasePathAction?: (projectFile: string) => string): IFuture<void>;
	}

	interface IEmulatorSettingsService {
		canStart(platform: string): IFuture<boolean>;
		minVersion: number;
	}

	interface IEmulatorOptions {
		stderrFilePath?: string;
		stdoutFilePath?: string;
		appId?: string;
		args?: string;
		deviceType?: string;
		waitForDebugger?: boolean;
		captureStdin?: boolean;
	}

	interface IPlatformsCapabilities {
		getPlatformNames(): string[];
		getAllCapabilities(): IDictionary<Mobile.IPlatformCapabilities>;
	}

	interface IMobileHelper {
		platformNames: string[];
		isAndroidPlatform(platform: string): boolean;
		isiOSPlatform(platform: string): boolean;
		isWP8Platform(platform: string): boolean;
		normalizePlatformName(platform: string): string;
		isPlatformSupported(platform: string): boolean;
		validatePlatformName(platform: string): string;
		getPlatformCapabilities(platform: string): Mobile.IPlatformCapabilities;
		buildDevicePath(...args: string[]): string;
		correctDevicePath(filePath: string): string;
	}

	interface IDevicePlatformsConstants {
		iOS: string;
		Android: string;
		WP8: string;
	}

	interface IDeviceApplication {
		CFBundleExecutable: string;
		Path: string;
	}
}
