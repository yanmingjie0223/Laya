import { GObject } from "./GObject";
import { PackageItem } from "./PackageItem";

export interface IGRoot {
    inst: any;
}
export interface IObjectFactoryType {
    resolveExtension(pi: PackageItem): void;
    resolvePackageItemExtension(pi: PackageItem): void;
    newObject(type: number | PackageItem, userClass?: new () => GObject): GObject;
}

export enum GObjectType {
	GObject,
	GComponent,
	GGraph,
	GGroup,
	GImage,
	GLoader,
	GLoader3D,
	GMovieClip,
	GTextField,
	GButton,
	GComboBox,
	GLabel,
	GList,
	GProgressBar,
	GRoot,
	GScrollBar,
	GSlider,
	GTree,
	Window,
    GBasicTextField,
	GTextInput,
	GRichTextField,
}

export const constructingDepth: { inHand: number } = { inHand: 0 };
export const Decls: { GRoot?: IGRoot, UIObjectFactory?: IObjectFactoryType } = {};
