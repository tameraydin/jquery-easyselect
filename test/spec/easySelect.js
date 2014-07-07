describe('easySelect', function () {

	var select;

	beforeEach(function () {

		var options = '',
			charCode = 97,
			i = 0;
		for (i=0; i<10; i++) {
			options += '<option value="'+(i+1)+'">Item 1 - &#'+charCode+';</option>';
			charCode++;
		}
		$('body').append('<select id="test-select" multiple>'+options+'</select>');

		jasmine.addMatchers({

			toBeInitialized: function() {
				return {
					compare: function(actual) {
						var result = {pass: false};

						if ($(actual).next('.easyselect-container').index() < 0)
							return result;
						if ($('.easyselect-list').index() < 0)
							return result;
						if ($('.easyselect-box').index() < 0)
							return result;
						if ($('.easyselect-field').index() < 0)
							return result;

						result.pass = true;
						return result;
					}
				};
			}

		});

		select = $('#test-select');

	});

	describe('general', function() {

		it('plugin is chainable', function() {
			select.easySelect().addClass('test-class');
			expect(select.hasClass('test-class')).toBeTruthy();
		});

		it('should work for multiple select elements', function() {
			select.easySelect();
			var select2 = $('<select multiple><option value="1">a</option><option value="2">b</option></select>');
			$('body').append(select2);
			select2.easySelect();
			expect($('.easyselect-list').size()).toEqual(2);
		});

	});

	describe('initialization', function () {

		it('hides select element', function() {
			select.easySelect();
			expect(select.is(':hidden')).toBeTruthy();
		});

		it('creates new easySelect elements', function() {
			select.easySelect();
			expect(select).toBeInitialized();
		});

		it('checked option should be added to box by default', function() {
			var select2 = $('<select multiple><option value="1">a</option><option value="2" selected>b</option><option value="3" selected>c</option></select>');
			$('body').append(select2);
			select2.easySelect();
			expect($('.easyselect-box-item').size()).toEqual(2);
		});

		it('multiple selects sould not conflict', function() {
			var select2 = $('<select multiple><option value="1" selected>a</option><option value="2">b</option></select>');
			$('body').append(select2);
			select2.easySelect();
			var select3 = $('<select multiple><option value="1" selected>c</option><option value="2">b</option></select>');
			$('body').append(select3);
			select3.easySelect();
			expect($('.easyselect-box-item').size()).toEqual(2);
			$('.easyselect-box-item:last').click();
			expect($('.easyselect-box-item').size()).toEqual(1);
			$('.easyselect-field:first').val('b').trigger('focus');
			expect($('.easyselect-list li.filtered').size()).toEqual(1);
			$('.easyselect-list li.active').trigger('click');
			expect($('.easyselect-box-item').size()).toEqual(2);
			expect($('.easyselect-box:last .easyselect-box-item').size()).toEqual(0);
		});

	});

	describe('events', function () {

		it('option list should appear as filtered when user types & dissappear when focused out', function() {
			select.easySelect();
			$('.easyselect-field').val('b').trigger('focus');
			expect($('.easyselect-list li.filtered').size()).toEqual(1);
			$('.easyselect-field').trigger('blur');

			setTimeout(function() {
				expect($('.easyselect-list li.filtered').size()).toEqual(0);
			}, 100);
		});

		it('list item should be added to box when user clicks', function() {

			select.easySelect();
			$('.easyselect-field').val('a').trigger('focus');
			$('.easyselect-list li.active').trigger('click');
			expect($('.easyselect-box-item').attr('data-value')).toEqual('1');

			$('.easyselect-field').val('b').trigger('focus');
			$('.easyselect-list li.active').trigger('click');
			expect($('.easyselect-box-item').size()).toEqual(2);
			expect(select.val()).toEqual(['1','2']);

		});

		it('selected item should be removed from box when user clicks', function() {
			select.easySelect();
			$('.easyselect-field').val('a').trigger('focus');
			$('.easyselect-list li.active').trigger('click');
			$('.easyselect-field').val('b').trigger('focus');
			$('.easyselect-list li.active').trigger('click');
			$('.easyselect-box-item:first').trigger('click');
			expect($('.easyselect-box-item').size()).toEqual(1);
			expect(select.val()).toEqual(['2']);
		});

		it('accessibility keys should work (enter/esc/up/down)', function() {

			select.easySelect();
			var easySelectField = $('.easyselect-field');
			easySelectField.val('Item').trigger('focus');
			easySelectField.trigger({type:'keyup', which:27});
			expect($('.easyselect-list li.filtered').size()).toBeLessThan(1);

			easySelectField.trigger('focus');
			easySelectField.trigger({type:'keyup', which:40});
			easySelectField.trigger({type:'keyup', which:40});
			easySelectField.trigger({type:'keyup', which:38});
			expect($('.easyselect-list li.active').attr('data-value')).toEqual('2');

			easySelectField.trigger({type:'keyup', which:13});
			expect($('.easyselect-box').html()).not.toEqual('');
			expect(select.val()).toEqual(['2']);

		});

	});

	describe('plugin options & methods', function () {

		beforeEach(function () {
			var settings = {
				maxOption: 4,
				removeIcon: '<div class="removeIconTest"></div>'
			};
			select.easySelect(settings);
		});

		it('max 4 item should be suggested', function() {
			$('.easyselect-field').val('i').trigger('focus');
			expect($('.easyselect-list li.filtered').size()).toEqual(4);
		});

		it('remove icon now should be created as a "div"', function() {
			$('.easyselect-field').val('i').trigger('focus');
			$('.easyselect-list li.active').trigger('click');
			expect($('.removeIconTest').index()).toBeGreaterThan(-1);
		});

		it('"onKeyup" function should be triggered', function() {
			settings = {
				onKeyup: function() {
					$('body').append('<div id="onKeyupTest"></div>');
				}
			};
			var select2 = $('<select multiple><option value="1" selected>a</option><option value="2">b</option></select>');
			$('body').append(select2);
			select2.easySelect(settings);
			var easySelectField = $('.easyselect-field:last');
			easySelectField.val('i');
			easySelectField.trigger({type:'keyup', which:49});
			expect($('#onKeyupTest').index()).toBeGreaterThan(-1);
		});

		it('"refresh" method should work', function() {
			select.append('<option value="x">x</option>');
			$('.easyselect-field').val('x').trigger('focus');
			expect($('.easyselect-list li.filtered').size()).toEqual(0);
			select.data('easySelect').refresh();
			$('.easyselect-field').trigger('focus');
			expect($('.easyselect-list li.filtered').size()).toEqual(1);
			select.append('<option value="y" selected>y</option>');
			select.data('easySelect').refresh();
			expect($('.easyselect-box-item').size()).toEqual(1);
		});

	});

	afterEach(function () {
		$('select').remove();
		$('.easyselect-container').remove();
	});

});