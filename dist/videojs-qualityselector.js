(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsQualityselector = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

var QualitySelector = (function () {
  function QualitySelector(player) {
    _classCallCheck(this, QualitySelector);

    this.player = player;
    this.sources = [];
    this.callback = undefined;
    this.defaultFormat = undefined;
    this.containerDropdownElement = undefined;
    this.defaults = {};
  }

  /**
   * A video.js plugin.
   *
   * In the plugin function, the value of `this` is a video.js `Player`
   * instance. You cannot rely on the player being in a 'ready' state here,
   * depending on how the plugin is invoked. This may or may not be important
   * to you; if not, remove the wait for 'ready'!
   *
   * @function qualityselector
   * @param    {Object} [options={}]
   *           An object of options left to the plugin author to define.
   */

  /**
   * event on selected the quality
   */

  _createClass(QualitySelector, [{
    key: 'onQualitySelect',
    value: function onQualitySelect(quality) {
      var _this = this;

      if (this.callback) {
        this.callback(quality);
      }

      var source = this.setPlayerSource(quality.code);

      if (source) {
        this.player.on('loadedmetadata', function () {
          _this.player.play();

          Array.from(_this.containerDropdownElement.firstChild.childNodes).forEach(function (ele) {
            if (ele.dataset.code === quality.code) {
              ele.setAttribute('class', 'current');
            } else {
              ele.removeAttribute('class');
            }
          });
        });
        this.changeQualitySelectorLabel(quality.name);
      }

      this.onToggleDropdown();
    }

    /**
     * Set the main video source of the player with the given format code
     * @param {string} formatCode
     * @returns {Object} the source if the player has been updated
     */
  }, {
    key: 'setPlayerSource',
    value: function setPlayerSource(formatCode) {
      if (this.sources) {
        // tries to find the source with this quality
        var source = this.sources.find(function (ss) {
          return ss.format === formatCode;
        });

        if (source) {
          this.player.src({ src: source.src, type: source.type });
          return source;
        }
      }
      return;
    }

    /**
     * Change the displayed quality label in the controlbar
     * @param {string} label
     */
  }, {
    key: 'changeQualitySelectorLabel',
    value: function changeQualitySelectorLabel(label) {
      var player = document.getElementById(this.player.id_);
      var qualitySelector = player.getElementsByClassName('vjs-brand-quality-link');

      if (qualitySelector && qualitySelector.length > 0) {
        qualitySelector[0].innerText = label;
      }
    }

    /**
     * show or hide the dropdown
     */
  }, {
    key: 'onToggleDropdown',
    value: function onToggleDropdown() {
      if (this.containerDropdownElement.className.indexOf('show') === -1) {
        this.containerDropdownElement.className += ' show';
      } else {
        var className = this.containerDropdownElement.className.replace(' show', '');

        this.containerDropdownElement.className = className;
      }
    }

    /**
     * Function to invoke when the player is ready.
     *
     * This is a great place for your plugin to initialize itself. When this
     * function is called, the player will have its DOM and child components
     * in place.
     *
     * @function onPlayerReady
     * @param    {Player} player
     * @param    {Object} [options={}]
     */
  }, {
    key: 'onPlayerReady',
    value: function onPlayerReady(options) {
      var _this2 = this;

      this.containerDropdownElement = document.createElement('div');
      this.containerDropdownElement.className = 'vjs-quality-dropdown';

      var containerElement = document.createElement('div');

      containerElement.className = 'vjs-quality-container';
      containerElement.id = 'vjsQualitySelector';

      var buttonElement = document.createElement('button');

      buttonElement.className = 'vjs-brand-quality-link';
      buttonElement.onclick = function (event) {
        return _this2.onToggleDropdown(event);
      };
      buttonElement.innerText = 'Quality';

      var ulElement = document.createElement('ul');

      if (!options.formats) {
        options.formats = [{ code: 'auto', name: 'Auto' }];
      }

      if (options.onFormatSelected) {
        this.callback = options.onFormatSelected;
      }

      if (options.sources) {
        this.sources = options.sources;
      }

      if (options.defaultFormat) {
        this.defaultFormat = options.defaultFormat;
      }

      options.formats.map(function (format) {
        var liElement = document.createElement('li');

        liElement.dataset.code = format.code;
        if (format.code === _this2.defaultFormat) {
          liElement.setAttribute('class', 'current');
          buttonElement.innerText = format.name;
        }

        var linkElement = document.createElement('a');

        linkElement.innerText = format.name;
        linkElement.setAttribute('href', '#');
        linkElement.addEventListener('click', function (event) {
          event.preventDefault();
          _this2.onQualitySelect(format);
        });

        liElement.appendChild(linkElement);
        ulElement.appendChild(liElement);
      });

      this.containerDropdownElement.appendChild(ulElement);
      containerElement.appendChild(this.containerDropdownElement);
      containerElement.appendChild(buttonElement);

      var fullScreenToggle = this.player.controlBar.fullscreenToggle.el();

      this.player.controlBar.el().insertBefore(containerElement, fullScreenToggle);

      this.player.addClass('vjs-qualityselector');

      if (this.defaultFormat) {
        this.setPlayerSource(this.defaultFormat);
      }
    }

    /**
     * Function to delete previous instance to avoid duplicate menu on the control bar
     */
  }, {
    key: 'deleteExistingInstance',
    value: function deleteExistingInstance() {
      if (this.player.hasClass('vjs-qualityselector')) {
        var element = document.getElementById('vjsQualitySelector');
        element.parentNode.removeChild(element);
      }
    }
  }]);

  return QualitySelector;
})();

var qualityselector = function qualityselector(options) {
  var _this3 = this;

  this.ready(function () {
    var qualityControl = new QualitySelector(_this3);
    qualityControl.deleteExistingInstance();
    qualityControl.onPlayerReady(_videoJs2['default'].mergeOptions(qualityControl.defaults, options));
  });
};

// Register the plugin with video.js.
var registerPlugin = _videoJs2['default'].registerPlugin || _videoJs2['default'].plugin;

registerPlugin('qualityselector', qualityselector);

// Include the version number.
qualityselector.VERSION = '0.0.6';

exports['default'] = qualityselector;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJ1bm8vZ2l0L3ZpZGVvanMtcXVhbGl0eXNlbGVjdG9yL3NyYy9wbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7O3VCQ0FvQixVQUFVOzs7O0lBRXhCLGVBQWU7QUFDUixXQURQLGVBQWUsQ0FDUCxNQUFNLEVBQUU7MEJBRGhCLGVBQWU7O0FBRWpCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBQzFCLFFBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBQy9CLFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxTQUFTLENBQUM7QUFDMUMsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7R0FDcEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFSRyxlQUFlOztXQWFKLHlCQUFDLE9BQU8sRUFBRTs7O0FBQ3ZCLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ3hCOztBQUVELFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVoRCxVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFlBQU07QUFDckMsZ0JBQUssTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVuQixlQUFLLENBQUMsSUFBSSxDQUFDLE1BQUssd0JBQXdCLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUM3RSxnQkFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxP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QUFNO0FBQ2YsUUFBSSxjQUFjLEdBQUcsSUFBSSxlQUFlLFFBQU0sQ0FBQztBQUMvQyxrQkFBYyxDQUFDLHNCQUFzQixFQUFFLENBQUM7QUFDeEMsa0JBQWMsQ0FBQyxhQUFhLENBQUMscUJBQVEsWUFBWSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztHQUN0RixDQUFDLENBQUM7Q0FDSixDQUFDOzs7QUFHRixJQUFNLGNBQWMsR0FBRyxxQkFBUSxjQUFjLElBQUkscUJBQVEsTUFBTSxDQUFDOztBQUVoRSxjQUFjLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLENBQUM7OztBQUduRCxlQUFlLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQzs7cUJBRXpCLGVBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgdmlkZW9qcyBmcm9tICd2aWRlby5qcyc7XG5cbmNsYXNzIFF1YWxpdHlTZWxlY3RvciB7XG4gIGNvbnN0cnVjdG9yKHBsYXllcikge1xuICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgIHRoaXMuc291cmNlcyA9IFtdO1xuICAgIHRoaXMuY2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5kZWZhdWx0Rm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY29udGFpbmVyRHJvcGRvd25FbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7fTtcbiAgfVxuXG5cdC8qKlxuXHQgKiBldmVudCBvbiBzZWxlY3RlZCB0aGUgcXVhbGl0eVxuXHQgKi9cbiAgb25RdWFsaXR5U2VsZWN0KHF1YWxpdHkpIHtcbiAgICBpZiAodGhpcy5jYWxsYmFjaykge1xuICAgICAgdGhpcy5jYWxsYmFjayhxdWFsaXR5KTtcbiAgICB9XG5cbiAgICBsZXQgc291cmNlID0gdGhpcy5zZXRQbGF5ZXJTb3VyY2UocXVhbGl0eS5jb2RlKTtcblxuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIHRoaXMucGxheWVyLm9uKCdsb2FkZWRtZXRhZGF0YScsICgpID0+IHtcbiAgICAgICAgdGhpcy5wbGF5ZXIucGxheSgpO1xuXG4gICAgICAgIEFycmF5LmZyb20odGhpcy5jb250YWluZXJEcm9wZG93bkVsZW1lbnQuZmlyc3RDaGlsZC5jaGlsZE5vZGVzKS5mb3JFYWNoKGVsZSA9PiB7XG4gICAgICAgICAgaWYgKGVsZS5kYXRhc2V0LmNvZGUgPT09IHF1YWxpdHkuY29kZSkge1xuICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY3VycmVudCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGUucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuY2hhbmdlUXVhbGl0eVNlbGVjdG9yTGFiZWwocXVhbGl0eS5uYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uVG9nZ2xlRHJvcGRvd24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIG1haW4gdmlkZW8gc291cmNlIG9mIHRoZSBwbGF5ZXIgd2l0aCB0aGUgZ2l2ZW4gZm9ybWF0IGNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdENvZGVcbiAgICogQHJldHVybnMge09iamVjdH0gdGhlIHNvdXJjZSBpZiB0aGUgcGxheWVyIGhhcyBiZWVuIHVwZGF0ZWRcbiAgICovXG4gIHNldFBsYXllclNvdXJjZShmb3JtYXRDb2RlKSB7XG4gICAgaWYgKHRoaXMuc291cmNlcykge1xuICAgICAgLy8gdHJpZXMgdG8gZmluZCB0aGUgc291cmNlIHdpdGggdGhpcyBxdWFsaXR5XG4gICAgICBsZXQgc291cmNlID0gdGhpcy5zb3VyY2VzLmZpbmQoc3MgPT4gc3MuZm9ybWF0ID09PSBmb3JtYXRDb2RlKTtcblxuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICB0aGlzLnBsYXllci5zcmMoeyBzcmM6IHNvdXJjZS5zcmMsIHR5cGU6IHNvdXJjZS50eXBlIH0pO1xuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIHRoZSBkaXNwbGF5ZWQgcXVhbGl0eSBsYWJlbCBpbiB0aGUgY29udHJvbGJhclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFiZWxcbiAgICovXG4gIGNoYW5nZVF1YWxpdHlTZWxlY3RvckxhYmVsKGxhYmVsKSB7XG4gICAgY29uc3QgcGxheWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5wbGF5ZXIuaWRfKTtcbiAgICBjb25zdCBxdWFsaXR5U2VsZWN0b3IgPSBwbGF5ZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndmpzLWJyYW5kLXF1YWxpdHktbGluaycpO1xuXG4gICAgaWYgKHF1YWxpdHlTZWxlY3RvciAmJiBxdWFsaXR5U2VsZWN0b3IubGVuZ3RoID4gMCkge1xuICAgICAgcXVhbGl0eVNlbGVjdG9yWzBdLmlubmVyVGV4dCA9IGxhYmVsO1xuICAgIH1cbiAgfVxuXG5cdC8qKlxuXHQgKiBzaG93IG9yIGhpZGUgdGhlIGRyb3Bkb3duXG5cdCAqL1xuICBvblRvZ2dsZURyb3Bkb3duKCkge1xuICAgIGlmICh0aGlzLmNvbnRhaW5lckRyb3Bkb3duRWxlbWVudC5jbGFzc05hbWUuaW5kZXhPZignc2hvdycpID09PSAtMSkge1xuICAgICAgdGhpcy5jb250YWluZXJEcm9wZG93bkVsZW1lbnQuY2xhc3NOYW1lICs9ICcgc2hvdyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHRoaXMuY29udGFpbmVyRHJvcGRvd25FbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKCcgc2hvdycsICcnKTtcblxuICAgICAgdGhpcy5jb250YWluZXJEcm9wZG93bkVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG5cdC8qKlxuXHQgKiBGdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgcGxheWVyIGlzIHJlYWR5LlxuXHQgKlxuXHQgKiBUaGlzIGlzIGEgZ3JlYXQgcGxhY2UgZm9yIHlvdXIgcGx1Z2luIHRvIGluaXRpYWxpemUgaXRzZWxmLiBXaGVuIHRoaXNcblx0ICogZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGUgcGxheWVyIHdpbGwgaGF2ZSBpdHMgRE9NIGFuZCBjaGlsZCBjb21wb25lbnRzXG5cdCAqIGluIHBsYWNlLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb24gb25QbGF5ZXJSZWFkeVxuXHQgKiBAcGFyYW0gICAge1BsYXllcn0gcGxheWVyXG5cdCAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cblx0ICovXG4gIG9uUGxheWVyUmVhZHkob3B0aW9ucykge1xuICAgIHRoaXMuY29udGFpbmVyRHJvcGRvd25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5jb250YWluZXJEcm9wZG93bkVsZW1lbnQuY2xhc3NOYW1lID0gJ3Zqcy1xdWFsaXR5LWRyb3Bkb3duJztcblxuICAgIGxldCBjb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBjb250YWluZXJFbGVtZW50LmNsYXNzTmFtZSA9ICd2anMtcXVhbGl0eS1jb250YWluZXInO1xuICAgIGNvbnRhaW5lckVsZW1lbnQuaWQgPSAndmpzUXVhbGl0eVNlbGVjdG9yJztcblxuICAgIGxldCBidXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICBidXR0b25FbGVtZW50LmNsYXNzTmFtZSA9ICd2anMtYnJhbmQtcXVhbGl0eS1saW5rJztcbiAgICBidXR0b25FbGVtZW50Lm9uY2xpY2sgPSAoZXZlbnQpID0+IHRoaXMub25Ub2dnbGVEcm9wZG93bihldmVudCk7XG4gICAgYnV0dG9uRWxlbWVudC5pbm5lclRleHQgPSAnUXVhbGl0eSc7XG5cbiAgICBsZXQgdWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcblxuICAgIGlmICghb3B0aW9ucy5mb3JtYXRzKSB7XG4gICAgICBvcHRpb25zLmZvcm1hdHMgPSBbeyBjb2RlOiAnYXV0bycsIG5hbWU6ICdBdXRvJyB9XTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5vbkZvcm1hdFNlbGVjdGVkKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrID0gb3B0aW9ucy5vbkZvcm1hdFNlbGVjdGVkO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnNvdXJjZXMpIHtcbiAgICAgIHRoaXMuc291cmNlcyA9IG9wdGlvbnMuc291cmNlcztcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5kZWZhdWx0Rm9ybWF0KSB7XG4gICAgICB0aGlzLmRlZmF1bHRGb3JtYXQgPSBvcHRpb25zLmRlZmF1bHRGb3JtYXQ7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5mb3JtYXRzLm1hcCgoZm9ybWF0KSA9PiB7XG4gICAgICBsZXQgbGlFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcblxuICAgICAgbGlFbGVtZW50LmRhdGFzZXQuY29kZSA9IGZvcm1hdC5jb2RlO1xuICAgICAgaWYgKGZvcm1hdC5jb2RlID09PSB0aGlzLmRlZmF1bHRGb3JtYXQpIHtcbiAgICAgICAgbGlFbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY3VycmVudCcpO1xuICAgICAgICBidXR0b25FbGVtZW50LmlubmVyVGV4dCA9IGZvcm1hdC5uYW1lO1xuICAgICAgfVxuXG4gICAgICBsZXQgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cbiAgICAgIGxpbmtFbGVtZW50LmlubmVyVGV4dCA9IGZvcm1hdC5uYW1lO1xuICAgICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgJyMnKTtcbiAgICAgIGxpbmtFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMub25RdWFsaXR5U2VsZWN0KGZvcm1hdCk7XG4gICAgICB9KTtcblxuICAgICAgbGlFbGVtZW50LmFwcGVuZENoaWxkKGxpbmtFbGVtZW50KTtcbiAgICAgIHVsRWxlbWVudC5hcHBlbmRDaGlsZChsaUVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jb250YWluZXJEcm9wZG93bkVsZW1lbnQuYXBwZW5kQ2hpbGQodWxFbGVtZW50KTtcbiAgICBjb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyRHJvcGRvd25FbGVtZW50KTtcbiAgICBjb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGJ1dHRvbkVsZW1lbnQpO1xuXG4gICAgY29uc3QgZnVsbFNjcmVlblRvZ2dsZSA9IHRoaXMucGxheWVyLmNvbnRyb2xCYXIuZnVsbHNjcmVlblRvZ2dsZS5lbCgpO1xuXG4gICAgdGhpcy5wbGF5ZXIuY29udHJvbEJhci5lbCgpLmluc2VydEJlZm9yZShjb250YWluZXJFbGVtZW50LCBmdWxsU2NyZWVuVG9nZ2xlKTtcblxuICAgIHRoaXMucGxheWVyLmFkZENsYXNzKCd2anMtcXVhbGl0eXNlbGVjdG9yJyk7XG5cbiAgICBpZiAodGhpcy5kZWZhdWx0Rm9ybWF0KSB7XG4gICAgICB0aGlzLnNldFBsYXllclNvdXJjZSh0aGlzLmRlZmF1bHRGb3JtYXQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byBkZWxldGUgcHJldmlvdXMgaW5zdGFuY2UgdG8gYXZvaWQgZHVwbGljYXRlIG1lbnUgb24gdGhlIGNvbnRyb2wgYmFyXG4gICAqL1xuICBkZWxldGVFeGlzdGluZ0luc3RhbmNlKCkge1xuICAgIGlmICh0aGlzLnBsYXllci5oYXNDbGFzcygndmpzLXF1YWxpdHlzZWxlY3RvcicpKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2anNRdWFsaXR5U2VsZWN0b3InKTtcbiAgICAgIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBIHZpZGVvLmpzIHBsdWdpbi5cbiAqXG4gKiBJbiB0aGUgcGx1Z2luIGZ1bmN0aW9uLCB0aGUgdmFsdWUgb2YgYHRoaXNgIGlzIGEgdmlkZW8uanMgYFBsYXllcmBcbiAqIGluc3RhbmNlLiBZb3UgY2Fubm90IHJlbHkgb24gdGhlIHBsYXllciBiZWluZyBpbiBhICdyZWFkeScgc3RhdGUgaGVyZSxcbiAqIGRlcGVuZGluZyBvbiBob3cgdGhlIHBsdWdpbiBpcyBpbnZva2VkLiBUaGlzIG1heSBvciBtYXkgbm90IGJlIGltcG9ydGFudFxuICogdG8geW91OyBpZiBub3QsIHJlbW92ZSB0aGUgd2FpdCBmb3IgJ3JlYWR5JyFcbiAqXG4gKiBAZnVuY3Rpb24gcXVhbGl0eXNlbGVjdG9yXG4gKiBAcGFyYW0gICAge09iamVjdH0gW29wdGlvbnM9e31dXG4gKiAgICAgICAgICAgQW4gb2JqZWN0IG9mIG9wdGlvbnMgbGVmdCB0byB0aGUgcGx1Z2luIGF1dGhvciB0byBkZWZpbmUuXG4gKi9cbmNvbnN0IHF1YWxpdHlzZWxlY3RvciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHRoaXMucmVhZHkoKCkgPT4ge1xuICAgIGxldCBxdWFsaXR5Q29udHJvbCA9IG5ldyBRdWFsaXR5U2VsZWN0b3IodGhpcyk7XG4gICAgcXVhbGl0eUNvbnRyb2wuZGVsZXRlRXhpc3RpbmdJbnN0YW5jZSgpO1xuICAgIHF1YWxpdHlDb250cm9sLm9uUGxheWVyUmVhZHkodmlkZW9qcy5tZXJnZU9wdGlvbnMocXVhbGl0eUNvbnRyb2wuZGVmYXVsdHMsIG9wdGlvbnMpKTtcbiAgfSk7XG59O1xuXG4vLyBSZWdpc3RlciB0aGUgcGx1Z2luIHdpdGggdmlkZW8uanMuXG5jb25zdCByZWdpc3RlclBsdWdpbiA9IHZpZGVvanMucmVnaXN0ZXJQbHVnaW4gfHwgdmlkZW9qcy5wbHVnaW47XG5cbnJlZ2lzdGVyUGx1Z2luKCdxdWFsaXR5c2VsZWN0b3InLCBxdWFsaXR5c2VsZWN0b3IpO1xuXG4vLyBJbmNsdWRlIHRoZSB2ZXJzaW9uIG51bWJlci5cbnF1YWxpdHlzZWxlY3Rvci5WRVJTSU9OID0gJ19fVkVSU0lPTl9fJztcblxuZXhwb3J0IGRlZmF1bHQgcXVhbGl0eXNlbGVjdG9yO1xuIl19
