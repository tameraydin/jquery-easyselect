;(function ($, window, document, undefined) {

	"use strict";

	$.easySelect = function(element, options) {

		var plugin = this,
			$element = $(element),
			$options = $element.children('option'),
			$container = $('<div class="easyselect-container"></div>'),
			$field_wrapper = $('<div class="easyselect-field-wrapper"></div>'),
			$field = $('<input class="easyselect-field" type="text">'),
			$box = $('<div class="easyselect-box"></div>'),
			$list = $('<ul class="easyselect-list"></ul>'),
			$list_wrapper = $('<div class="easyselect-list-wrapper"></div>'),

			defaults = {
				maxOption: 0,
				removeIcon: '<span>&nbsp;&#x2716;</span>',
				onKeyup: null
			},

			list = {

				clear: function() { //clear the list
					list.items.active = 0;
					list.items.collection = null;
					$list.children('li').removeClass('active filtered');
				},

				filter: function(pattern) { //filter matched items in the list
					var _first = 0,
						_count = 0;
					$list.children('li').removeClass('active').each(function(index) {
						if ($(this).text().toUpperCase().indexOf(pattern.toUpperCase()) != -1 && (plugin.settings.maxOption < 1 || _count < plugin.settings.maxOption)) {
							$(this).addClass('filtered');
							if (_first === 0) { //select the first item
								$(this).addClass('active');
								_first++;
							}
							_count++;
						}
					});
				},

				generate: function(refresh) { //generate a list according to options

					var _optionList = '',
						_boxList = '';

					if (refresh) {
						$options = $element.children('option');
					}

					$options.each(function() {
						if ($(this).is(':selected')) { //add selected options to the box
							_boxList += '<a href="" class="easyselect-box-item" data-value="' + $(this).val() + '">' + $(this).text() + plugin.settings.removeIcon + '</a>';
						} else { //add non-selected items to the list
							_optionList += '<li data-value="' + $(this).val() + '">' + $(this).text() + '</li>';
						}
					});

					if (_boxList) {
						$box.removeClass('empty');
					} else {
						$box.addClass('empty');
					}

					//prepare box items
					$box.html(_boxList);
					$box.children('.easyselect-box-item').bind('click', box.removeItem);

					//prepare list items
					$list.html(_optionList);
					$list.children('li')
						.bind('click', list.items.onClick)
						.bind('mouseenter', list.items.onHover);

				},

				items: {

					active: 0,
					collection: 0,
					count: 0,

					get: function() { //get & count filtered items
						list.items.collection = $list.children('.filtered');
						list.items.count = list.items.collection.length;
					},

					set: function() { //set item as selected
						list.items.collection.removeClass('active');
						list.items.collection.eq(list.items.active).addClass('active');
					},

					move: function(down) { //navigate on filtered items
						if (!list.items.collection) {
							list.items.get();
						}
						if (down) { //move down
							if (list.items.active < list.items.count - 1) {
								list.items.active++;
							} else {
								list.items.active = 0;
							}
						} else { //move up
							if (list.items.active > 0) {
								list.items.active--;
							} else {
								list.items.active = list.items.count - 1;
							}
						}
						list.items.set();
					},

					onClick: function() { //add clicked item to the box
						box.addItem($(this).attr('data-value'));
					},

					onHover: function() { //select the hovered item
						if (!list.items.collection) {
							list.items.get();
						}
						list.items.active = $(this).index('.filtered');
						list.items.set();
					}

				}

			},

			box = {

				addItem: function(value) { //select the option has given value & add it to the box
					$options.filter('[value=' + value + ']').attr('selected','selected');
					$field.val('');
					list.generate();
				},

				removeItem: function(e) { //deselect the option & remove from the box
					e.preventDefault();
					$options.filter('[value=' + $(this).attr('data-value') + ']').removeAttr('selected');
					$(this).remove();
					list.generate();
				}

			},

			field = {

				checkValue: function() { //check the entered value & add it to the box if it matches with an option

					$options.each(function() {
						if ($(this).text().toUpperCase() === $field.val().toUpperCase() && !$(this).is(':selected')) {
							box.addItem($(this).val());
							return;
						}
					});

				},

				onKeypress: function(e) {
					
					if (e.which == 13) { //enter
						e.preventDefault();
					}

				},

				onKeyup: function(e) {

					switch (e.which) {

						case 13: //enter
							var _selectedOptionValue = $list.children('.active').attr('data-value');
							if (_selectedOptionValue) {
								box.addItem(_selectedOptionValue);
							} else {
								field.checkValue();
							}
							break;

						case 27: //escape
							list.clear();
							break;

						case 38: //up arrow
							list.items.move(0);
							break;

						case 40: //down arrow
							list.items.move(1);
							break;

						default:
							list.clear();
							if ($(this).val()) {
								if (typeof plugin.settings.onKeyup == "function") {
									plugin.settings.onKeyup();
								} else {
									list.filter($(this).val());
								}
							}
							break;

					}

				}

			};

		plugin.settings = {};

		plugin.init = function() {

			plugin.settings = $.extend({}, defaults, options);

			// create & style the stuff
			$container.append($field_wrapper, $box);
			$element.hide().after($container);
			$field_wrapper.append($field).css('width',$field.outerWidth());
			$field_wrapper.append($list_wrapper.append($list));
			list.generate();

			// bindings
			$field.bind('blur', function() {
				setTimeout(function() {
					list.clear();
				}, 100);
			});
			$field.bind('focus keyup', field.onKeyup);
			$field.bind('keypress', field.onKeypress);

		};

		plugin.refresh = function() {

			list.generate(true);

		};

		plugin.init();

	};

	$.fn.easySelect = function (options) {
		return this.each(function() {
			if (!$.data(this, "easySelect")) {
				$.data(this, "easySelect", new $.easySelect(this, options));
			}
		});
	};

})(jQuery, window, document);