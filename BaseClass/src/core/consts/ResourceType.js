/*
* name;
*/
var ResourceType = (function () {

    ResourceType["PNG"] = "png";
    ResourceType["SK"] = "sk";
    ResourceType["JSON"] = "json";
    ResourceType["FNT"] = "fnt";
    ResourceType["JPG"] = "jpg";
    ResourceType["TXT"] = "txt";
    ResourceType["MP4"] = "mp4";

    function ResourceType() {}
    Laya.class(ResourceType, "ResourceType");

    return ResourceType;
}());