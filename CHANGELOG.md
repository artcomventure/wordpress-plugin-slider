# Changelog

## 1.14.0 - 2018-08-21
**Added**

* Mark (class) visible slides.

## 1.13.3 - 2018-07-06
**Changed**

* Check for post type's thumbnail support.

## 1.13.2 - 2017-11-15
**Changed**

* Remove (redundant) CSS.

## 1.13.1 - 2017-11-13
**Fixed**

* Element's className check.

## 1.13.0 - 2017-11-09
**Added**

* Slider elements to callback.

## 1.12.1 - 2017-11-09
**Fixed**

* Callbacks (onSlide and onSlideComplete).

## 1.12.0 - 2017-09-11
**Changed**

* ... to SVG navigation arrows.

**Added**

* Non animated slide.

## 1.11.4 - 2017-08-24
**Fixed**

* Non gallery dimension calculation fix.

## 1.11.3 - 2017-07-21
**Changed**

* CSS dimensions and position calculation to JS.

## 1.11.2 - 2017-07-21
**Fixed**

* Recalculate size (cover which dimension) on window resize.

## 1.11.1 - 2017-06-02
**Fixed**

* Missing t9ns.
* Combination of dimension 'auto' and size 'cover'.

## 1.11.0 - 2017-06-02
**Added**

* New option 'size' aka image size behaviour ('cover' or 'contain').

## 1.10.8 - 2017-06-01
**Fixed**

* CSS bugs (in some cases).

## 1.10.7 - 2017-04-04
**Fixed**

* Trigger change event on auto setting the default value for slider columns.

## 1.10.6 - 2017-03-29
**Changed**

* Extract css meant for WP from css file to php.

## 1.10.5 - 2017-03-29
**Changed**

* Filter for featured slider meta box html.

**Fixed**

* (hidden) Navigation text not selectable anymore.

## 1.10.4 - 2017-03-28
**Added**

* More featured slider display settings.

## 1.10.3 - 2017-03-27
**Fixed**

* Featured slider bugs.

## 1.10.2 - 2017-03-27
**Fixed**

* SliderDefaults vs Sliders.setDefaults().

## 1.10.1 - 2017-03-27
**Added**

* Featured slider: post thumbnail fallback.

## 1.10.0 - 2017-03-27
**Added**

* Post's featured slider.

## 1.9.0 - 2017-03-23
**Added**

* Backend options page for slider defaults.

## 1.8.3 - 2016-11-16
**Fixed**

* IE compatible window.scroll(X|Y).

## 1.8.2 - 2016-11-08
**Fixed**

* Improve mobile swipe (iOS bug).

## 1.8.1 - 2016-11-04
**Added**

* Get initial value.

## 1.8.0 - 2016-10-26
**Added**

* Jump config in media popup.
* Set/override default slider settings.

## 1.7.14 - 2016-10-26
**Fixed**

* Remove CSS height (100%) for dimension auto.
* Remove slider's event listeners on destroy.

## 1.7.13 - 2016-10-19
**Fixed**

* CSS bug fix (slide content).
* Disable mouse-swipe due to IE problems.

## 1.7.12 - 2016-09-26
**Fixed**

* CSS translate vs position fixed (Chrome bug).
* Focusing without scrolling.

## 1.7.11 - 2016-09-25
**Fixed/Added**

* Js' e.stopPropagination() on pager/navigation click.

## 1.7.10 - 2016-09-09
**Added**

* DocBlock in js files.

## 1.7.9 - 2016-07-07
**Added**

* CommonJS and AMD support.

## 1.7.8 - 2016-06-15
**Changes**

* Move initial Slider call out of js file.

## 1.7.7 - 2016-05-23
**Fixed**

* Faulty slide target validation.

## 1.7.6 - 2016-05-12
**Fixed**

* Swipe behaviour (and mobile navigation/pager click event).

## 1.7.5 - 2016-05-12
**Fixed**

* Mobile navigation/pager click event.

## 1.7.4 - 2016-05-12
**Added**

* Slide on mouse-swipe.

## 1.7.3 - 2016-05-11
**Fixed**

* Type validation for objects.
* Wrong dimension calculation.

**Added**

* Attribute setter method can handle attribute-value objects.

**Removed**

* Obsolete pager values in media popup.

## 1.7.2 - 2016-05-10
**Fixed**

* Slideshow.

## 1.7.1 - 2016-05-10
**Fixed**

* Backend preview flex-direction.

## 1.7.0 - 2016-05-10
**Added**

* Keyboard support.

**Changed**

* Backend preview.

## 1.6.1 - 2016-05-04
**Changed**

* Option 'scroll' to 'jump'.

## 1.6.0 - 2016-05-04
**Added**

* Option 'scroll': Number of slides to scroll on a slide action.

## 1.5.2 - 2016-04-29
**Changed**

* Default CSS: (navigation selector) use ´data-slide´ attribute instead of :first-/last-child.
* 'Force' slides (auto-dimension) to flex-direction: row.

## 1.5.1 - 2016-04-29
**Changed**

* Switch swipe action from touchend to touchmove.

## 1.5.0 - 2016-04-27
**Added**

* Add 'auto' dimension.

## 1.4.1 - 2016-04-26
**Fixed**

* Add swipe threshold.

## 1.4.0 - 2016-04-26
**Added**

* Swipe (left/right) events.

## 1.3.6 - 2016-04-05
**Fixed**

* columns navigation connection

## 1.3.5 - 2016-04-05
**Fixed**

* slides <= columns behaviour

## 1.3.4 - 2016-04-01
**Added**

* extend caption css to .slider__caption

**Changed**

* file version number to plugin's one

## 1.3.3 - 2016-04-01
**Fixes**

* pager bug fix

## 1.3.2 - 2016-04-01
**Fixes**

* setter/getter value type bug fix

## 1.3.1 - 2016-04-01
**Fixes**

* set slideshow data bug fix

**Changes**

* navigation css

## 1.3.0 - 2016-03-28
**Changes**

* Refactor js

## 1.2.0 - 2016-03-14
**Added**

* Slider columns

## 1.1.0 - 2016-03-13
**Added**

* Captions display

**Changed**

* Pager position outside of slider

**Removed**

* CSS sourceMaps

## 1.0.5 - 2016-03-11
**Added**

* .csscomb.json
* German translations
 
**Fixed**

* CSS for portrait ratio

## 1.0.4 - 2016-03-11
**Changed**

* Use post_gallery filter instead of overriding gallery shortcode
* Images not as background-image anymore

## 1.0.3 - 2016-03-10
**Added**

* Changed 'Plugins' screen detail link

## 1.0.2 - 2016-03-10
**Added**

* gulp
* build/

## 1.0.1 - 2016-03-10
**Added**

* README.md
* CHANGELOG.md

## 1.0.0 - 2016-03-02
**Added**

* Inititial file commit
