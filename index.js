;!function ($) {
	'use strict';

	var Pagination = function(element, options) {
		this.$element = $(element)
		$.extend(this, options || {})
		this.pages = this.pages || this._getPages()
	}

	Pagination.defaults = {
		items: 1,
		itemsOnPage: 10,
		pages: 0,
		displayedPages: 5,
		edges: 2,
		currentPage: 0,
		prevText: '上一页',
		nextText: '下一页',
		ellipseText: '&hellip;',
		theme: '',
		onPageClick: function(pageNumber, event) {
		}
	}

	Pagination.prototype = {
		drawPage: function(page) {
			if (page != null) {
				this.currentPage = page - 1;
			}
			this._draw()
			return this.$element
		},
		destroy: function(){
			return this.$element.empty()
		},
		prevPage: function() {
			this._selectPage(this.currentPage - 1)
			return this.$element
		},
		nextPage: function() {
			this._selectPage(this.currentPage + 1)
			return this.$element
		},
		selectPage: function(page) {
			this._selectPage(page - 1)
			return this.$element
		},
		getCurrentPage: function() {
			return this.currentPage + 1
		},
		getPagesCount: function() {
			return this.pages
		},
		_selectPage: function(pageIndex, event) {
			this.currentPage = pageIndex;
			this._draw()
			this.onPageClick(this.currentPage + 1, event)
		},
		_draw: function(){
			var self = this,
				interval = self._getInterval(),
				edges = self.edges,
				pages = self.pages,
				$element = self.$element,
				$panel, i, begin, end


			self.destroy()
			$panel = $('<ul class="ui-pagination"></ul>').appendTo($element)

			if (self.theme) {
				$element.addClass(self.theme)
			}

			// 纠错
			self.currentPage = self.currentPage < 0 ? 0 :
								self.currentPage >= pages ? pages - 1 : 
								self.currentPage

			// 上一页
			if (self.prevText) {
				self._appendItem(self.currentPage - 1, {text: self.prevText, classes: 'prev'})
			}
			// 前部分边缘页码
			if (interval.start > 0 && edges > 0) {
				end = Math.min(edges, interval.start)
				for (i = 0; i < end; i++) {
					self._appendItem(i)
				}
				if (edges < interval.start && (interval.start - edges !== 1)) {
					$panel.append('<li class="ellipse"><span>' + self.ellipseText + '</span></li>')
				} else if (interval.start - edges === 1) {
					self._appendItem(edges)
				}
			}
			// 显示页面
			for (i = interval.start; i < interval.end; i++) {
				self._appendItem(i)
			}
			// 后部分边缘页码
			if (interval.end < self.pages && edges > 0) {
				if (pages - edges > interval.end && (pages - edges - interval.end !== 1)) {
					$panel.append('<li class="ellipse"><span>' + self.ellipseText + '</span></li>')
				} else if (pages - edges - interval.end === 1) {
					self._appendItem(interval.end)
				}
				begin = Math.max(pages - edges, interval.end);
				for (i = begin; i < pages; i++) {
					self._appendItem(i)
				}
			}
			if (self.nextText) {
				self._appendItem(self.currentPage + 1, {text: self.nextText, classes: 'next'})
			}

			// 绑定点击
			$panel.on('click', 'a', function(e) {
				var $link = $(this)
				var pageIndex = $link.data('pageIndex')

				self._selectPage(pageIndex, e)
			})
		},
		_appendItem: function(pageIndex, opts) {
			var self = this,
				$element = this.$element,
				$ul = $element.children('ul:first'),
				$linkWrapper = $('<li></li>'),
				overScope = pageIndex < 0 || pageIndex > (self.pages - 1),
				options, $link, statusClass

			pageIndex = pageIndex < 0 ? 0 : (pageIndex < self.pages ? pageIndex : self.pages - 1)

			options = {
				text: pageIndex + 1,
				classes: ''
			}

			options = $.extend(options, opts || {})

			if (pageIndex == self.currentPage || overScope) {
				statusClass = overScope ? 'disabled' : 'active'
				$linkWrapper.addClass(statusClass);
				$link = $('<span>' + (options.text) + '</span>')
			} else {
				$link = $('<a href="javascript:;">' + (options.text) + '</a>')
			}

			$link.data('pageIndex', pageIndex).appendTo($linkWrapper)

			$ul.length ?
				$ul.append($linkWrapper) :
				$element.append($linkWrapper)
		},
		_getInterval: function() {
			var self = this,
				half = this.displayedPages / 2,
				bigger = this.currentPage - half

			return {
				start: Math.ceil(bigger > 0 ? bigger : 0),
				end: Math.ceil(bigger > 0 ? 
						Math.min(self.currentPage + half, self.pages) 
						: Math.min(self.displayedPages, self.pages) )
			}
		},
		_getPages: function() {
			var pages = Math.ceil(this.items / this.itemsOnPage)
			return pages || 1;
		}
	}

	Pagination.prototype.Constructor = Pagination

	function Plugin(option, params) {
		var $this = $(this),
			data  = $this.data('tc.pagination'),
			options

			if (option.currentPage) 
				option.currentPage = option.currentPage - 1
			options = $.extend({}, Pagination.defaults, typeof option == 'object' && option)

		if (!data) 
			$this.data('tc.pagination', (data = new Pagination(this, options)) )

		if (typeof option === 'string') 
			return data[option](params)
		else 
			return data.drawPage()
	}

	$.fn.pagination = Plugin;
	$.fn.pagination.Constructor = Pagination;

}(jQuery);