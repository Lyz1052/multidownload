(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _download = require('./download');

var _download2 = _interopRequireDefault(_download);

var _downloadStatus = require('./downloadStatus');

var _downloadStatus2 = _interopRequireDefault(_downloadStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const path = require('path')

//["page","selection","link","editable","image","video","audio"]
var elements = ["page", "link", "image", "video", "audio"].map(function (e) {
    return {
        name: e,
        menuId: "context_" + e
    };
});

/**
 * event page script
 * 1.add contextmenu on runtime installed
 * 2.add click listener on context menu
 */

//add contextmenu on installing extension
chrome.runtime.onInstalled.addListener(function () {
    // ["page","selection","link","editable","image","video","audio"]
    elements.forEach(function (e) {
        chrome.contextMenus.create({ "title": "Download resource " + e.name, "contexts": [e.name], "id": e.menuId });
    });
});

chrome.contextMenus.onClicked.addListener(onContextMenu);

function onContextMenu(info, tab) {
    var element = elements.find(function (e) {
        return e.menuId == info.menuItemId;
    });
    var url = info.srcUrl;
    if (element.name == 'page') {
        url = info.pageUrl;
    }

    if (element.name == 'link') {
        url = info.linkUrl;
    }

    $.jsonRPC.setup({
        endPoint: 'http://localhost:6800/jsonrpc',
        namespace: 'aria2'
    });
    debugger;
    var download = new _download2.default([url]);
    download.start().then(function (result) {

        download.status = new _downloadStatus2.default(result);
        console.log(JSON.stringify(download.status.getAll()));
    }, function (err) {
        console.log(err);
    });
}

},{"./download":2,"./downloadStatus":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _downloadStatus = require('./downloadStatus');

var _downloadStatus2 = _interopRequireDefault(_downloadStatus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Download = function () {
    function Download(urls) {
        _classCallCheck(this, Download);

        this.urls = urls;
    }

    _createClass(Download, [{
        key: 'start',
        value: function start() {
            var _this = this;

            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return new Promise(function (resolve, rejected) {
                $.jsonRPC.request('addUri', {
                    params: [_this.urls, options],
                    success: resolve,
                    error: rejected
                });
            });
        }
    }]);

    return Download;
}();

exports.default = Download;

},{"./downloadStatus":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DownloadStatus = function () {
    function DownloadStatus(startGid) {
        _classCallCheck(this, DownloadStatus);

        this.gid = startGid;
    }

    _createClass(DownloadStatus, [{
        key: 'jsonRPC',
        value: function jsonRPC(gid) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (gid) return new Promise(function (resolve, rejected) {
                $.jsonRPC.request('tellStatus', {
                    params: [gid, options],
                    success: resolve,
                    error: rejected
                });
            });else return new Promise(function (resolve) {
                return resolve();
            });
        }
    }, {
        key: 'getAll',
        value: function getAll() {
            var _this = this;

            var statusList = [];
            var followedBy = this.gid;
            var promise = this.jsonRPC(followedBy);

            while (followedBy) {
                debugger;
                promise = promise.then(function (result) {
                    statusList.push(result);
                    followedBy = result.followedBy;
                    return _this.jsonRPC(followId);
                });
            }

            return statusList;
        }
    }]);

    return DownloadStatus;
}();

exports.default = DownloadStatus;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxiYWNrZ3JvdW5kXFxiYWNrZ3JvdW5kLmpzIiwic3JjXFxqc1xcYmFja2dyb3VuZFxcZG93bmxvYWQuanMiLCJzcmNcXGpzXFxiYWNrZ3JvdW5kXFxkb3dubG9hZFN0YXR1cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7Ozs7O0FBRUE7O0FBRUE7QUFDQSxJQUFNLFdBQVcsQ0FBQyxNQUFELEVBQVEsTUFBUixFQUFlLE9BQWYsRUFBdUIsT0FBdkIsRUFBK0IsT0FBL0IsRUFBd0MsR0FBeEMsQ0FBNEMsVUFBQyxDQUFELEVBQUs7QUFDOUQsV0FBTztBQUNILGNBQUssQ0FERjtBQUVILGdCQUFPLGFBQVc7QUFGZixLQUFQO0FBSUgsQ0FMZ0IsQ0FBakI7O0FBT0E7Ozs7OztBQU1BO0FBQ0EsT0FBTyxPQUFQLENBQWUsV0FBZixDQUEyQixXQUEzQixDQUF1QyxZQUFVO0FBQzdDO0FBQ0EsYUFBUyxPQUFULENBQWlCLFVBQUMsQ0FBRCxFQUFLO0FBQ2xCLGVBQU8sWUFBUCxDQUFvQixNQUFwQixDQUEyQixFQUFDLFNBQVMsdUJBQXFCLEVBQUUsSUFBakMsRUFBdUMsWUFBVyxDQUFDLEVBQUUsSUFBSCxDQUFsRCxFQUEyRCxNQUFNLEVBQUUsTUFBbkUsRUFBM0I7QUFDSCxLQUZEO0FBR0gsQ0FMRDs7QUFPQyxPQUFPLFlBQVAsQ0FBb0IsU0FBcEIsQ0FBOEIsV0FBOUIsQ0FBMEMsYUFBMUM7O0FBRUEsU0FBUyxhQUFULENBQXVCLElBQXZCLEVBQTRCLEdBQTVCLEVBQWdDO0FBQzdCLFFBQUksVUFBVSxTQUFTLElBQVQsQ0FBYyxVQUFDLENBQUQ7QUFBQSxlQUFLLEVBQUUsTUFBRixJQUFVLEtBQUssVUFBcEI7QUFBQSxLQUFkLENBQWQ7QUFDQSxRQUFJLE1BQU0sS0FBSyxNQUFmO0FBQ0EsUUFBRyxRQUFRLElBQVIsSUFBYyxNQUFqQixFQUF3QjtBQUNwQixjQUFNLEtBQUssT0FBWDtBQUNIOztBQUVELFFBQUcsUUFBUSxJQUFSLElBQWMsTUFBakIsRUFBd0I7QUFDcEIsY0FBTSxLQUFLLE9BQVg7QUFDSDs7QUFFRCxNQUFFLE9BQUYsQ0FBVSxLQUFWLENBQWdCO0FBQ1osa0JBQVUsK0JBREU7QUFFWixtQkFBVztBQUZDLEtBQWhCO0FBSUE7QUFDQSxRQUFJLFdBQVcsdUJBQWEsQ0FBQyxHQUFELENBQWIsQ0FBZjtBQUNBLGFBQVMsS0FBVCxHQUFpQixJQUFqQixDQUFzQixVQUFDLE1BQUQsRUFBVTs7QUFFNUIsaUJBQVMsTUFBVCxHQUFrQiw2QkFBbUIsTUFBbkIsQ0FBbEI7QUFDQSxnQkFBUSxHQUFSLENBQVksS0FBSyxTQUFMLENBQWUsU0FBUyxNQUFULENBQWdCLE1BQWhCLEVBQWYsQ0FBWjtBQUNILEtBSkQsRUFJRSxVQUFDLEdBQUQsRUFBTztBQUNMLGdCQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0gsS0FORDtBQU9GOzs7Ozs7Ozs7OztBQ3JERjs7Ozs7Ozs7SUFFTSxRO0FBQ0Ysc0JBQVksSUFBWixFQUFpQjtBQUFBOztBQUNiLGFBQUssSUFBTCxHQUFZLElBQVo7QUFDSDs7OztnQ0FFa0I7QUFBQTs7QUFBQSxnQkFBYixPQUFhLHVFQUFILEVBQUc7O0FBQ2YsbUJBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVMsUUFBVCxFQUFvQjtBQUNuQyxrQkFBRSxPQUFGLENBQVUsT0FBVixDQUFrQixRQUFsQixFQUE0QjtBQUN4Qiw0QkFBUSxDQUFDLE1BQUssSUFBTixFQUFXLE9BQVgsQ0FEZ0I7QUFFeEIsNkJBQVMsT0FGZTtBQUd4QiwyQkFBTztBQUhpQixpQkFBNUI7QUFLSCxhQU5NLENBQVA7QUFPSDs7Ozs7O2tCQUdVLFE7Ozs7Ozs7Ozs7Ozs7SUNsQlQsYztBQUNGLDRCQUFZLFFBQVosRUFBcUI7QUFBQTs7QUFDakIsYUFBSyxHQUFMLEdBQVcsUUFBWDtBQUNIOzs7O2dDQUVPLEcsRUFBaUI7QUFBQSxnQkFBYixPQUFhLHVFQUFILEVBQUc7O0FBQ3JCLGdCQUFHLEdBQUgsRUFDSSxPQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFTLFFBQVQsRUFBb0I7QUFDbkMsa0JBQUUsT0FBRixDQUFVLE9BQVYsQ0FBa0IsWUFBbEIsRUFBZ0M7QUFDNUIsNEJBQVEsQ0FBQyxHQUFELEVBQUssT0FBTCxDQURvQjtBQUU1Qiw2QkFBUyxPQUZtQjtBQUc1QiwyQkFBTztBQUhxQixpQkFBaEM7QUFLSCxhQU5NLENBQVAsQ0FESixLQVNJLE9BQU8sSUFBSSxPQUFKLENBQVk7QUFBQSx1QkFBVyxTQUFYO0FBQUEsYUFBWixDQUFQO0FBQ1A7OztpQ0FFTztBQUFBOztBQUNKLGdCQUFJLGFBQWEsRUFBakI7QUFDQSxnQkFBSSxhQUFhLEtBQUssR0FBdEI7QUFDQSxnQkFBSSxVQUFVLEtBQUssT0FBTCxDQUFhLFVBQWIsQ0FBZDs7QUFFQSxtQkFBTSxVQUFOLEVBQWlCO0FBQUM7QUFDZCwwQkFBVSxRQUFRLElBQVIsQ0FBYSxVQUFDLE1BQUQsRUFBVTtBQUM3QiwrQkFBVyxJQUFYLENBQWdCLE1BQWhCO0FBQ0EsaUNBQWEsT0FBTyxVQUFwQjtBQUNBLDJCQUFPLE1BQUssT0FBTCxDQUFhLFFBQWIsQ0FBUDtBQUNILGlCQUpTLENBQVY7QUFLSDs7QUFHRCxtQkFBTyxVQUFQO0FBQ0g7Ozs7OztrQkFHVSxjIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBEb3dubG9hZCBmcm9tICcuL2Rvd25sb2FkJ1xyXG5pbXBvcnQgRG93bmxvYWRTdGF0dXMgZnJvbSAnLi9kb3dubG9hZFN0YXR1cydcclxuXHJcbi8vIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcclxuXHJcbi8vW1wicGFnZVwiLFwic2VsZWN0aW9uXCIsXCJsaW5rXCIsXCJlZGl0YWJsZVwiLFwiaW1hZ2VcIixcInZpZGVvXCIsXCJhdWRpb1wiXVxyXG5jb25zdCBlbGVtZW50cyA9IFtcInBhZ2VcIixcImxpbmtcIixcImltYWdlXCIsXCJ2aWRlb1wiLFwiYXVkaW9cIl0ubWFwKChlKT0+e1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuYW1lOmUsXHJcbiAgICAgICAgbWVudUlkOlwiY29udGV4dF9cIitlXHJcbiAgICB9XHJcbn0pXHJcblxyXG4vKipcclxuICogZXZlbnQgcGFnZSBzY3JpcHRcclxuICogMS5hZGQgY29udGV4dG1lbnUgb24gcnVudGltZSBpbnN0YWxsZWRcclxuICogMi5hZGQgY2xpY2sgbGlzdGVuZXIgb24gY29udGV4dCBtZW51XHJcbiAqL1xyXG5cclxuLy9hZGQgY29udGV4dG1lbnUgb24gaW5zdGFsbGluZyBleHRlbnNpb25cclxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24oKXtcclxuICAgIC8vIFtcInBhZ2VcIixcInNlbGVjdGlvblwiLFwibGlua1wiLFwiZWRpdGFibGVcIixcImltYWdlXCIsXCJ2aWRlb1wiLFwiYXVkaW9cIl1cclxuICAgIGVsZW1lbnRzLmZvckVhY2goKGUpPT57XHJcbiAgICAgICAgY2hyb21lLmNvbnRleHRNZW51cy5jcmVhdGUoe1widGl0bGVcIjogXCJEb3dubG9hZCByZXNvdXJjZSBcIitlLm5hbWUsIFwiY29udGV4dHNcIjpbZS5uYW1lXSxcImlkXCI6IGUubWVudUlkfSlcclxuICAgIH0pXHJcbn0pXHJcbiBcclxuIGNocm9tZS5jb250ZXh0TWVudXMub25DbGlja2VkLmFkZExpc3RlbmVyKG9uQ29udGV4dE1lbnUpXHJcblxyXG4gZnVuY3Rpb24gb25Db250ZXh0TWVudShpbmZvLHRhYil7XHJcbiAgICBsZXQgZWxlbWVudCA9IGVsZW1lbnRzLmZpbmQoKGUpPT5lLm1lbnVJZD09aW5mby5tZW51SXRlbUlkKVxyXG4gICAgbGV0IHVybCA9IGluZm8uc3JjVXJsXHJcbiAgICBpZihlbGVtZW50Lm5hbWU9PSdwYWdlJyl7XHJcbiAgICAgICAgdXJsID0gaW5mby5wYWdlVXJsXHJcbiAgICB9XHJcblxyXG4gICAgaWYoZWxlbWVudC5uYW1lPT0nbGluaycpe1xyXG4gICAgICAgIHVybCA9IGluZm8ubGlua1VybFxyXG4gICAgfVxyXG5cclxuICAgICQuanNvblJQQy5zZXR1cCh7XHJcbiAgICAgICAgZW5kUG9pbnQ6ICdodHRwOi8vbG9jYWxob3N0OjY4MDAvanNvbnJwYycsXHJcbiAgICAgICAgbmFtZXNwYWNlOiAnYXJpYTInXHJcbiAgICB9KTtcclxuICAgIGRlYnVnZ2VyXHJcbiAgICBsZXQgZG93bmxvYWQgPSBuZXcgRG93bmxvYWQoW3VybF0pXHJcbiAgICBkb3dubG9hZC5zdGFydCgpLnRoZW4oKHJlc3VsdCk9PntcclxuICAgICAgICBcclxuICAgICAgICBkb3dubG9hZC5zdGF0dXMgPSBuZXcgRG93bmxvYWRTdGF0dXMocmVzdWx0KVxyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGRvd25sb2FkLnN0YXR1cy5nZXRBbGwoKSkpXHJcbiAgICB9LChlcnIpPT57XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgfSlcclxuIH1cclxuXHJcbiIsImltcG9ydCBEb3dubG9hZFN0YXR1cyBmcm9tICcuL2Rvd25sb2FkU3RhdHVzJ1xyXG5cclxuY2xhc3MgRG93bmxvYWR7XHJcbiAgICBjb25zdHJ1Y3Rvcih1cmxzKXtcclxuICAgICAgICB0aGlzLnVybHMgPSB1cmxzXHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQob3B0aW9ucyA9IHt9KXtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0ZWQpPT57XHJcbiAgICAgICAgICAgICQuanNvblJQQy5yZXF1ZXN0KCdhZGRVcmknLCB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IFt0aGlzLnVybHMsb3B0aW9uc10sXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXNvbHZlLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IHJlamVjdGVkLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEb3dubG9hZCIsImNsYXNzIERvd25sb2FkU3RhdHVze1xyXG4gICAgY29uc3RydWN0b3Ioc3RhcnRHaWQpe1xyXG4gICAgICAgIHRoaXMuZ2lkID0gc3RhcnRHaWRcclxuICAgIH1cclxuXHJcbiAgICBqc29uUlBDKGdpZCxvcHRpb25zID0ge30pe1xyXG4gICAgICAgIGlmKGdpZClcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdGVkKT0+e1xyXG4gICAgICAgICAgICAgICAgJC5qc29uUlBDLnJlcXVlc3QoJ3RlbGxTdGF0dXMnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBbZ2lkLG9wdGlvbnNdLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlc29sdmUsXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHJlamVjdGVkXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZSgpKVxyXG4gICAgfVxyXG5cclxuICAgIGdldEFsbCgpe1xyXG4gICAgICAgIGxldCBzdGF0dXNMaXN0ID0gW11cclxuICAgICAgICBsZXQgZm9sbG93ZWRCeSA9IHRoaXMuZ2lkO1xyXG4gICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5qc29uUlBDKGZvbGxvd2VkQnkpXHJcblxyXG4gICAgICAgIHdoaWxlKGZvbGxvd2VkQnkpe2RlYnVnZ2VyXHJcbiAgICAgICAgICAgIHByb21pc2UgPSBwcm9taXNlLnRoZW4oKHJlc3VsdCk9PntcclxuICAgICAgICAgICAgICAgIHN0YXR1c0xpc3QucHVzaChyZXN1bHQpXHJcbiAgICAgICAgICAgICAgICBmb2xsb3dlZEJ5ID0gcmVzdWx0LmZvbGxvd2VkQnlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmpzb25SUEMoZm9sbG93SWQpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YXR1c0xpc3RcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRG93bmxvYWRTdGF0dXMiXX0=
