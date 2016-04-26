=== Gallery Slider ===

Contributors:
Donate link:
Tags: gallery, slider
Requires at least:
Tested up to:
Stable tag:
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Extends WP's gallery (media popup) with a slider option.

== Description ==

Extends the WordPress gallery section in the media popup with slider options.

== Installation ==

1. Upload files to the `/wp-content/plugins/` directory of your WordPress installation.
  * Either [download the latest files](https://github.com/artcomventure/wordpress-plugin-slider/archive/master.zip) and extract zip (optionally rename folder)
  * ... or clone repository:
  ```
  $ cd /PATH/TO/WORDPRESS/wp-content/plugins/
  $ git clone https://github.com/artcomventure/wordpress-plugin-slider.git
  ```
  If you want a different folder name than `wordpress-plugin-slider` extend clone command by ` 'FOLDERNAME'` (replace the word `'FOLDERNAME'` by your chosen one):
  ```
  $ git clone https://github.com/artcomventure/wordpress-plugin-slider.git 'FOLDERNAME'
  ```
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. **Enjoy**

== Usage ==

1. Go to the post and select in the editor the position you want to insert a slider.
2. Click on 'Add media' right above the editor.
3. Switch to 'Create Gallery', choose the images you want to display and click the 'Create a new gallery' button in the lower right corner.
4. Activate slider by checking 'Display as slider'.
5. Configure slider (and images) to fit your needs.

To change an existing slider click on the slider (gallery), click on the _edit pencil_ and repeat == Description ==

=== Use slider js standalone ===

**Markup example.** You don't necessarily use an `ul`. It also could be interleaved `div`s. But it must be 3 levels to the _content_.

```html
<div id="my-slider" data-OPTION="VALUE">
    <ul>
        <li>
            <img />
            <div class="slider__caption" />
        </li>
        <li>
            <img />
            <div class="slider__caption" />
        </li>
        <li>
            <img />
            <div class="slider__caption" />
        </li>
        <!-- ... and so on -->
    </ul>
</div>
```

Initial call to HTMLElement, HTMLCollection, NodeList or CSS selector (e.g. `'== Description ==

```javascript
var mySlider = new Slider( ELEMENT, OPTIONS );
```

**Possible options.** These options could be passed via HTML `data-`attributes or set as `object` on the js call.

|Option|Type|Value|Default|
|------|----|-----|-------|
|startSlide|integer|Slide to begin with.|1|
|duration|integer|Slide animation duration im ms.|500|
|loop|boolean|Loop from end to start and the other way round.|true|
|pager|string or boolean|Position of the pager. Possible values: 'top', 'bottom' or `false` (to hide pager).|bottom|
|navigation|boolean|Show/hide next and previous buttons.|false|
|dimension|string|Dimension of the slider. Could be a ratio (e.g. '16:9') or an excact size (e.g. '600px x 400px').|16:9|
|columns|integer|Number of slides to show at once.|1|
|slideshow|integer or boolean|Delay of auto slide in ms.|false|

**Additional js options.**

|Option|Type|Value|Default|
|------|----|-----|-------|
|onInit|function|Callback after slider is initialized.|`function() {}`|
|onBeforeSlide|function|Callback before slide begins.|`function() {}`|
|onAfterSlide|function|Callback on slide's completed.|`function() {}`|

=== Interaction ===

Programmatically trigger slide:

```javascript
// go to next slide
mySlider.slider( 'next' );

// back to previous slide
mySlider.slider( 'prev' );

// slide to slide number 3
mySlider.slider( 3 );
```

Change options on the fly:

```javascript
// OPTION: duration, loop, pager, navigation, dimension, columns, captions or slideshow
document.getElementById( 'my-slider' ).slider( 'set', OPTION, VALUE );
```

Remove slider and its traces from element:

```javascript
mySlider.slider( 'destroy', 'destroy' );
```

== Plugin Updates ==

Although the plugin is not _yet_ listed on https://wordpress.org/plugins/, you can use WordPress' update functionality to keep it in sync with the files from [GitHub](https://github.com/artcomventure/wordpress-plugin-slider).

**Please use for this our [WordPress Repository Updater](https://github.com/artcomventure/wordpress-plugin-repoUpdater)** with the settings:

* Repository URL: https://github.com/artcomventure/wordpress-plugin-repoUpdater/
* Subfolder (optionally, if you don't want/need the development files in your environment): build

_We test our plugin through its paces, but we advise you to take all safety precautions before the update. Just in case of the unexpected._

== Questions, concerns, needs, suggestions? ==

Don't hesitate! [Issues](https://github.com/artcomventure/wordpress-plugin-slider/issues) welcome.

== Changelog ==

= Unreleased =

* backend preview
* more slide animations

= 1.4.0 - 2016-04-26 =
**Added**

* Swipe events.

= 1.3.6 - 2016-04-05 =
**Fixed**

* columns navigation connection

= 1.3.5 - 2016-04-05 =
**Fixed**

* slides <= columns behaviour

= 1.3.4 - 2016-04-01 =
**Added**

* extend caption css to .slider__caption

**Changed**

* file version number to plugin's one

= 1.3.3 - 2016-04-01 =
**Fixes**

* pager bug fix

= 1.3.2 - 2016-04-01 =
**Fixes**

* setter/getter value type bug fix

= 1.3.1 - 2016-04-01 =
**Fixes**

* set slideshow data bug fix

**Changes**

* navigation css

= 1.3.0 - 2016-03-28 =
**Changes**

* Refactor js

= 1.2.0 - 2016-03-14 =
**Added**

* Slider columns

= 1.1.0 - 2016-03-13 =
**Added**

* Captions display

**Changed**

* Pager position outside of slider

**Removed**

* CSS sourceMaps

= 1.0.5 - 2016-03-11 =
**Added**

* .csscomb.json
* German translations
 
**Fixed**

* CSS for portrait ratio

= 1.0.4 - 2016-03-11 =
**Changed**

* Use post_gallery filter instead of overriding gallery shortcode
* Images not as background-image anymore

= 1.0.3 - 2016-03-10 =
**Added**

* Changed 'Plugins' screen detail link

= 1.0.2 - 2016-03-10 =
**Added**

* gulp
* build/

= 1.0.1 - 2016-03-10 =
**Added**

* README.md
* CHANGELOG.md

= 1.0.0 - 2016-03-02 =
**Added**

* Inititial file commit
