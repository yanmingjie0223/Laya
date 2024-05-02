import { ILaya } from "../../ILaya";
import { loader } from "../../Laya";
import { Sprite } from "../display/Sprite";
import { Point } from "../maths/Point";
import { Rectangle } from "../maths/Rectangle";
import { Loader } from "../net/Loader";
import { Context } from "../resource/Context";
import { HTMLCanvas } from "../resource/HTMLCanvas";
import { Texture } from "../resource/Texture";
import { Handler } from "../utils/Handler";
import { GridSprite } from "./GridSprite";
import { IMap } from "./IMap";
import { MapFogLayer, MapLayer } from "./MapLayer";
import { TileAniSprite } from "./TileAniSprite";
import { TileTexSet } from "./TileTexSet";

/**
 * Tiled JSON 数据 结构
 *
 * @see https://doc.mapeditor.org/en/stable/reference/json-map-format/#
 *
 * @
 * @interface ITiledMap
 */
export interface ITiledMap {
  /**
   * Hex-formatted color (#RRGGBB or #AARRGGBB) (optional)
   *
   * @type {string}
   * @memberof ITiledMap
   */
  backgroundcolor: string;

  /**
   * The compression level to use for tile layer data (defaults to -1, which means to use the algorithm default)
   *
   * @type {number}
   * @memberof ITiledMap
   */
  compressionlevel: number;
  /**
   * Number of tile rows
   *
   * @type {number}
   * @memberof ITiledMap
   */
  height: number;
  /**
   * Length of the side of a hex tile in pixels (hexagonal maps only)
   *
   * @type {number}
   * @memberof ITiledMap
   */
  hexsidelength: number;
  /**
   * Whether the map has infinite dimensions
   *
   * @type {boolean}
   * @memberof ITiledMap
   */
  infinite: boolean;
  /**
   *	Array of Layers
   *
   * @type {Array<ITiledMapLayer>}
   * @memberof ITiledMap
   */
  layers: Array<ITiledMapLayer>;
  /**
   *Auto-increments for each layer
   *
   * @type {number}
   * @memberof ITiledMap
   */
  nextlayerid: number;
  /**
   *	Auto-increments for each placed object
   *
   * @type {number}
   * @memberof ITiledMap
   */
  nextobjectid: number;
  /**
   *	orthogonal, isometric, staggered or hexagonal
   *
   * @type {string}
   * @memberof ITiledMap
   */
  orientation: "orthogonal" | "isometric" | "staggered" | "hexagonal";
  /**
   *	Array of Properties
   *
   * @type {Array<ITiledMapProperty>}
   * @memberof ITiledMap
   */
  properties: Array<ITiledMapProperty>;
  /**
   *	right-down (the default), right-up, left-down or left-up (currently only supported for orthogonal maps)
   *
   * @type {string}
   * @memberof ITiledMap
   */
  renderorder: "right-down" | "right-up" | "left-down" | "left-up";
  /**
   *	x or y (staggered / hexagonal maps only)
   *
   * @type {string}
   * @memberof ITiledMap
   */
  staggeraxis: string;
  /**
   *	odd or even (staggered / hexagonal maps only)
   *
   * @type {string}
   * @memberof ITiledMap
   */
  staggerindex: string;
  /**
   *The Tiled version used to save the file
   *
   * @type {string}
   * @memberof ITiledMap
   */
  tiledversion: string;
  /**
   *	Map grid height
   *
   * @type {number}
   * @memberof ITiledMap
   */
  tileheight: number;
  /**
   *	Array of Tilesets
   *
   * @type {Array<ItiledMapTileset>}
   * @memberof ITiledMap
   */
  tilesets: Array<ItiledMapTileset>;
  /**
   *	Map grid width
   *
   * @type {number}
   * @memberof ITiledMap
   */
  tilewidth: number;
  /**
   *	map (since 1.0)
   *
   * @type {string}
   * @memberof ITiledMap
   */
  type: string;
  /**
   *The JSON format version (previously a number, saved as string since 1.6)
   *
   * @type {string}
   * @memberof ITiledMap
   */
  version: string;
  /**
   *	Number of tile columns
   *
   * @type {number}
   * @memberof ITiledMap
   */
  width: number;
}

interface ITiledMapLayer {
  /**
   * 	Array of chunks (optional). tilelayer only.
   *
   * @type {Array<ITiledMapChunk>}
   * @memberof ITiledMapLayer
   */
  chunks: Array<ITiledMapChunk>;
  /**
   *	zlib, gzip, zstd (since Tiled 1.3) or empty (default). tilelayer only.
   *
   * @type {string}
   * @memberof ITiledMapLayer
   */
  compression: string;

  /**
   *Array of unsigned int (GIDs) or base64-encoded data. tilelayer only.
   *
   * @type {(Array<number>|string)}
   * @memberof ITiledMapLayer
   */
  data: Array<number> | string;
  /**
   *	topdown (default) or index. objectgroup only.
   *
   * @type {string}
   * @memberof ITiledMapLayer
   */
  draworder: string;
  /**
   *	csv (default) or base64. tilelayer only.
   *
   * @type {string}
   * @memberof ITiledMapLayer
   */
  encoding: string;
  /**
   *Row count. Same as map height for fixed-size maps.
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  height: number;
  /**
   *	Incremental ID - unique across all layers
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  id: number;
  /**
   *	Image used by this layer. imagelayer only.
   *
   * @type {string}
   * @memberof ITiledMapLayer
   */
  image: string;
  /**
   *Array of layers. group only.
   *
   * @type {Array<ITiledMapLayer>}
   * @memberof ITiledMapLayer
   */
  layers: Array<ITiledMapLayer>;
  /**
   *	Name assigned to this layer
   *
   * @type {string}
   * @memberof ITiledMapLayer
   */
  name: string;
  /**
   *Array of objects. objectgroup only.
   *
   * @type {Array<ITiledMapObject>}
   * @memberof ITiledMapLayer
   */
  objects: Array<ITiledMapObject>;
  /**
   *	Horizontal layer offset in pixels (default: 0)
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  offsetx: number;
  /**
   *	Vertical layer offset in pixels (default: 0)
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  offsety: number;
  /**
   *	Value between 0 and 1
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  opacity: number;
  /**
   *Horizontal parallax factor for this layer (default: 1). (since Tiled 1.5)
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  parallaxx: number;
  /**
   *Vertical parallax factor for this layer (default: 1). (since Tiled 1.5)
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  parallaxy: number;
  /**
   *Array of Properties
   *
   * @type {Array<ITiledMapProperty>}
   * @memberof ITiledMapLayer
   */
  properties: Array<ITiledMapProperty>;
  /**
   *	X coordinate where layer content starts (for infinite maps)
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  startx: number;
  /**
   *	Y coordinate where layer content starts (for infinite maps)
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  starty: number;
  /**
   *	Hex-formatted tint color (#RRGGBB or #AARRGGBB) that is multiplied with any graphics drawn by this layer or any child layers (optional).
   *
   * @type {string}
   * @memberof ITiledMapLayer
   */
  tintcolor: string;
  /**
   *	Hex-formatted color (#RRGGBB) (optional). imagelayer only.
   *
   * @type {string}
   * @memberof ITiledMapLayer
   */
  transparentcolor: string;
  /**
   *	tilelayer, objectgroup, imagelayer or group
   *
   * @type {string}
   * @memberof ITiledMapLayer
   */
  type: string;
  /**
   *Whether layer is shown or hidden in editor
   *
   * @type {boolean}
   * @memberof ITiledMapLayer
   */
  visible: boolean;
  /**
   *	Column count. Same as map width for fixed-size maps.
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  width: number;
  /**
   *Horizontal layer offset in tiles. Always 0.
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  x: number;
  /**
   *Vertical layer offset in tiles. Always 0.
   *
   * @type {number}
   * @memberof ITiledMapLayer
   */
  y: number;
}

interface ItiledMapTileset {
  /**
   *	Hex-formatted color (#RRGGBB or #AARRGGBB) (optional)
   *
   * @type {string}
   * @memberof ItiledMapTileset
   */
  backgroundcolor: string;
  /**
   *	The number of tile columns in the tileset
   *
   * @type {number}
   * @memberof ItiledMapTileset
   */
  columns: number;
  /**
   *GID corresponding to the first tile in the set
   *
   * @type {number}
   * @memberof ItiledMapTileset
   */
  firstgid: number;
  /**
   *	(optional)
   *
   * @type {ItiledMapGrid}
   * @memberof ItiledMapTileset
   */
  grid: ItiledMapGrid;
  /**
   *	Image used for tiles in this setF
   *
   * @type {string}
   * @memberof ItiledMapTileset
   */
  image: string;
  /**
   *	Height of source image in pixels
   *
   * @type {number}
   * @memberof ItiledMapTileset
   */
  imageheight: number;
  /**
   *	Width of source image in pixels
   *
   * @type {number}
   * @memberof ItiledMapTileset
   */
  imagewidth: number;
  /**
   *Buffer between image edge and first tile (pixels)
   *
   * @type {number}
   * @memberof ItiledMapTileset
   */
  margin: number;
  /**
   *	Name given to this tileset
   *
   * @type {string}
   * @memberof ItiledMapTileset
   */
  name: string;
  /**
   *	Alignment to use for tile objects (unspecified (default), topleft, top, topright, left, center, right, bottomleft, bottom or bottomright) (since 1.4)
   *
   * @type {string}
   * @memberof ItiledMapTileset
   */
  objectalignment: string;
  /**
   *	Array of Properties
   *
   * @type {Array<ITiledMapProperty>}
   * @memberof ItiledMapTileset
   */
  properties: Array<ITiledMapProperty>;
  /**
   *	The external file that contains this tilesets data
   *
   * @type {string}
   * @memberof ItiledMapTileset
   */
  source: string;
  /**
   *	Spacing between adjacent tiles in image (pixels)
   *
   * @type {number}
   * @memberof ItiledMapTileset
   */
  spacing: number;
  /**
   *	Array of Terrains (optional)
   *
   * @type {Array<ItiledMapTerrain>}
   * @memberof ItiledMapTileset
   */
  terrains: Array<ItiledMapTerrain>;
  /**
   *The number of tiles in this tileset
   *
   * @type {number}
   * @memberof ItiledMapTileset
   */
  tilecount: number;
  /**
   *	The Tiled version used to save the file
   *
   * @type {string}
   * @memberof ItiledMapTileset
   */
  tiledversion: string;
  /**
   *Maximum height of tiles in this set
   *
   * @type {number}
   * @memberof ItiledMapTileset
   */
  tileheight: number;
  /**
   *	Tile Offset	(optional)
   *
   * @type {ItiledMapTileOffset}
   * @memberof ItiledMapTileset
   */
  tileoffset: ItiledMapTileOffset;
  /**
   *	Array of Tiles (optional)
   *
   * @type {Array<ItiledMapTile>}
   * @memberof ItiledMapTileset
   */
  tiles: Array<ItiledMapTile>;
  /**
   *Maximum width of tiles in this set
   *
   * @type {number}
   * @memberof ItiledMapTileset
   */
  tilewidth: number;
  /**
   *Allowed transformations (optional)
   *
   * @type {ItiledMapTransformations}
   * @memberof ItiledMapTileset
   */
  transformations: ItiledMapTransformations;
  /**
   *Hex-formatted color (#RRGGBB) (optional)
   *
   * @type {string}
   * @memberof ItiledMapTileset
   */
  transparentcolor: string;
  /**
   *	tileset (for tileset files, since 1.0)
   *
   * @type {string}
   * @memberof ItiledMapTileset
   */
  type: string;
  /**
   *	The JSON format version (previously a number, saved as string since 1.6)
   *
   * @type {string}
   * @memberof ItiledMapTileset
   */
  version: string;
  /**
   *	Array of Wang sets (since 1.1.5)
   *
   * @type {Array<ItiledMapWangSet>}
   * @memberof ItiledMapTileset
   */
  wangsets: Array<ItiledMapWangSet>;
}

interface ItiledMapTile {
  /**
   *Array of Frames
   *
   * @type {Array<ItiledMapFrame>}
   * @memberof ItiledMapTile
   */
  animation: Array<ItiledMapFrame>;
  /**
   *	Local ID of the tile
   *
   * @type {number}
   * @memberof ItiledMapTile
   */
  id: number;
  /**
   *	Image representing this tile (optional)
   *
   * @type {string}
   * @memberof ItiledMapTile
   */
  image: string;
  /**
   *Height of the tile image in pixels
   *
   * @type {number}
   * @memberof ItiledMapTile
   */
  imageheight: number;
  /**
   *	Width of the tile image in pixels
   *
   * @type {number}
   * @memberof ItiledMapTile
   */
  imagewidth: number;
  /**
   *Layer with type objectgroup, when collision shapes are specified (optional)
   *
   * @type {ITiledMapLayer}
   * @memberof ItiledMapTile
   */
  objectgroup: ITiledMapLayer;
  /**
   *	Percentage chance this tile is chosen when competing with others in the editor (optional)
   *
   * @type {number}
   * @memberof ItiledMapTile
   */
  probability: number;
  /**
   *	Array of Properties
   *
   * @type {Array<ITiledMapProperty>}
   * @memberof ItiledMapTile
   */
  properties: Array<ITiledMapProperty>;
  /**
   *	Index of terrain for each corner of tile (optional)
   *
   * @type {Array<number>}
   * @memberof ItiledMapTile
   */
  terrain: Array<number>;
  /**
   *	The type of the tile (optional)
   *
   * @type {string}
   * @memberof ItiledMapTile
   */
  type: string;
}

interface ItiledMapTerrain {
  /**
   *	Name of terrain
   *
   * @type {string}
   * @memberof ItiledMapTerrain
   */
  name: string;
  /**
   *Array of Properties
   *
   * @type {Array<ITiledMapProperty>}
   * @memberof ItiledMapTerrain
   */
  properties: Array<ITiledMapProperty>;
  /**
   *	Local ID of tile representing terrain
   *
   * @type {number}
   * @memberof ItiledMapTerrain
   */
  tile: number;
}

interface ITiledMapChunk {
  /**
   * array or string	Array of unsigned int (GIDs) or base64-encoded data
   *
   * @type {array}
   * @memberof ITiledMapChunk
   */
  data: Array<number>;
  /**
   * Height in tiles
   *
   * @type {number}
   * @memberof ITiledMapChunk
   */
  height: number;
  /**
   *	Width in tiles
   *
   * @type {number}
   * @memberof ITiledMapChunk
   */
  width: number;
  /**
   *	X coordinate in tiles
   *
   * @type {number}
   * @memberof ITiledMapChunk
   */
  x: number;
  /**
   *Y coordinate in tiles
   *
   * @type {number}
   * @memberof ITiledMapChunk
   */
  y: number;
}

export interface ITiledMapObject {
  /**
   * 	Used to mark an object as an ellipse
   *
   * @type {boolean}
   * @memberof ITiledMapObject
   */
  ellipse: boolean;
  /**
   *Global tile ID, only if object represents a tile
   *
   * @type {number}
   * @memberof ITiledMapObject
   */
  gid: number;
  /**
   *	Height in pixels.
   *
   * @type {number}
   * @memberof ITiledMapObject
   */
  height: number;
  /**
   *Incremental ID, unique across all objects
   *
   * @type {number}
   * @memberof ITiledMapObject
   */
  id: number;
  /**
   *	String assigned to name field in editor
   *
   * @type {string}
   * @memberof ITiledMapObject
   */
  name: string;
  /**
   *Used to mark an object as a point
   *
   * @type {boolean}
   * @memberof ITiledMapObject
   */
  point: boolean;
  /**
   *Array of Points, in case the object is a polygon
   *
   * @type {Array<ITiledMapPoint>}
   * @memberof ITiledMapObject
   */
  polygon: Array<ITiledMapPoint>;
  /**
   *	Array of Points, in case the object is a polyline
   *
   * @type {Array<ITiledMapPoint>}
   * @memberof ITiledMapObject
   */
  polyline: Array<ITiledMapPoint>;
  /**
   *Array of Properties
   *
   * @type {Array<ITiledMapProperty>}
   * @memberof ITiledMapObject
   */
  properties: Array<ITiledMapProperty>;
  /**
   *	Angle in degrees clockwise
   *
   * @type {number}
   * @memberof ITiledMapObject
   */
  rotation: number;
  /**
   *	Reference to a template file, in case object is a template instance
   *
   * @type {string}
   * @memberof ITiledMapObject
   */
  template: string;
  /**
   *	Only used for text objects
   *
   * @type {ITiledmapText}
   * @memberof ITiledMapObject
   */
  text: ITiledmapText;
  /**
   *	String assigned to type field in editor
   *
   * @type {string}
   * @memberof ITiledMapObject
   */
  type: string;
  /**
   *	Whether object is shown in editor.
   *
   * @type {boolean}
   * @memberof ITiledMapObject
   */
  visible: boolean;
  /**
   *	Width in pixels.
   *
   * @type {number}
   * @memberof ITiledMapObject
   */
  width: number;
  /**
   *	X coordinate in pixels
   *
   * @type {number}
   * @memberof ITiledMapObject
   */
  x: number;
  /**
   *	Y coordinate in pixels
   *
   * @type {number}
   * @memberof ITiledMapObject
   */
  y: number;
}

interface ITiledmapText {
  /**
   * 	Whether to use a bold font (default: false)
   *
   * @type {boolean}
   * @memberof ITiledmapText
   */
  bold: boolean;
  /**
   *	Hex-formatted color (#RRGGBB or #AARRGGBB) (default: #000000)
   *
   * @type {string}
   * @memberof ITiledmapText
   */
  color: string;
  /**
   *	Font family (default: sans-serif)
   *
   * @type {string}
   * @memberof ITiledmapText
   */
  fontfamily: string;
  /**
   *Horizontal alignment (center, right, justify or left (default))
   *
   * @type {string}
   * @memberof ITiledmapText
   */
  halign: string;
  /**
   *	Whether to use an italic font (default: false)
   *
   * @type {bool}
   * @memberof ITiledmapText
   */
  italic: boolean;
  /**
   *Whether to use kerning when placing characters (default: true)
   *
   * @type {boolean}
   * @memberof ITiledmapText
   */
  kerning: boolean;
  /**
   *	Pixel size of font (default: 16)
   *
   * @type {number}
   * @memberof ITiledmapText
   */
  pixelsize: number;
  /**
   *	Whether to strike out the text (default: false)
   *
   * @type {boolean}
   * @memberof ITiledmapText
   */
  strikeout: boolean;
  /**
   *
   * @type {string}
   * @memberof ITiledmapText
   */
  text: string;
  /**
   *	Whether to underline the text (default: false)
   *
   *
   * @type {boolean}
   * @memberof ITiledmapText
   */
  underline: boolean;
  /**
   *Vertical alignment (center, bottom or top (default))
   *
   * @type {('center' | 'bottom' | 'top')}
   * @memberof ITiledmapText
   */
  valign: "center" | "bottom" | "top";
  /**
   *	Whether the text is wrapped within the object bounds (default: false)
   *
   * @type {boolean}
   * @memberof ITiledmapText
   */
  wrap: boolean;
}

interface ITiledMapProperty {
  /**
   *Name of the property
   *
   * @type {string}
   * @memberof ITiledMapProperty
   */
  name: string;
  /**
   *	Type of the property (string (default), int, float, bool, color or file (since 0.16, with color and file added in 0.17))
   *
   * @type {string}
   * @memberof ITiledMapProperty
   */
  type: string;
  /**
   *	Value of the property
   *
   * @type {number}
   * @memberof ITiledMapProperty
   */
  value: string | number;
}

interface ITiledMapPoint {
  /**
   * 	X coordinate in pixels
   *
   * @type {number}
   * @memberof ITiledMapPoint
   */
  x: number;
  /**
   *Y coordinate in pixels
   *
   * @type {number}
   * @memberof ITiledMapPoint
   */
  y: number;
}

interface ItiledMapTileOffset {
  /**
   *Horizontal offset in pixels
   *
   * @type {number}
   * @memberof ItiledMapTileOffset
   */
  x: number;
  /**
   *	Vertical offset in pixels (positive is down)
   *
   * @type {number}
   * @memberof ItiledMapTileOffset
   */
  y: number;
}

interface ItiledMapTransformations {
  /**
   *	Tiles can be flipped horizontally
   *
   * @type {boolean}
   * @memberof ItiledMapTransformations
   */
  hflip: boolean;
  /**
   *	Tiles can be flipped vertically
   *
   * @type {boolean}
   * @memberof ItiledMapTransformations
   */
  vflip: boolean;
  /**
   *Tiles can be rotated in 90-degree increments
   *
   * @type {boolean}
   * @memberof ItiledMapTransformations
   */
  rotate: boolean;
  /**
   *Whether untransformed tiles remain preferred, otherwise transformed tiles are used to produce more variations
   *
   * @type {boolean}
   * @memberof ItiledMapTransformations
   */
  preferuntransformed: boolean;
}

interface ItiledMapFrame {
  /**
   *	Frame duration in milliseconds
   *
   * @type {number}
   * @memberof ItiledMapFrame
   */
  duration: number;
  /**
   *	Local tile ID representing this frame
   *
   * @type {number}
   * @memberof ItiledMapFrame
   */
  tileid: number;
}

interface ItiledMapGrid {
  /**
   *	Cell height of tile grid
   *
   * @type {number}
   * @memberof ItiledMapGrid
   */
  height: number;
  /**
   *	orthogonal (default) or isometric
   *
   * @type {string}
   * @memberof ItiledMapGrid
   */
  orientation: string;
  /**
   *	Cell width of tile grid
   *
   * @type {number}
   * @memberof ItiledMapGrid
   */
  width: number;
}

interface ItiledMapWangSet {
  /**
   *	Array of Wang colors
   *
   * @type {Array<ItiledMapWangColor>}
   * @memberof ItiledMapWangSet
   */
  colors: Array<ItiledMapWangColor>;
  /**
   *	Name of the Wang set
   *
   * @type {string}
   * @memberof ItiledMapWangSet
   */
  name: string;
  /**
   *	Array of Properties
   *
   * @type {Array<ITiledMapProperty>}
   * @memberof ItiledMapWangSet
   */
  properties: Array<ITiledMapProperty>;
  /**
   *Local ID of tile representing the Wang set
   *
   * @type {number}
   * @memberof ItiledMapWangSet
   */
  tile: number;
  /**
   *Array of Wang tiles
   *
   * @type {Array<ItiledMapWangTile>}
   * @memberof ItiledMapWangSet
   */
  wangtiles: Array<ItiledMapWangTile>;
}

interface ItiledMapWangColor {
  /**
   *	Hex-formatted color (#RRGGBB or #AARRGGBB)
   *
   * @type {string}
   * @memberof ItiledMapWangColor
   */
  color: string;
  /**
   *	Name of the Wang color
   *
   * @type {string}
   * @memberof ItiledMapWangColor
   */
  name: string;
  /**
   *	Probability used when randomizing
   *
   * @type {number}
   * @memberof ItiledMapWangColor
   */
  probability: number;
  /**
   *	Array of Properties
   *
   * @type {Array<ITiledMapProperty>}
   * @memberof ItiledMapWangColor
   */
  properties: Array<ITiledMapProperty>;
  /**
   *Local ID of tile representing the Wang color
   *
   * @type {number}
   * @memberof ItiledMapWangColor
   */
  tile: number;
}

interface ItiledMapWangTile {
  /**
   *Local ID of tile
   *
   * @type {number}
   * @memberof ItiledMapWangTile
   */
  tileid: number;
  /**
   *Array of Wang color indexes (uchar[8])
   *
   * @type {Array<number>}
   * @memberof ItiledMapWangTile
   */
  wangid: Array<number>;
}

/**
 * tiledMap是整个地图的核心
 * 地图以层级来划分地图（例如：地表层，植被层，建筑层）
 * 每层又以分块（GridSprite)来处理显示对象，只显示在视口区域的区
 * 每块又包括N*N个格子（tile)
 * 格子类型又分为动画格子跟图片格子两种
 * @author ...
 */
export class TiledMap {
  //地图支持的类型(目前支持四边形地图，菱形地图，六边形地图)
  /**四边形地图*/
  static ORIENTATION_ORTHOGONAL: string = "orthogonal";
  /**菱形地图*/
  static ORIENTATION_ISOMETRIC: string = "isometric";
  /**45度交错地图*/
  static ORIENTATION_STAGGERED: string = "staggered";
  /**六边形地图*/
  static ORIENTATION_HEXAGONAL: string = "hexagonal";
  //地图格子（tile）的渲染顺序
  /**地图格子从左上角开始渲染*/
  static RENDERORDER_RIGHTDOWN: string = "right-down";
  /**地图格子从左下角开始渲染*/
  static RENDERORDER_RIGHTUP: string = "right-up";
  /**地图格子从右上角开始渲染*/
  static RENDERORDER_LEFTDOWN: string = "left-down";
  /**地图格子右下角开始渲染*/
  static RENDERORDER_LEFTUP: string = "left-up";

  //json数据
  private _jsonData: any;
  //存放地图中用到的所有子纹理数据
  private _tileTexSetArr: any[] = [];
  //主纹理数据，主要在释放纹理资源时使用
  private _texArray: any[] = [];
  //地图信息中的一些基本数据
  private _x: number = 0; //地图的坐标
  private _y: number = 0;
  //_width = _mapTileW * _mapW
  //_height = _mapTileH * _mapH
  private _width: number = 0; //地图的宽度
  private _height: number = 0; //地图的高度
  private _mapW: number = 0; //地图的横向格子数
  private _mapH: number = 0; //地图的竖向格子数
  private _mapTileW: number = 0; //tile的宽度
  private _mapTileH: number = 0; //tile的高度

  //用来存放地图的视口信息
  private _rect: Rectangle = new Rectangle();
  //用来存放地图的视口扩充区域
  private _paddingRect: Rectangle = new Rectangle();
  //地图的显示对象
  private _atlasPath: string = null!;
  private _mapSprite: Sprite = null; //地图的显示对象
  private _fog: MapFogLayer = null!;
  private _layerArray: any[] = []; //这里保存所有的MapLayer对象
  private _renderLayerArray: any[] = []; //这里保存需要渲染的MapLayer对象
  private _gridArray: any[] = []; //保存所有的块数据
  //地图块相关的
  private _showGridKey: boolean = false; //是否显示块边界线（用来调试用）
  private _totalGridNum: number = 0; //一层中的GridSprite的总数
  private _gridW: number = 0; //地图的横向块数
  private _gridH: number = 0; //地图的坚向块数
  private _gridWidth: number = 450; //块的默认宽度
  private _gridHeight: number = 450; //块的默认高度

  private _jsonLoader: Loader = null; //用来加载JSON文件用的LOADER
  private _loader: Loader = null; //用来加载纹理数据用的LOADER
  private _tileSetArray: any[] = []; //用来存放还需要哪些儿纹理等待加载
  private _currTileSet: TileSet = null; //正在加载的纹理需要的数据源
  private _completeHandler: Handler = null; //地图创建完成的回调函数
  //用来裁剪块的区域（有当前视口和上次视口显示多少的块，就能哪些儿块需要显示或隐藏
  private _mapRect: GRect = new GRect(); //当前视口显示的块范围
  private _mapLastRect: GRect = new GRect(); //上次视口显示的块范围
  private _index: number = 0;
  private _animationDic: any = {}; //需要创建的动画数据
  private _properties: any; //当前地图的自定义属性
  private _tileProperties: any = {}; //图块属性
  private _tileProperties2: any = {};
  //默认的地图类型（具体要看JSON文件）
  private _orientation: string = "orthogonal";
  //默认的tile渲染顺序（具体要看JSON文件）
  private _renderOrder: string = "right-down";
  //调试用的颜色组合
  private _colorArray: any[] = ["FF", "00", "33", "66"];
  //缩放相关的操作
  private _scale: number = 1;
  private _pivotScaleX: number = 0.5;
  private _pivotScaleY: number = 0.5;
  private _centerX: number = 0;
  private _centerY: number = 0;
  /**@internal */
  _viewPortX: number = 0;
  /**@internal */
  _viewPortY: number = 0;
  private _viewPortWidth: number = 0;
  private _viewPortHeight: number = 0;
  //是否开启线性取样
  private _enableLinear: boolean = true;
  //资源的相对路径
  private _resPath: string;
  private _pathArray: any[];
  //把地图限制在显示区域
  private _limitRange: boolean = false;
  /**
   * 是否自动缓存没有动画的地块
   */
  autoCache: boolean = true;
  /**
   * 自动缓存类型,地图较大时建议使用normal
   */
  autoCacheType: string = "normal";
  /**
   * 是否合并图层,开启合并图层时，图层属性内可添加layer属性，运行时将会将相邻的layer属性相同的图层进行合并以提高性能
   */
  enableMergeLayer: boolean = false;
  /**
   * 是否移除被覆盖的格子,地块可添加type属性，type不为0时表示不透明，被不透明地块遮挡的地块将会被剔除以提高性能
   */
  removeCoveredTile: boolean = false;
  /**
   * 是否显示大格子里显示的贴图数量
   */
  showGridTextureCount: boolean = false;

  /**
   * 是否调整地块边缘消除缩放导致的缝隙
   */
  antiCrack: boolean = true;

  /**
   * 是否在加载完成之后cache所有大格子
   */
  cacheAllAfterInit: boolean = false;

  constructor() { }

  /**
   * 创建地图
   * @param	mapName 		JSON文件名字
   * @param	viewRect 		视口区域
   * @param	completeHandler 地图创建完成的回调函数
   * @param	viewRectPadding 视口扩充区域，把视口区域上、下、左、右扩充一下，防止视口移动时的穿帮
   * @param	gridSize 		grid大小
   * @param	enableLinear 	是否开启线性取样（为false时，可以解决地图黑线的问题，但画质会锐化）
   * @param	limitRange		把地图限制在显示区域
   */
  createMap(
    mapName: string,
    viewRect: Rectangle,
    completeHandler: Handler,
    viewRectPadding: Rectangle = null,
    gridSize: Point = null,
    enableLinear: boolean = true,
    limitRange: boolean = false
  ): void {
    this._enableLinear = enableLinear;
    this._limitRange = limitRange;
    this._rect.x = viewRect.x;
    this._rect.y = viewRect.y;
    this._rect.width = viewRect.width;
    this._rect.height = viewRect.height;
    this._viewPortWidth = viewRect.width / this._scale;
    this._viewPortHeight = viewRect.height / this._scale;
    this._completeHandler = completeHandler;
    if (viewRectPadding) {
      this._paddingRect.copyFrom(viewRectPadding);
    } else {
      this._paddingRect.setTo(0, 0, 0, 0);
    }
    if (gridSize) {
      this._gridWidth = gridSize.x;
      this._gridHeight = gridSize.y;
    }
    var tIndex: number = mapName.lastIndexOf("/");
    if (tIndex > -1) {
      this._resPath = mapName.substr(0, tIndex);
      this._pathArray = this._resPath.split("/");
    } else {
      this._resPath = "";
      this._pathArray = [];
    }
  }

  /**
   * json文件读取成功后，解析里面的纹理数据，进行加载
   * @param	e JSON数据
   */
  public setMapJsonData(e: ITiledMap, atlas: string): void {
    this._mapSprite = new Sprite();
    this._atlasPath = atlas;
    ILaya.stage.addChild(this._mapSprite);
    var tJsonData: any = (this._jsonData = e);

    this._properties = tJsonData.properties;
    this._orientation = tJsonData.orientation;
    this._renderOrder = tJsonData.renderorder;
    this._mapW = tJsonData.width;
    this._mapH = tJsonData.height;

    this._mapTileW = tJsonData.tilewidth;
    this._mapTileH = tJsonData.tileheight;

    this._width = this._mapTileW * this._mapW;
    this._height = this._mapTileH * this._mapH;

    if (this._orientation == TiledMap.ORIENTATION_STAGGERED) {
      this._height = (0.5 + this._mapH * 0.5) * this._mapTileH;
    }

    this._mapLastRect.top =
      this._mapLastRect.bottom =
      this._mapLastRect.left =
      this._mapLastRect.right =
      -1;

    var tArray: any[] = tJsonData.tilesets;
	const getAtlasRes: Function = loader.getRes;
    var tileset: any;
    var tTileSet: TileSet;
    var i: number = 0;
    for (i = 0; i < tArray.length; i++) {
      tileset = tArray[i];
      tTileSet = new TileSet();
      tTileSet.init(tileset);
      if (tTileSet.properties && tTileSet.properties.ignore) continue;
      this._tileProperties[i] = tTileSet.tileproperties;
      this.addTileProperties(tTileSet.tileproperties);
      this._tileSetArray.push(tTileSet);

      const set = new TileTexSet();
      set.offX = 0;
      set.offY = tTileSet.titleoffsetY - (tTileSet.tileheight - this._mapTileH);
      set.texture = getAtlasRes(`${atlas}/${tTileSet.image}`, true);

      if (this.antiCrack) TiledMap.adptTexture(set.texture);
      this._tileTexSetArr[tTileSet.firstgid] = set;
    }

    const atlasJson = loader.getRes(`${atlas}.json`);
    const frames = atlasJson.frames;
    for (const frame in frames) {
      const sub = getAtlasRes(`${atlas}/${frame}`, true) as Texture;

      if (!this._enableLinear) {
        (sub.bitmap as any).minFifter = 0x2600;
        (sub.bitmap as any).magFifter = 0x2600;
      }
    }
  }

  /**
   * 合并路径
   * @param	resPath
   * @param	relativePath
   * @return
   */
  private mergePath(resPath: string, relativePath: string): string {
    var tResultPath: string = "";
    var tImageArray: any[] = relativePath.split("/");
    var tParentPathNum: number = 0;
    var i: number = 0;
    for (i = tImageArray.length - 1; i >= 0; i--) {
      if (tImageArray[i] == "..") {
        tParentPathNum++;
      }
    }
    if (tParentPathNum == 0) {
      if (this._pathArray.length > 0) {
        tResultPath = resPath + "/" + relativePath;
      } else {
        tResultPath = relativePath;
      }

      return tResultPath;
    }
    var tSrcNum: number = this._pathArray.length - tParentPathNum;
    if (tSrcNum < 0) {
      console.log(
        "[error]path does not exist",
        this._pathArray,
        tImageArray,
        resPath,
        relativePath
      );
    }
    for (i = 0; i < tSrcNum; i++) {
      if (i == 0) {
        tResultPath += this._pathArray[i];
      } else {
        tResultPath = tResultPath + "/" + this._pathArray[i];
      }
    }
    for (i = tParentPathNum; i < tImageArray.length; i++) {
      tResultPath = tResultPath + "/" + tImageArray[i];
    }
    return tResultPath;
  }

  public static adptTexture(tex: Texture): void {
    if (!tex) return;
	// by yanmingjie
	// 这里加一个tiled处理过的texture标记，防止不清理资源时重复修改texture导致显示异常
	if (tex['$tiled_adpt']) return;
    var pX: number = tex.uv[0];
    var pX1: number = tex.uv[2];
    var pY: number = tex.uv[1];
    var pY1: number = tex.uv[7];
    var dW: number = 1 / tex.bitmap.width;
    var dH: number = 1 / tex.bitmap.height;
    var Tex: any = tex;
	tex['$tiled_adpt'] = true;
    Tex.uv[0] = Tex.uv[6] = pX + dW;
    Tex.uv[2] = Tex.uv[4] = pX1 - dW;
    Tex.uv[1] = Tex.uv[3] = pY + dH;
    Tex.uv[5] = Tex.uv[7] = pY1 - dH;
  }

  /**
   * 初始化地图
   */
  public initMap(has: boolean): void {
    var i: number, n: number;
    this._gridWidth =
      Math.floor(this._gridWidth / this._mapTileW) * this._mapTileW;
    this._gridHeight =
      Math.floor(this._gridHeight / this._mapTileH) * this._mapTileH;
    if (this._gridWidth < this._mapTileW) {
      this._gridWidth = this._mapTileW;
    }
    if (this._gridHeight < this._mapTileH) {
      this._gridHeight = this._mapTileH;
    }

    this._gridW = Math.ceil(this._width / this._gridWidth);
    this._gridH = Math.ceil(this._height / this._gridHeight);
    this._totalGridNum = this._gridW * this._gridH;
    for (i = 0; i < this._gridH; i++) {
      var tGridArray: any[] = [];
      this._gridArray.push(tGridArray);
      for (var j: number = 0; j < this._gridW; j++) {
        tGridArray.push(null);
      }
    }

    var tLayerArray: any[] = this._jsonData.layers;
    var isFirst: boolean = true;
    var tTarLayerID: number = 1;
    var tLayerTarLayerName: string;
    var preLayerTarName: string;
    var preLayer: MapLayer;

    //创建地图层级
    for (
      var tLayerLoop: number = 0;
      tLayerLoop < tLayerArray.length;
      tLayerLoop++
    ) {
      var tLayerData: any = tLayerArray[tLayerLoop];
      if (tLayerData.visible == true) {
        //如果不显示，那么也没必要创建
        var tMapLayer: MapLayer = new MapLayer();
        tMapLayer.init(tLayerData, this);
        if (!this.enableMergeLayer) {
          this._mapSprite.addChild(tMapLayer);
          this._renderLayerArray.push(tMapLayer);
        } else {
          tLayerTarLayerName = tMapLayer.getLayerProperties("layer");
          isFirst =
            isFirst || !preLayer || tLayerTarLayerName != preLayerTarName;
          if (isFirst) {
            isFirst = false;
            tMapLayer.tarLayer = tMapLayer;
            preLayer = tMapLayer;
            this._mapSprite.addChild(tMapLayer);
            this._renderLayerArray.push(tMapLayer);
          } else {
            tMapLayer.tarLayer = preLayer;
          }
          preLayerTarName = tLayerTarLayerName;
        }

        this._layerArray.push(tMapLayer);
      }
    }

    if (has) {
      const fog = this._fog = new MapFogLayer();
      fog.init({ name: "fog", opacity: 0.5, atlas: this._atlasPath, image: "fog.png" }, this);
      this.addCustomeLayer(fog);
    }

    if (this.removeCoveredTile) {
      this.adptTiledMapData();
    }
    if (this.cacheAllAfterInit) {
      this.cacheAllGrid();
    }
    this.moveViewPort(this._rect.x, this._rect.y);

    if (this._completeHandler != null) {
      this._completeHandler.run();
    }
    //这里应该发送消息，通知上层，地图创建完成
  }

  public addCustomeLayer(tMapLayer: MapLayer): void {
    this._mapSprite.addChild(tMapLayer);
    this._renderLayerArray.push(tMapLayer);
    this._layerArray.push(tMapLayer);
  }

  public getFog(): MapFogLayer {
    return this._fog;
  }

  private addTileProperties(tileDataDic: any): void {
    var key: string;
    for (key in tileDataDic) {
      this._tileProperties2[key] = tileDataDic[key];
    }
  }

  getTileUserData(id: number, sign: string, defaultV: any = null): any {
    if (
      !this._tileProperties2 ||
      !this._tileProperties2[id] ||
      !(sign in this._tileProperties2[id])
    )
      return defaultV;
    return this._tileProperties2[id][sign];
  }

  private adptTiledMapData(): void {
    var i: number, len: number;
    len = this._layerArray.length;
    var tLayer: MapLayer;
    var noNeeds: any = {};
    var tDatas: any[];
    for (i = len - 1; i >= 0; i--) {
      tLayer = this._layerArray[i];
      tDatas = tLayer._mapData;
      if (!tDatas) continue;
      this.removeCoverd(tDatas, noNeeds);
      this.collectCovers(tDatas, noNeeds, i);
    }
  }

  private removeCoverd(datas: any[], noNeeds: any): void {
    var i: number, len: number;
    len = datas.length;
    for (i = 0; i < len; i++) {
      if (noNeeds[i]) {
        datas[i] = 0;
      }
    }
  }

  private collectCovers(datas: any[], noNeeds: any, layer: number): void {
    var i: number, len: number;
    len = datas.length;
    var tTileData: number;
    var isCover: number;
    for (i = 0; i < len; i++) {
      tTileData = datas[i];
      if (tTileData > 0) {
        isCover = this.getTileUserData(tTileData - 1, "type", 0);
        if (isCover > 0) {
          noNeeds[i] = tTileData;
        }
      }
    }
  }
  /**
   * 得到一块指定的地图纹理
   * @param	index 纹理的索引值，默认从1开始
   * @return
   */
  getTexture(index: number): TileTexSet {
    if (index < this._tileTexSetArr.length) {
      return this._tileTexSetArr[index];
    }
    return null;
  }

  /**
   * 得到地图的自定义属性
   * @param	name		属性名称
   * @return
   */
  getMapProperties(name: string): any {
    if (this._properties) {
      return this._properties[name];
    }
    return null;
  }

  /**
   * 得到tile自定义属性
   * @param	index		地图块索引
   * @param	id			具体的TileSetID
   * @param	name		属性名称
   * @return
   */
  getTileProperties(index: number, id: number, name: string): any {
    if (this._tileProperties[index] && this._tileProperties[index][id]) {
      return this._tileProperties[index][id][name];
    }
    return null;
  }

  /**
   * 通过纹理索引，生成一个可控制物件
   * @param	index 纹理的索引值，默认从1开始
   * @return
   */
  getSprite(index: number, width: number, height: number): GridSprite {
    if (0 < this._tileTexSetArr.length) {
      var tGridSprite: GridSprite = new GridSprite();
      tGridSprite.initData(this, true);
      tGridSprite.size(width, height);
      var tTileTexSet: TileTexSet = this._tileTexSetArr[index];
      if (tTileTexSet != null && tTileTexSet.texture != null) {
        if (tTileTexSet.isAnimation) {
          var tAnimationSprite: TileAniSprite = new TileAniSprite();
          this._index++;
          tAnimationSprite.setTileTextureSet(
            this._index.toString(),
            tTileTexSet
          );
          tGridSprite.addAniSprite(tAnimationSprite);
          tGridSprite.addChild(tAnimationSprite);
        } else {
          tGridSprite.graphics.drawImage(
            tTileTexSet.texture,
            0,
            0,
            width,
            height
          );
        }
        tGridSprite.drawImageNum++;
      }
      return tGridSprite;
    }
    return null;
  }

  /**
   * 设置视口的缩放中心点（例如：scaleX= scaleY= 0.5,就是以视口中心缩放）
   * @param	scaleX
   * @param	scaleY
   */
  setViewPortPivotByScale(scaleX: number, scaleY: number): void {
    this._pivotScaleX = scaleX;
    this._pivotScaleY = scaleY;
  }

  /**
   * 设置地图缩放
   * @param	scale
   */
  set scale(scale: number) {
    if (scale <= 0) return;
    this._scale = scale;
    this._viewPortWidth = this._rect.width / scale;
    this._viewPortHeight = this._rect.height / scale;
    this._mapSprite.scale(this._scale, this._scale);
    this.updateViewPort();
  }

  /**
   * 得到当前地图的缩放
   */
  get scale(): number {
    return this._scale;
  }

  /**
   * 移动视口
   * @param	moveX 视口的坐标x
   * @param	moveY 视口的坐标y
   */
  moveViewPort(moveX: number, moveY: number): void {
    this._x = -moveX;
    this._y = -moveY;
    this._rect.x = moveX;
    this._rect.y = moveY;
    this.updateViewPort();
  }

  /**
   * 改变视口大小
   * @param	moveX	视口的坐标x
   * @param	moveY	视口的坐标y
   * @param	width	视口的宽
   * @param	height	视口的高
   */
  changeViewPort(
    moveX: number,
    moveY: number,
    width: number,
    height: number
  ): void {
    if (
      moveX == this._rect.x &&
      moveY == this._rect.y &&
      width == this._rect.width &&
      height == this._rect.height
    )
      return;
    this._x = -moveX;
    this._y = -moveY;
    this._rect.x = moveX;
    this._rect.y = moveY;
    this._rect.width = width;
    this._rect.height = height;
    this._viewPortWidth = width / this._scale;
    this._viewPortHeight = height / this._scale;
    this.updateViewPort();
  }

  /**
   * 在锚点的基础上计算，通过宽和高，重新计算视口
   * @param	width		新视口宽
   * @param	height		新视口高
   * @param	rect		返回的结果
   * @return
   */
  changeViewPortBySize(
    width: number,
    height: number,
    rect: Rectangle = null
  ): Rectangle {
    if (rect == null) {
      rect = new Rectangle();
    }
    this._centerX = this._rect.x + this._rect.width * this._pivotScaleX;
    this._centerY = this._rect.y + this._rect.height * this._pivotScaleY;
    rect.x = this._centerX - width * this._pivotScaleX;
    rect.y = this._centerY - height * this._pivotScaleY;
    rect.width = width;
    rect.height = height;
    this.changeViewPort(rect.x, rect.y, rect.width, rect.height);
    return rect;
  }

  /**
   * 刷新视口
   */
  private updateViewPort(): void {
    //_rect.x和rect.y是内部坐标，会自动叠加缩放
    this._centerX = this._rect.x + this._rect.width * this._pivotScaleX;
    this._centerY = this._rect.y + this._rect.height * this._pivotScaleY;
    var posChanged: boolean = false;
    var preValue: number = this._viewPortX;
    this._viewPortX =
      this._centerX - (this._rect.width * this._pivotScaleX) / this._scale;
    if (preValue != this._viewPortX) {
      posChanged = true;
    } else {
      preValue = this._viewPortY;
    }
    this._viewPortY =
      this._centerY - (this._rect.height * this._pivotScaleY) / this._scale;
    if (!posChanged && preValue != this._viewPortY) {
      posChanged = true;
    }
    if (this._limitRange) {
      var tRight: number = this._viewPortX + this._viewPortWidth;
      if (tRight > this._width) {
        this._viewPortX = this._width - this._viewPortWidth;
      }
      var tBottom: number = this._viewPortY + this._viewPortHeight;
      if (tBottom > this._height) {
        this._viewPortY = this._height - this._viewPortHeight;
      }
      if (this._viewPortX < 0) {
        this._viewPortX = 0;
      }
      if (this._viewPortY < 0) {
        this._viewPortY = 0;
      }
    }
    var tPaddingRect: Rectangle = this._paddingRect;
    this._mapRect.top = Math.floor(
      (this._viewPortY - tPaddingRect.y) / this._gridHeight
    );
    this._mapRect.bottom = Math.floor(
      (this._viewPortY +
        this._viewPortHeight +
        tPaddingRect.height +
        tPaddingRect.y) /
      this._gridHeight
    );
    this._mapRect.left = Math.floor(
      (this._viewPortX - tPaddingRect.x) / this._gridWidth
    );
    this._mapRect.right = Math.floor(
      (this._viewPortX +
        this._viewPortWidth +
        tPaddingRect.width +
        tPaddingRect.x) /
      this._gridWidth
    );
    if (
      this._mapRect.top != this._mapLastRect.top ||
      this._mapRect.bottom != this._mapLastRect.bottom ||
      this._mapRect.left != this._mapLastRect.left ||
      this._mapRect.right != this._mapLastRect.right
    ) {
      this.clipViewPort();
      this._mapLastRect.top = this._mapRect.top;
      this._mapLastRect.bottom = this._mapRect.bottom;
      this._mapLastRect.left = this._mapRect.left;
      this._mapLastRect.right = this._mapRect.right;
      posChanged = true;
    }

    if (!posChanged) return;

    var tMapLayer: MapLayer;
    var len: number = this._renderLayerArray.length;
    for (var i: number = 0; i < len; i++) {
      tMapLayer = this._renderLayerArray[i];
      if (tMapLayer._gridSpriteArray.length > 0) tMapLayer.updateGridPos();
    }
  }

  /**
   * GRID裁剪
   */
  private clipViewPort(): void {
    var tSpriteNum: number = 0;
    var tSprite: Sprite;
    var tIndex: number = 0;
    var tSub: number = 0;
    var tAdd: number = 0;
    var i: number, j: number;
    if (this._mapRect.left > this._mapLastRect.left) {
      //裁剪
      tSub = this._mapRect.left - this._mapLastRect.left;
      if (tSub > 0) {
        for (
          j = this._mapLastRect.left;
          j < this._mapLastRect.left + tSub;
          j++
        ) {
          for (i = this._mapLastRect.top; i <= this._mapLastRect.bottom; i++) {
            this.hideGrid(j, i);
          }
        }
      }
    } else {
      //增加
      tAdd =
        Math.min(this._mapLastRect.left, this._mapRect.right + 1) -
        this._mapRect.left;
      if (tAdd > 0) {
        for (j = this._mapRect.left; j < this._mapRect.left + tAdd; j++) {
          for (i = this._mapRect.top; i <= this._mapRect.bottom; i++) {
            this.showGrid(j, i);
          }
        }
      }
    }
    if (this._mapRect.right > this._mapLastRect.right) {
      //增加
      tAdd = this._mapRect.right - this._mapLastRect.right;
      if (tAdd > 0) {
        for (
          j = Math.max(this._mapLastRect.right + 1, this._mapRect.left);
          j <= this._mapLastRect.right + tAdd;
          j++
        ) {
          for (i = this._mapRect.top; i <= this._mapRect.bottom; i++) {
            this.showGrid(j, i);
          }
        }
      }
    } else {
      //裁剪
      tSub = this._mapLastRect.right - this._mapRect.right;
      if (tSub > 0) {
        for (
          j = this._mapRect.right + 1;
          j <= this._mapRect.right + tSub;
          j++
        ) {
          for (i = this._mapLastRect.top; i <= this._mapLastRect.bottom; i++) {
            this.hideGrid(j, i);
          }
        }
      }
    }
    if (this._mapRect.top > this._mapLastRect.top) {
      //裁剪
      tSub = this._mapRect.top - this._mapLastRect.top;
      if (tSub > 0) {
        for (i = this._mapLastRect.top; i < this._mapLastRect.top + tSub; i++) {
          for (j = this._mapLastRect.left; j <= this._mapLastRect.right; j++) {
            this.hideGrid(j, i);
          }
        }
      }
    } else {
      //增加
      tAdd =
        Math.min(this._mapLastRect.top, this._mapRect.bottom + 1) -
        this._mapRect.top;
      if (tAdd > 0) {
        for (i = this._mapRect.top; i < this._mapRect.top + tAdd; i++) {
          for (j = this._mapRect.left; j <= this._mapRect.right; j++) {
            this.showGrid(j, i);
          }
        }
      }
    }
    if (this._mapRect.bottom > this._mapLastRect.bottom) {
      //增加
      tAdd = this._mapRect.bottom - this._mapLastRect.bottom;
      if (tAdd > 0) {
        for (
          i = Math.max(this._mapLastRect.bottom + 1, this._mapRect.top);
          i <= this._mapLastRect.bottom + tAdd;
          i++
        ) {
          for (j = this._mapRect.left; j <= this._mapRect.right; j++) {
            this.showGrid(j, i);
          }
        }
      }
    } else {
      //裁剪
      tSub = this._mapLastRect.bottom - this._mapRect.bottom;
      if (tSub > 0) {
        for (
          i = this._mapRect.bottom + 1;
          i <= this._mapRect.bottom + tSub;
          i++
        ) {
          for (j = this._mapLastRect.left; j <= this._mapLastRect.right; j++) {
            this.hideGrid(j, i);
          }
        }
      }
    }
  }

  /**
   * 显示指定的GRID
   * @param	gridX
   * @param	gridY
   */
  private showGrid(gridX: number, gridY: number): void {
    if (
      gridX < 0 ||
      gridX >= this._gridW ||
      gridY < 0 ||
      gridY >= this._gridH
    ) {
      return;
    }
    var i: number, j: number;
    var tGridSprite: GridSprite;
    var tTempArray: any[] = this._gridArray[gridY][gridX];
    if (tTempArray == null) {
      tTempArray = this.getGridArray(gridX, gridY);
    } else {
      for (i = 0; i < tTempArray.length && i < this._layerArray.length; i++) {
        var tLayerSprite: Sprite = this._layerArray[i];
        if (tLayerSprite && tTempArray[i]) {
          tGridSprite = tTempArray[i];
          if (tGridSprite.visible == false && tGridSprite.drawImageNum > 0) {
            tGridSprite.show();
          }
        }
      }
    }
  }

  private cacheAllGrid(): void {
    var i: number, j: number;
    var tempArr: any[];
    for (i = 0; i < this._gridW; i++) {
      for (j = 0; j < this._gridH; j++) {
        tempArr = this.getGridArray(i, j);
        this.cacheGridsArray(tempArr);
      }
    }
  }
  private static _tempCanvas: any;
  private cacheGridsArray(arr: any[]): void {
    var canvas: any;
    if (!TiledMap._tempCanvas) {
      TiledMap._tempCanvas = new HTMLCanvas();
      var tx: Context = TiledMap._tempCanvas.context;
      if (!tx) {
        tx = TiledMap._tempCanvas.getContext("2d"); //如果是webGL的话，这个会返回WebGLContext2D

        //tx.__tx = 0;
        //tx.__ty = 0;
      }
    }
    canvas = TiledMap._tempCanvas;
    canvas.context.asBitmap = false;

    var i: number, len: number;
    len = arr.length;
    var tGrid: GridSprite;
    for (i = 0; i < len; i++) {
      tGrid = arr[i];
      canvas.clear();
      canvas.size(1, 1);
      tGrid.render(canvas.context, 0, 0);
      tGrid.hide();
    }
    canvas.clear();
    canvas.size(1, 1);
  }

  private getGridArray(gridX: number, gridY: number): any[] {
    var i: number, j: number;
    var tGridSprite: GridSprite;
    var tTempArray: any[] = this._gridArray[gridY][gridX];
    if (tTempArray == null) {
      tTempArray = this._gridArray[gridY][gridX] = [];

      var tLeft: number = 0;
      var tRight: number = 0;
      var tTop: number = 0;
      var tBottom: number = 0;

      var tGridWidth: number = this._gridWidth;
      var tGridHeight: number = this._gridHeight;
      switch (this.orientation) {
        case TiledMap.ORIENTATION_ISOMETRIC: //45度角
          tLeft = Math.floor(gridX * tGridWidth);
          tRight = Math.floor(gridX * tGridWidth + tGridWidth);
          tTop = Math.floor(gridY * tGridHeight);
          tBottom = Math.floor(gridY * tGridHeight + tGridHeight);
          var tLeft1: number, tRight1: number, tTop1: number, tBottom1: number;
          break;
        case TiledMap.ORIENTATION_STAGGERED: //45度交错地图
          tLeft = Math.floor((gridX * tGridWidth) / this._mapTileW);
          tRight = Math.floor(
            (gridX * tGridWidth + tGridWidth) / this._mapTileW
          );
          tTop = Math.floor((gridY * tGridHeight) / (this._mapTileH / 2));
          tBottom = Math.floor(
            (gridY * tGridHeight + tGridHeight) / (this._mapTileH / 2)
          );
          break;
        case TiledMap.ORIENTATION_ORTHOGONAL: //直角
          tLeft = Math.floor((gridX * tGridWidth) / this._mapTileW);
          tRight = Math.floor(
            (gridX * tGridWidth + tGridWidth) / this._mapTileW
          );
          tTop = Math.floor((gridY * tGridHeight) / this._mapTileH);
          tBottom = Math.floor(
            (gridY * tGridHeight + tGridHeight) / this._mapTileH
          );
          break;
        case TiledMap.ORIENTATION_HEXAGONAL: //六边形
          var tHeight: number = (this._mapTileH * 2) / 3;
          tLeft = Math.floor((gridX * tGridWidth) / this._mapTileW);
          tRight = Math.ceil(
            (gridX * tGridWidth + tGridWidth) / this._mapTileW
          );
          tTop = Math.floor((gridY * tGridHeight) / tHeight);
          tBottom = Math.ceil((gridY * tGridHeight + tGridHeight) / tHeight);
          break;
      }

      var tLayer: MapLayer = null;
      var tTGridSprite: GridSprite;
      var tDrawMapLayer: MapLayer;
      for (var z: number = 0; z < this._layerArray.length; z++) {
        tLayer = this._layerArray[z];

        if (this.enableMergeLayer) {
          if (tLayer.tarLayer != tDrawMapLayer) {
            tTGridSprite = null;
            tDrawMapLayer = tLayer.tarLayer;
          }
          if (!tTGridSprite) {
            tTGridSprite = tDrawMapLayer.getDrawSprite(gridX, gridY);
            tTempArray.push(tTGridSprite);
            //tDrawMapLayer.addChild(tTGridSprite);
          }
          tGridSprite = tTGridSprite;
        } else {
          tGridSprite = tLayer.getDrawSprite(gridX, gridY);
          tTempArray.push(tGridSprite);
        }

        var tColorStr: string;
        if (this._showGridKey) {
          tColorStr = "#";
          tColorStr +=
            this._colorArray[
            Math.floor(Math.random() * this._colorArray.length)
            ];
          tColorStr +=
            this._colorArray[
            Math.floor(Math.random() * this._colorArray.length)
            ];
          tColorStr +=
            this._colorArray[
            Math.floor(Math.random() * this._colorArray.length)
            ];
        }
        switch (this.orientation) {
          case TiledMap.ORIENTATION_ISOMETRIC: //45度角
            var tHalfTileHeight: number = this.tileHeight / 2;
            var tHalfTileWidth: number = this.tileWidth / 2;
            var tHalfMapWidth: number = this._width / 2;
            tTop1 = Math.floor(tTop / tHalfTileHeight);
            tBottom1 = Math.floor(tBottom / tHalfTileHeight);
            tLeft1 =
              this._mapW + Math.floor((tLeft - tHalfMapWidth) / tHalfTileWidth);
            tRight1 =
              this._mapW +
              Math.floor((tRight - tHalfMapWidth) / tHalfTileWidth);

            var tMapW: number = this._mapW * 2;
            var tMapH: number = this._mapH * 2;

            if (tTop1 < 0) {
              tTop1 = 0;
            }
            if (tTop1 >= tMapH) {
              tTop1 = tMapH - 1;
            }
            if (tBottom1 < 0) {
              tBottom = 0;
            }
            if (tBottom1 >= tMapH) {
              tBottom1 = tMapH - 1;
            }
            tGridSprite.zOrder =
              this._totalGridNum * z + gridY * this._gridW + gridX;
            for (i = tTop1; i < tBottom1; i++) {
              for (j = 0; j <= i; j++) {
                var tIndexX: number = i - j;
                var tIndexY: number = j;
                var tIndexValue: number = tIndexX - tIndexY + this._mapW;
                if (tIndexValue > tLeft1 && tIndexValue <= tRight1) {
                  if (tLayer.drawTileTexture(tGridSprite, tIndexX, tIndexY)) {
                    tGridSprite.drawImageNum++;
                  }
                }
              }
            }
            break;
          case TiledMap.ORIENTATION_STAGGERED: //45度交错地图
            tGridSprite.zOrder =
              z * this._totalGridNum + gridY * this._gridW + gridX;
            for (i = tTop; i < tBottom; i++) {
              for (j = tLeft; j < tRight; j++) {
                if (tLayer.drawTileTexture(tGridSprite, j, i)) {
                  tGridSprite.drawImageNum++;
                }
              }
            }
            break;
          case TiledMap.ORIENTATION_ORTHOGONAL: //直角
          case TiledMap.ORIENTATION_HEXAGONAL: //六边形
            switch (this._renderOrder) {
              case TiledMap.RENDERORDER_RIGHTDOWN:
                tGridSprite.zOrder =
                  z * this._totalGridNum + gridY * this._gridW + gridX;
                for (i = tTop; i < tBottom; i++) {
                  for (j = tLeft; j < tRight; j++) {
                    if (tLayer.drawTileTexture(tGridSprite, j, i)) {
                      tGridSprite.drawImageNum++;
                    }
                  }
                }
                break;
              case TiledMap.RENDERORDER_RIGHTUP:
                tGridSprite.zOrder =
                  z * this._totalGridNum +
                  (this._gridH - 1 - gridY) * this._gridW +
                  gridX;
                for (i = tBottom - 1; i >= tTop; i--) {
                  for (j = tLeft; j < tRight; j++) {
                    if (tLayer.drawTileTexture(tGridSprite, j, i)) {
                      tGridSprite.drawImageNum++;
                    }
                  }
                }
                break;
              case TiledMap.RENDERORDER_LEFTDOWN:
                tGridSprite.zOrder =
                  z * this._totalGridNum +
                  gridY * this._gridW +
                  (this._gridW - 1 - gridX);
                for (i = tTop; i < tBottom; i++) {
                  for (j = tRight - 1; j >= tLeft; j--) {
                    if (tLayer.drawTileTexture(tGridSprite, j, i)) {
                      tGridSprite.drawImageNum++;
                    }
                  }
                }
                break;
              case TiledMap.RENDERORDER_LEFTUP:
                tGridSprite.zOrder =
                  z * this._totalGridNum +
                  (this._gridH - 1 - gridY) * this._gridW +
                  (this._gridW - 1 - gridX);
                for (i = tBottom - 1; i >= tTop; i--) {
                  for (j = tRight - 1; j >= tLeft; j--) {
                    if (tLayer.drawTileTexture(tGridSprite, j, i)) {
                      tGridSprite.drawImageNum++;
                    }
                  }
                }
                break;
            }
            break;
        }
        //没动画了GRID，保存为图片
        if (!tGridSprite.isHaveAnimation) {
          tGridSprite.autoSize = true;
          if (this.autoCache) tGridSprite.cacheAs = this.autoCacheType;
          tGridSprite.autoSize = false;
        }

        if (!this.enableMergeLayer) {
          if (tGridSprite.drawImageNum > 0) {
            tLayer.addChild(tGridSprite);
          }
          if (this._showGridKey) {
            tGridSprite.graphics.drawRect(
              0,
              0,
              tGridWidth,
              tGridHeight,
              null,
              tColorStr
            );
          }
        } else {
          if (tTGridSprite && tTGridSprite.drawImageNum > 0 && tDrawMapLayer) {
            tDrawMapLayer.addChild(tTGridSprite);
          }
        }
      }
      if (this.enableMergeLayer && this.showGridTextureCount) {
        if (tTGridSprite) {
          tTGridSprite.graphics.fillText(
            tTGridSprite.drawImageNum + "",
            20,
            20,
            null,
            "#ff0000",
            "left"
          );
        }
      }
    }
    return tTempArray;
  }

  /**
   * 隐藏指定的GRID
   * @param	gridX
   * @param	gridY
   */
  private hideGrid(gridX: number, gridY: number): void {
    if (
      gridX < 0 ||
      gridX >= this._gridW ||
      gridY < 0 ||
      gridY >= this._gridH
    ) {
      return;
    }
    var tTempArray: any[] = this._gridArray[gridY][gridX];
    if (tTempArray) {
      var tGridSprite: GridSprite;
      for (var i: number = 0; i < tTempArray.length; i++) {
        tGridSprite = tTempArray[i];
        if (tGridSprite.drawImageNum > 0) {
          if (tGridSprite != null) {
            tGridSprite.hide();
          }
        }
      }
    }
  }

  /**
   * 得到对象层上的某一个物品
   * @param	layerName   层的名称
   * @param	objectName	所找物品的名称
   * @return
   */
  getLayerObject(layerName: string, objectName: string): GridSprite {
    var tLayer: MapLayer = null;
    for (var i: number = 0; i < this._layerArray.length; i++) {
      tLayer = this._layerArray[i];
      if (tLayer.layerName == layerName) {
        break;
      }
    }
    if (tLayer) {
      return tLayer.getObjectByName(objectName);
    }
    return null;
  }

  /**
   * 销毁地图
   */
  destroy(): void {
    this._orientation = TiledMap.ORIENTATION_ORTHOGONAL;
    //json数据
    this._jsonData = null;
    var i: number = 0;
    // ??这里因为跟LAYER中的数据重复，所以不做处理
    this._gridArray = [];
    //清除子纹理
    // by yanmingjie 这里资源不让销毁，自己手动销毁
    // var tTileTexSet: TileTexSet;
    // for (i = 0; i < this._tileTexSetArr.length; i++) {
    //   tTileTexSet = this._tileTexSetArr[i];
    //   if (tTileTexSet) {
    //     tTileTexSet.clearAll();
    //   }
    // }
    this._tileTexSetArr = [];
    //清除主纹理
    var tTexture: Texture;
    for (i = 0; i < this._texArray.length; i++) {
      tTexture = this._texArray[i];
      tTexture.destroy();
    }
    this._texArray = [];

    //地图信息中的一些基本数据
    this._width = 0;
    this._height = 0;
    this._mapW = 0;
    this._mapH = 0;
    this._mapTileW = 0;
    this._mapTileH = 0;

    this._rect.setTo(0, 0, 0, 0);

    var tLayer: MapLayer;
    for (i = 0; i < this._layerArray.length; i++) {
      tLayer = this._layerArray[i];
      tLayer.clearAll();
    }

    this._layerArray = [];
    this._renderLayerArray = [];
    if (this._mapSprite) {
      this._mapSprite.destroy();
      this._mapSprite = null;
    }

    this._fog && this._fog.clearAll();

    this._jsonLoader = null; //??
    this._loader = null; //??
    //
    var tDic: any = this._animationDic;
    for (var p in tDic) {
      delete tDic[p];
    }

    this._properties = null;
    tDic = this._tileProperties;
    for (p in tDic) {
      delete tDic[p];
    }

    this._currTileSet = null;
    this._completeHandler = null;

    this._mapRect.clearAll();
    this._mapLastRect.clearAll();

    this._tileSetArray = [];

    this._gridWidth = 450;
    this._gridHeight = 450;

    this._gridW = 0;
    this._gridH = 0;

    this._x = 0;
    this._y = 0;

    this._index = 0;

    this._enableLinear = true;
    //资源的相对路径
    this._resPath = null;
    this._pathArray = null;
  }

  /****************************地图的基本数据***************************/ /**
   * 格子的宽度
   */
  get tileWidth(): number {
    return this._mapTileW;
  }

  /**
   * 格子的高度
   */
  get tileHeight(): number {
    return this._mapTileH;
  }

  /**
   * 地图的宽度
   */
  get width(): number {
    return this._width;
  }

  /**
   * 地图的高度
   */
  get height(): number {
    return this._height;
  }

  /**
   * 地图横向的格子数
   */
  get numColumnsTile(): number {
    return this._mapW;
  }

  /**
   * 地图竖向的格子数
   */
  get numRowsTile(): number {
    return this._mapH;
  }

  /**
   * @private
   * 视口x坐标
   */
  get viewPortX(): number {
    return -this._viewPortX;
  }

  /**
   * @private
   * 视口的y坐标
   */
  get viewPortY(): number {
    return -this._viewPortY;
  }

  /**
   * @private
   * 视口的宽度
   */
  get viewPortWidth(): number {
    return this._viewPortWidth;
  }

  /**
   * @private
   * 视口的高度
   */
  get viewPortHeight(): number {
    return this._viewPortHeight;
  }

  /**
   * 地图的x坐标
   */
  get x(): number {
    return this._x;
  }

  /**
   * 地图的y坐标
   */
  get y(): number {
    return this._y;
  }

  /**
   * 块的宽度
   */
  get gridWidth(): number {
    return this._gridWidth;
  }

  /**
   * 块的高度
   */
  get gridHeight(): number {
    return this._gridHeight;
  }

  /**
   * 地图的横向块数
   */
  get numColumnsGrid(): number {
    return this._gridW;
  }

  /**
   * 地图的坚向块数
   */
  get numRowsGrid(): number {
    return this._gridH;
  }

  /**
   * 当前地图类型
   */
  get orientation(): string {
    return this._orientation;
  }

  /**
   * tile渲染顺序
   */
  get renderOrder(): string {
    return this._renderOrder;
  }

  /*****************************************对外接口**********************************************/

  /**
   * 整个地图的显示容器
   * @return 地图的显示容器
   */
  mapSprite(): Sprite {
    return this._mapSprite;
  }

  /**
   * 得到指定的MapLayer
   * @param layerName 要找的层名称
   * @return
   */
  getLayerByName(layerName: string): MapLayer {
    var tMapLayer: MapLayer;
    for (var i: number = 0; i < this._layerArray.length; i++) {
      tMapLayer = this._layerArray[i];
      if (layerName == tMapLayer.layerName) {
        return tMapLayer;
      }
    }
    return null;
  }

  /**
   * 通过索引得MapLayer
   * @param	index 要找的层索引
   * @return
   */
  getLayerByIndex(index: number): MapLayer {
    if (index < this._layerArray.length) {
      return this._layerArray[index];
    }
    return null;
  }
}

/**@internal */
class GRect {
  left: number;
  top: number;
  right: number;
  bottom: number;

  clearAll(): void {
    this.left = this.top = this.right = this.bottom = 0;
  }
}

/**@internal */
class TileMapAniData {
  mAniIdArray: any[] = [];
  mDurationTimeArray: any[] = [];
  mTileTexSetArr: any[] = [];
  image: any;
}

/**@internal */
class TileSet {
  firstgid: number = 0;
  image: string = "";
  imageheight: number = 0;
  imagewidth: number = 0;
  margin: number = 0;
  name: string = "";
  properties: any;
  spacing: number = 0;
  tileheight: number = 0;
  tilewidth: number = 0;

  titleoffsetX: number = 0;
  titleoffsetY: number = 0;
  tileproperties: any;

  init(data: ItiledMapTileset): void {
    this.firstgid = data.firstgid;
    this.image = data.image;
    this.imageheight = data.imageheight;
    this.imagewidth = data.imagewidth;
    this.margin = data.margin;
    this.name = data.name;
    this.properties = data.properties;
    this.spacing = data.spacing;
    this.tileheight = data.tileheight;
    this.tilewidth = data.tilewidth;

    // 默认取就可以了
    const tiles = data.tiles[0];
    this.image = tiles.image;
  }
}

IMap.TiledMap = TiledMap;
