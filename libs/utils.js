var fs = require('fs'),
    exeq = require('exeq'),
    paramrule = require('paramrule'),
    open = process.platform === 'win32' ? 'start' : 'open';

// 获取用户的家地址
exports.home = function() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// 跳转到相应页面，使用 open 或者 start
exports.go = function(link) {
    if (!link) return false;
    return exeq([open + ' ' + link]).run();
}

// 解析歌曲专辑页面可能出现的小站链接
exports.album = function(link) {
    if (!link) return false;
    return link.indexOf('http') === -1 ? 'http://music.douban.com' + link : link;
}

// 解析本地文件的sid
exports.sid = function(filename) {
    if (!filename) return false;
    var idstr = filename.substr(filename.indexOf('p') + 1, filename.lastIndexOf('.') - 1);
    if (idstr.indexOf('_') === -1) return idstr;
    return idstr.substr(0, idstr.lastIndexOf('_'))
}

// 同步读
exports.jsonSync = function(file) {
    try {
        var data = fs.readFileSync(file);
        return JSON.parse(data.toString());
    } catch (err) {
        return {};
    }
}

// 读写json
exports.json = function(file, callback, contents) {
    if (!contents) {
        return fs.readFile(file, function(err, data) {
            if (err) return callback(err, null);
            try {
                callback(err, JSON.parse(data));
            } catch (err) {
                callback(err);
            }
        });
    } else {
        return fs.writeFile(file, JSON.stringify(contents), function(err) {
            callback(err, contents);
        });
    }
}

// 读写 json 的快捷方法
exports.log = function(file, argvs) {
    return paramrule.parse(argvs, ['', '*'], function(params, callback) {
        if (params) return exports.json(file, callback, params);
        return exports.json(file, callback);
    });
}
