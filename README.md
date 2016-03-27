# WordPress Gallery Slider

Extends the WordPress gallery section in the media popup with slider options.

## Installation

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

## Usage

1. Go to the post and select in the editor the position you want to insert a slider.
2. Click on 'Add media' right above the editor.
3. Switch to 'Create Gallery', choose the images you want to display and click the 'Create a new gallery' button in the lower right corner.
4. Activate slider by checking 'Display as slider'.
5. Configure slider (and images) to fit your needs.

To change an existing slider click on the slider (gallery), click on the _edit pencil_ and repeat #5.

### Use slider js standalone

```javascript
// initial call to HTMLElement, HTMLCollection, NodeList or CSS selector (e.g. '#my-slider')
// ... with possible options (and their default values)

var mySlider = new Slider( ELEMENT, {
    // slide to begin with
    startSlide: 1,
    // slide animation duration
    duration: 500,
    // loop from end to start and the other way round
    loop: true,
    // show ('top' or 'bottom')/hide pager
    pager: 'bottom'
    // show/hide navigation
    navigation: false,
    // dimension (ratio or exact size)
    dimension: '16:9'
    // number of columns
    columns: 1
    // show/hide captions
    captions: false,
    // auto slide (delay in ms)
    slideshow: false
    // effect to change
    // atm only 'slide'
    effect: 'slide'
    
    // translation
    t9n: {
        previous: 'previous',
        next: 'next',
        slideTo: 'slide to'
    },
    
    // callbacks
    onInit: function() {},
    onBeforeSlide: function() {},
    onSlide: function() {},
    onSlideComplete: function() {}
} );
```

### Interaction

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

## Plugin Updates

Although the plugin is not _yet_ listed on https://wordpress.org/plugins/, you can use WordPress' update functionality to keep it in sync with the files from [GitHub](https://github.com/artcomventure/wordpress-plugin-slider).

**Please use for this our [WordPress Repository Updater](https://github.com/artcomventure/wordpress-plugin-repoUpdater)** with the settings:

* Repository URL: https://github.com/artcomventure/wordpress-plugin-repoUpdater/
* Subfolder (optionally, if you don't want/need the development files in your environment): build

_We test our plugin through its paces, but we advise you to take all safety precautions before the update. Just in case of the unexpected._

## Questions, concerns, needs, suggestions?

Don't hesitate! [Issues](https://github.com/artcomventure/wordpress-plugin-slider/issues) welcome.
