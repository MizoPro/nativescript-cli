import { ANDROID_RELEASE_BUILD_ERROR_MESSAGE } from "../constants";

export class BuildCommandBase {
	constructor(protected $options: IOptions,
		protected $errors: IErrors,
		protected $projectData: IProjectData,
		protected $platformsData: IPlatformsData,
		protected $devicePlatformsConstants: Mobile.IDevicePlatformsConstants,
		protected $platformService: IPlatformService,
		private $bundleValidatorHelper: IBundleValidatorHelper) {
			this.$projectData.initializeProjectData();
	}

	public async executeCore(args: string[]): Promise<void> {
		const platform = args[0].toLowerCase();
		const appFilesUpdaterOptions: IAppFilesUpdaterOptions = { bundle: !!this.$options.bundle, release: this.$options.release };
		const platformInfo: IPreparePlatformInfo = {
			platform,
			appFilesUpdaterOptions,
			skipModulesNativeCheck: !this.$options.syncAllFiles,
			platformTemplate: this.$options.platformTemplate,
			projectData: this.$projectData,
			config: this.$options,
			env: this.$options.env
		};

		await this.$platformService.preparePlatform(platformInfo);
		const buildConfig: IBuildConfig = {
			buildForDevice: this.$options.forDevice,
			projectDir: this.$options.path,
			clean: this.$options.clean,
			teamId: this.$options.teamId,
			device: this.$options.device,
			provision: this.$options.provision,
			release: this.$options.release,
			keyStoreAlias: this.$options.keyStoreAlias,
			keyStorePath: this.$options.keyStorePath,
			keyStoreAliasPassword: this.$options.keyStoreAliasPassword,
			keyStorePassword: this.$options.keyStorePassword
		};
		await this.$platformService.buildPlatform(platform, buildConfig, this.$projectData);
		if (this.$options.copyTo) {
			this.$platformService.copyLastOutput(platform, this.$options.copyTo, buildConfig, this.$projectData);
		}
	}

	protected async validatePlatform(platform: string): Promise<void> {
		if (!this.$platformService.isPlatformSupportedForOS(platform, this.$projectData)) {
			this.$errors.fail(`Applications for platform ${platform} can not be built on this OS`);
		}

		this.$bundleValidatorHelper.validate();

		const platformData = this.$platformsData.getPlatformData(platform, this.$projectData);
		const platformProjectService = platformData.platformProjectService;
		await platformProjectService.validate(this.$projectData);
	}
}

export class BuildIosCommand extends BuildCommandBase implements ICommand {
	public allowedParameters: ICommandParameter[] = [];

	constructor(protected $options: IOptions,
		$errors: IErrors,
		$projectData: IProjectData,
		$platformsData: IPlatformsData,
		$devicePlatformsConstants: Mobile.IDevicePlatformsConstants,
		$platformService: IPlatformService,
		$bundleValidatorHelper: IBundleValidatorHelper) {
			super($options, $errors, $projectData, $platformsData, $devicePlatformsConstants, $platformService, $bundleValidatorHelper);
	}

	public async execute(args: string[]): Promise<void> {
		return this.executeCore([this.$platformsData.availablePlatforms.iOS]);
	}

	public async canExecute(args: string[]): Promise<boolean> {
		await super.validatePlatform(this.$devicePlatformsConstants.iOS);
		return args.length === 0 && this.$platformService.validateOptions(this.$options.provision, this.$options.teamId, this.$projectData, this.$platformsData.availablePlatforms.iOS);
	}
}

$injector.registerCommand("build|ios", BuildIosCommand);

export class BuildAndroidCommand extends BuildCommandBase implements ICommand {
	public allowedParameters: ICommandParameter[] = [];

	constructor(protected $options: IOptions,
		protected $errors: IErrors,
		$projectData: IProjectData,
		$platformsData: IPlatformsData,
		$devicePlatformsConstants: Mobile.IDevicePlatformsConstants,
		$platformService: IPlatformService,
		$bundleValidatorHelper: IBundleValidatorHelper) {
			super($options, $errors, $projectData, $platformsData, $devicePlatformsConstants, $platformService, $bundleValidatorHelper);
	}

	public async execute(args: string[]): Promise<void> {
		return this.executeCore([this.$platformsData.availablePlatforms.Android]);
	}

	public async canExecute(args: string[]): Promise<boolean> {
		await super.validatePlatform(this.$devicePlatformsConstants.Android);
		if (this.$options.release && (!this.$options.keyStorePath || !this.$options.keyStorePassword || !this.$options.keyStoreAlias || !this.$options.keyStoreAliasPassword)) {
			this.$errors.fail(ANDROID_RELEASE_BUILD_ERROR_MESSAGE);
		}

		return args.length === 0 && await this.$platformService.validateOptions(this.$options.provision, this.$options.teamId, this.$projectData, this.$platformsData.availablePlatforms.Android);
	}
}

$injector.registerCommand("build|android", BuildAndroidCommand);
