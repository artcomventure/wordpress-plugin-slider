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

* make slider js _accessible_  
* backend preview
* more slide animations

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
