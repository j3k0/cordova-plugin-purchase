#!/usr/bin/env node

/**********
 * Globals
 **********/

const PLUGIN_NAME = "Purchase plugin";
const PLUGIN_ID = "cordova-plugin-purchase";

const MODULE_NAME = "LOCAL_RECEIPT_VALIDATION";

const COMMENT_START = "<!--";
const COMMENT_END = "-->";

// Node dependencies
let path, cwd, fs;

// External dependencies
let parser;

// Global vars
let projectPath, modulesPath, pluginNodePath,
    projectPackageJsonPath, projectPackageJsonData,
    configXmlPath, configXmlData,
    pluginXmlPath, pluginXmlText, pluginXmlData;


/*********************
 * Internal functions
 *********************/

const run = function (){
    if(shouldModuleBeEnabled()){
        enableModule();
    }else{
        disableModule();
    }
    writePluginXmlText();
};


const handleError = function (errorMsg, errorObj) {
    errorMsg = PLUGIN_NAME + " - ERROR: " + errorMsg;
    console.error(errorMsg);
    console.dir(errorObj);
    return errorMsg;
    throw errorObj;
};

const shouldModuleBeEnabled = function(){
    const pluginVariables = parsePluginVariables();
    return resolveBoolean(pluginVariables[MODULE_NAME]);
};

const resolveBoolean = function(value){
    if(typeof value === 'undefined' || value === null) return false;
    if(value === true || value === false) return value;
    return !isNaN(value) ? parseFloat(value) : /^\s*(true|false)\s*$/i.exec(value) ? RegExp.$1.toLowerCase() === "true" : value;
};

const enableModule = function(){
    console.log(`Enabling ${MODULE_NAME} module in  ${PLUGIN_ID}`);
    const commentedStartRegExp = new RegExp(getModuleStart(MODULE_NAME)+COMMENT_START, "g");
    const commentedEndRegExp = new RegExp(COMMENT_END+getModuleEnd(MODULE_NAME), "g");
    if(pluginXmlText.match(commentedStartRegExp)){
        pluginXmlText = pluginXmlText.replace(commentedStartRegExp, getModuleStart(MODULE_NAME));
        pluginXmlText = pluginXmlText.replace(commentedEndRegExp, getModuleEnd(MODULE_NAME));
    }

    const commentedStubStart = getModuleStubStart(MODULE_NAME)+COMMENT_START;
    const commentedStubEnd = COMMENT_END+getModuleStubEnd(MODULE_NAME);
    if(!pluginXmlText.match(commentedStubStart)){
        pluginXmlText = pluginXmlText.replace(new RegExp(getModuleStubStart(MODULE_NAME), "g"), commentedStubStart);
        pluginXmlText = pluginXmlText.replace(new RegExp(getModuleStubEnd(MODULE_NAME), "g"), commentedStubEnd);
    }
};

const disableModule = function(MODULE_NAME){
    console.log(`Disabling ${MODULE_NAME} module in  ${PLUGIN_ID}`);
    const commentedStart = getModuleStart(MODULE_NAME)+COMMENT_START;
    const commentedEnd = COMMENT_END+getModuleEnd(MODULE_NAME);
    if(!pluginXmlText.match(commentedStart)){
        pluginXmlText = pluginXmlText.replace(new RegExp(getModuleStart(MODULE_NAME), "g"), commentedStart);
        pluginXmlText = pluginXmlText.replace(new RegExp(getModuleEnd(MODULE_NAME), "g"), commentedEnd);
    }

    const commentedStubStartRegExp = new RegExp(getModuleStubStart(MODULE_NAME)+COMMENT_START, "g");
    const commentedStubEndRegExp = new RegExp(COMMENT_END+getModuleStubEnd(MODULE_NAME), "g");
    if(pluginXmlText.match(commentedStubStartRegExp)){
        pluginXmlText = pluginXmlText.replace(commentedStubStartRegExp, getModuleStubStart(MODULE_NAME));
        pluginXmlText = pluginXmlText.replace(commentedStubEndRegExp, getModuleStubEnd(MODULE_NAME));
    }
};

const getModuleStart = function(){
    return "<!--BEGIN_MODULE "+MODULE_NAME+"-->";
};

const getModuleEnd = function(){
    return "<!--END_MODULE "+MODULE_NAME+"-->";
};

const getModuleStubStart = function(){
    return "<!--BEGIN_MODULE_STUB "+MODULE_NAME+"-->";
};

const getModuleStubEnd = function(){
    return "<!--END_MODULE_STUB "+MODULE_NAME+"-->";
};

const parsePluginVariables = function(){

    const pluginVariables = {};
    // Parse plugin.xml
    const plugin = parsePluginXml();
    let prefs = [];
    if(plugin.plugin.preference){
        prefs = prefs.concat(plugin.plugin.preference);
    }
    if(typeof plugin.plugin.platform.length === 'undefined') plugin.plugin.platform = [plugin.plugin.platform];
    plugin.plugin.platform.forEach(function(platform){
        if(platform.preference){
            prefs = prefs.concat(platform.preference);
        }
    });
    prefs.forEach(function(pref){
        if (pref._attributes){
            pluginVariables[pref._attributes.name] = pref._attributes.default;
        }
    });

    // Parse config.xml
    const config = parseConfigXml();
    if(config) {
        (config.widget.plugin ? [].concat(config.widget.plugin) : []).forEach(function (plugin) {
            (plugin.variable ? [].concat(plugin.variable) : []).forEach(function (variable) {
                if ((plugin._attributes.name === PLUGIN_ID || plugin._attributes.id === PLUGIN_ID) && variable._attributes.name && variable._attributes.value) {
                    pluginVariables[variable._attributes.name] = variable._attributes.value;
                }
            });
        });
    }

    // Parse package.json
    const packageJSON = parsePackageJson();
    if(packageJSON && packageJSON.cordova && packageJSON.cordova.plugins){
        for(const pluginId in packageJSON.cordova.plugins){
            if(pluginId === PLUGIN_ID){
                for(const varName in packageJSON.cordova.plugins[pluginId]){
                    const varValue = packageJSON.cordova.plugins[pluginId][varName];
                    pluginVariables[varName] = varValue;
                }
            }
        }
    }

    return pluginVariables;
};

const parsePackageJson = function(){
    if(projectPackageJsonData) return projectPackageJsonData;
    try{
        projectPackageJsonData =  JSON.parse(fs.readFileSync(projectPackageJsonPath));
        return projectPackageJsonData;
    }catch(e){
        console.warn("Failed to parse package.json: " + e.message);
    }
};

const parseConfigXml = function(){
    if(configXmlData) return configXmlData;
    try{
        data = parseXmlFileToJson(configXmlPath);
        configXmlData = data.xml;
        return configXmlData;
    }catch (e){
        console.warn("Failed to parse config.xml: " + e.message);
    }
};

const parsePluginXml = function(){
    if(pluginXmlData) return pluginXmlData;
    const data = parseXmlFileToJson(pluginXmlPath);
    pluginXmlText = data.text;
    pluginXmlData = data.xml;
    return pluginXmlData;
};

const parseXmlFileToJson = function(filepath, parseOpts){
    parseOpts = parseOpts || {compact: true};
    const text = fs.readFileSync(path.resolve(filepath), 'utf-8');
    const xml = JSON.parse(parser.xml2json(text, parseOpts));
    return {text, xml};
};

const writePluginXmlText = function(){
    fs.writeFileSync(pluginXmlPath, pluginXmlText, 'utf-8');
};

/**********
 * Main
 **********/
const main = function() {
    try{
        fs = require('fs');
        path = require('path');

        cwd = path.resolve();
        pluginNodePath = cwd;

        modulesPath = path.resolve(pluginNodePath, "..");
        projectPath = path.resolve(modulesPath, "..");

        try{
            parser = require("xml-js");
        }catch (e){
            console.warn("Failed to load 'xml-js' module. Trying using modulesPath: "+modulesPath);
        }
        if(!parser){
            try{
                parser = require(path.resolve(modulesPath, "xml-js"));
            }catch (e){
                console.warn("Failed to load 'xml-js' module using modulesPath");
            }
        }
        if(!parser){
            throw new Error("Failed to load 'xml-js' module");
        }
    }catch(e){
        handleError("Failed to load dependencies for "+PLUGIN_ID+"': " + e.message, e);
    }

    try{
        projectPackageJsonPath = path.join(projectPath, 'package.json');
        configXmlPath = path.join(projectPath, 'config.xml');
        pluginXmlPath = path.join(pluginNodePath, "plugin.xml");
        run();
    }catch(e){
        handleError(e.message, e);
    }
};
main();
