/*
* name;
*/
var ResourceType = (function () {

    ResourceType["SK"] = "sk";
    ResourceType["PNG"] = "png";
    ResourceType["FNT"] = "fnt";
    ResourceType["JPG"] = "jpg";
    ResourceType["TXT"] = "txt";
    ResourceType["MP4"] = "mp4";
    ResourceType["JSON"] = "json";

    function ResourceType() {}
    Laya.class(ResourceType, "ResourceType");

    return ResourceType;
}());