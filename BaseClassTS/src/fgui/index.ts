import * as changePageAction from "./action/ChangePageAction";
import * as controllerAction from "./action/ControllerAction";
import * as playTransitionAction from "./action/PlayTransitionAction";
import * as assetProxy from "./AssetProxy";
import * as asyncOperation from "./AsyncOperation";
import * as controller from "./Controller";
import * as image from "./display/Image";
import * as movieClip from "./display/MovieClip";
import * as dragDropManager from "./DragDropManager";
import * as events from "./Events";
import * as fieldTypes from "./FieldTypes";
import * as gButton from "./GButton";
import * as gComboBox from "./GComboBox";
import * as gComponect from "./GComponent";
import * as gearAnimation from "./gears/GearAnimation";
import * as gearBase from "./gears/GearBase";
import * as gearColor from "./gears/GearColor";
import * as gearDisplay from "./gears/GearDisplay";
import * as gearDisplay2 from "./gears/GearDisplay2";
import * as gearFontSize from "./gears/GearFontSize";
import * as gearIcon from "./gears/GearIcon";
import * as gearLook from "./gears/GearLook";
import * as gearSize from "./gears/GearSize";
import * as gearText from "./gears/GearText";
import * as gearXY from "./gears/GearXY";
import * as gGraph from "./GGraph";
import * as gGroup from "./GGroup";
import * as gImage from "./GImage";
import * as gLabel from "./GLabel";
import * as gList from "./GList";
import * as gLoader from "./GLoader";
import * as gMovieClip from "./GMovieClip";
import * as gObject from "./GObject";
import * as gObjectPool from "./GObjectPool";
import * as gProgressBar from "./GProgressBar";
import * as gRichTextField from "./GRichTextField";
import * as gRoot from "./GRoot";
import * as gScrollBar from "./GScrollBar";
import * as gSlider from "./GSlider";
import * as gTextField from "./GTextField";
import * as gTextInput from "./GTextInput";
import * as gTree from "./GTree";
import * as gTreeNode from "./GTreeNode";
import * as margin from "./Margin";
import * as packageItem from "./PackageItem";
import * as popupMenu from "./PopupMenu";
import * as relationItem from "./RelationItem";
import * as relations from "./Relations";
import * as scrollPane from "./ScrollPane";
import * as transition from "./Transition";
import * as translationHelper from "./TranslationHelper";
import * as easeType from "./tween/EaseType";
import * as gPath from "./tween/GPath";
import * as gPathPoint from "./tween/GPathPoint";
import * as gTween from "./tween/GTween";
import * as gTweener from "./tween/GTweener";
import * as tweenManager from "./tween/TweenManager";
import * as tweenValue from "./tween/TweenValue";
import * as uiConfig from "./UIConfig";
import * as uiObjectFactory from "./UIObjectFactory";
import * as uiPackage from "./UIPackage";
import * as byteBuffer from "./utils/ByteBuffer";
import * as colorMatrix from "./utils/ColorMatrix";
import * as toolSet from "./utils/ToolSet";
import * as ubbParser from "./utils/UBBParser";
import * as window from "./Window";

export module fgui {

	export type AsyncOperation = asyncOperation.AsyncOperation;

	export type Controller = controller.Controller;

	export type DragDropManager = dragDropManager.DragDropManager;

	export type ButtonMode = fieldTypes.ButtonMode;
	export type AutoSizeType = fieldTypes.AutoSizeType;
	export type AlignType = fieldTypes.AlignType;
	export type VertAlignType = fieldTypes.VertAlignType;
	export type LoaderFillType = fieldTypes.LoaderFillType;
	export type ListLayoutType = fieldTypes.ListLayoutType;
	export type ListSelectionMode = fieldTypes.ListSelectionMode;
	export type OverflowType = fieldTypes.OverflowType;
	export type PackageItemType = fieldTypes.PackageItemType;
	export type ObjectType = fieldTypes.ObjectType;
	export type ProgressTitleType = fieldTypes.ProgressTitleType;
	export type ScrollBarDisplayType = fieldTypes.ScrollBarDisplayType;
	export type ScrollType = fieldTypes.ScrollType;
	export type FlipType = fieldTypes.FlipType;
	export type ChildrenRenderOrder = fieldTypes.ChildrenRenderOrder;
	export type PopupDirection = fieldTypes.PopupDirection;
	export type RelationType = fieldTypes.RelationType;
	export type FillMethod = fieldTypes.FillMethod;
	export type FillOrigin = fieldTypes.FillOrigin;
	export type ObjectPropID = fieldTypes.ObjectPropID;

	export type GObject = gObject.GObject;

	export type GComponent = gComponect.GComponent;

	export type GButton = gButton.GButton;

	export type GComboBox = gComboBox.GComboBox;

	export type GGraph = gGraph.GGraph;

	export type GGroup = gGroup.GGroup;

	export type GImage = gImage.GImage;

	export type GLabel = gLabel.GLabel;

	export type GList = gList.GList;

	export type GObjectPool = gObjectPool.GObjectPool;

	export type GLoader = gLoader.GLoader;

	export type GMovieClip = gMovieClip.GMovieClip;

	export type GProgressBar = gProgressBar.GProgressBar;

	export type GTextField = gTextField.GTextField;

	export type GRichTextField = gRichTextField.GRichTextField;

	export type GRoot = gRoot.GRoot;

	export type GScrollBar = gScrollBar.GScrollBar;

	export type GSlider = gSlider.GSlider;

	export type GTextInput = gTextInput.GTextInput;

	export type GTree = gTree.GTree;

	export type GTreeNode = gTreeNode.GTreeNode;

	export type Margin = margin.Margin;

	export type PackageItem = packageItem.PackageItem;

	export type PopupMenu = popupMenu.PopupMenu;

	export type RelationItem = relationItem.RelationItem;

	export type Relations = relations.Relations;

	export type ScrollPane = scrollPane.ScrollPane;

	export type Transition = transition.Transition;

	export type TranslationHelper = translationHelper.TranslationHelper;

	export type UIConfig = uiConfig.UIConfig;

	export type UIObjectFactory = uiObjectFactory.UIObjectFactory;

	export type UIPackage = uiPackage.UIPackage;

	export type Window = window.Window;

	export type Events = events.Events;

	export type ControllerAction = controllerAction.ControllerAction;

	export type ChangePageAction = changePageAction.ChangePageAction;

	export type PlayTransitionAction = playTransitionAction.PlayTransitionAction;

	export type Image = image.Image;

	export type Frame = movieClip.Frame;
	export type MovieClip = movieClip.MovieClip;

	export type GearBase = gearBase.GearBase;
	export type GearTweenConfig = gearBase.GearTweenConfig;
	export type GearAnimation = gearAnimation.GearAnimation;
	export type GearColor = gearColor.GearColor;
	export type GearDisplay = gearDisplay.GearDisplay;
	export type GearDisplay2 = gearDisplay2.GearDisplay2;
	export type GearFontSize = gearFontSize.GearFontSize;
	export type GearIcon = gearIcon.GearIcon;
	export type GearLook = gearLook.GearLook;
	export type GearSize = gearSize.GearSize;
	export type GearText = gearText.GearText;
	export type GearXY = gearXY.GearXY;

	export type EaseType = easeType.EaseType;
	export type GPath = gPath.GPath;

	export type CurveType = gPathPoint.CurveType;
	export type GPathPoint = gPathPoint.GPathPoint;

	export type GTween = gTween.GTween;

	export type GTweener = gTweener.GTweener;

	export type TweenManager = tweenManager.TweenManager;

	export type TweenValue = tweenValue.TweenValue;

	export type ByteBuffer = byteBuffer.ByteBuffer;

	export type ColorMatrix = colorMatrix.ColorMatrix;

	export type UBBParser = ubbParser.UBBParser;

	export type ToolSet = toolSet.ToolSet;

	export type AssetProxy = assetProxy.AssetProxy;

	// const

	export const AsyncOperation = asyncOperation.AsyncOperation;

	export const Controller = controller.Controller;

	export const DragDropManager = dragDropManager.DragDropManager;

	export const ButtonMode = fieldTypes.ButtonMode;
	export const AutoSizeType = fieldTypes.AutoSizeType;
	export const AlignType = fieldTypes.AlignType;
	export const VertAlignType = fieldTypes.VertAlignType;
	export const LoaderFillType = fieldTypes.LoaderFillType;
	export const ListLayoutType = fieldTypes.ListLayoutType;
	export const ListSelectionMode = fieldTypes.ListSelectionMode;
	export const OverflowType = fieldTypes.OverflowType;
	export const PackageItemType = fieldTypes.PackageItemType;
	export const ObjectType = fieldTypes.ObjectType;
	export const ProgressTitleType = fieldTypes.ProgressTitleType;
	export const ScrollBarDisplayType = fieldTypes.ScrollBarDisplayType;
	export const ScrollType = fieldTypes.ScrollType;
	export const FlipType = fieldTypes.FlipType;
	export const ChildrenRenderOrder = fieldTypes.ChildrenRenderOrder;
	export const PopupDirection = fieldTypes.PopupDirection;
	export const RelationType = fieldTypes.RelationType;
	export const FillMethod = fieldTypes.FillMethod;
	export const FillOrigin = fieldTypes.FillOrigin;
	export const ObjectPropID = fieldTypes.ObjectPropID;

	export const GObject = gObject.GObject;

	export const GComponent = gComponect.GComponent;

	export const GButton = gButton.GButton;

	export const GComboBox = gComboBox.GComboBox;

	export const GGraph = gGraph.GGraph;

	export const GGroup = gGroup.GGroup;

	export const GImage = gImage.GImage;

	export const GLabel = gLabel.GLabel;

	export const GList = gList.GList;

	export const GObjectPool = gObjectPool.GObjectPool;

	export const GLoader = gLoader.GLoader;

	export const GMovieClip = gMovieClip.GMovieClip;

	export const GProgressBar = gProgressBar.GProgressBar;

	export const GTextField = gTextField.GTextField;

	export const GRichTextField = gRichTextField.GRichTextField;

	export const GRoot = gRoot.GRoot;

	export const GScrollBar = gScrollBar.GScrollBar;

	export const GSlider = gSlider.GSlider;

	export const GTextInput = gTextInput.GTextInput;

	export const GTree = gTree.GTree;

	export const GTreeNode = gTreeNode.GTreeNode;

	export const Margin = margin.Margin;

	export const PackageItem = packageItem.PackageItem;

	export const PopupMenu = popupMenu.PopupMenu;

	export const RelationItem = relationItem.RelationItem;

	export const Relations = relations.Relations;

	export const ScrollPane = scrollPane.ScrollPane;

	export const Transition = transition.Transition;

	export const TranslationHelper = translationHelper.TranslationHelper;

	export const UIConfig = uiConfig.UIConfig;

	export const UIObjectFactory = uiObjectFactory.UIObjectFactory;

	export const UIPackage = uiPackage.UIPackage;

	export const Window = window.Window;

	export const Events = events.Events;

	export const ControllerAction = controllerAction.ControllerAction;

	export const ChangePageAction = changePageAction.ChangePageAction;

	export const PlayTransitionAction = playTransitionAction.PlayTransitionAction;

	export const Image = image.Image;

	export const MovieClip = movieClip.MovieClip;

	export const GearBase = gearBase.GearBase;
	export const GearTweenConfig = gearBase.GearTweenConfig;
	export const GearAnimation = gearAnimation.GearAnimation;
	export const GearColor = gearColor.GearColor;
	export const GearDisplay = gearDisplay.GearDisplay;
	export const GearDisplay2 = gearDisplay2.GearDisplay2;
	export const GearFontSize = gearFontSize.GearFontSize;
	export const GearIcon = gearIcon.GearIcon;
	export const GearLook = gearLook.GearLook;
	export const GearSize = gearSize.GearSize;
	export const GearText = gearText.GearText;
	export const GearXY = gearXY.GearXY;

	export const EaseType = easeType.EaseType;
	export const GPath = gPath.GPath;

	export const CurveType = gPathPoint.CurveType;
	export const GPathPoint = gPathPoint.GPathPoint;

	export const GTween = gTween.GTween;

	export const GTweener = gTweener.GTweener;

	export const TweenManager = tweenManager.TweenManager;

	export const TweenValue = tweenValue.TweenValue;

	export const ByteBuffer = byteBuffer.ByteBuffer;

	export const ColorMatrix = colorMatrix.ColorMatrix;

	export const UBBParser = ubbParser.UBBParser;

	export const ToolSet = toolSet.ToolSet;

	export const AssetProxy = assetProxy.AssetProxy;
}
export default fgui;
