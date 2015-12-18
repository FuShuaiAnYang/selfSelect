
var SelfSelect = function (opt) {
    this.contentId = opt.contentId || "";
    this.data = opt.data;
    //this.width = opt.width || "252px";
    this._change = opt.onchange || undefined;
    this._click = opt.onclick || undefined;
    this._load = opt.onload || undefined;
}

SelfSelect.prototype.init = function () {
    if (!$) {
        alert('无法正确使用jQuery类库');
    }
    this.selectRegion = $('<div class="select-region"></div>');
    this.btnGroup = $('<div class="btn-group"></div>');
    this.btnGroupSpan = $('<span id="btn_group_span" selectValue=""></span>');
    this.caret = $('<span class="caret"></span>');
    this.dropdownMenu = $('<div class="dropdown-menu"></div>');
    this.bsSearchbox = $('<div class="bs-searchbox"></div>');
    this.input = $('<input class="form-control" type="text" name="zuhu" autocomplete="off"/>');
    this.ul = $('<ul class="dropdown-menu-inner"></ul>');
    if (this.data) {
        for (var i = 0; i < this.data.length; i++) {
            this.ul.append($('<li _value=' + this.data[i].value + '>' + this.data[i].text + '</li>'));
            if (i == 0 || this.data[i].selected) {
                this.setValue(this.data[i].text, this.data[i].value);
            }
        }
    } else {
        this.ul.append($('<li class="hidden">没有找到匹配项</li>'));
        this.setValue("--请选择--", "");
    }
    this.bindEvent();

    this.btnGroup.append(this.btnGroupSpan);
    this.btnGroup.append(this.caret);

    this.bsSearchbox.append(this.input);

    this.dropdownMenu.append(this.bsSearchbox);
    this.dropdownMenu.append(this.ul);

    this.selectRegion.append(this.btnGroup);
    this.selectRegion.append(this.dropdownMenu);

    if (this.contentId) {
        this.contentDiv = $('#' + this.contentId);
    } else {
        this.contentDiv = $('body');
    }
    this.contentDiv.append(this.selectRegion);

    if (this._load && typeof this._load == "function") {
        this._load(this);
    }
    return this;
}

SelfSelect.prototype.setValue = function (text, value) {
    this.btnGroupSpan.get(0).innerHTML = text;
    this.btnGroupSpan.attr("selectValue", value);
    if (this._change && typeof this._change == "function") {
        this._change(this);
    }
}
SelfSelect.prototype.getValue = function () {
    return this.btnGroupSpan.attr("selectValue");
}
SelfSelect.prototype.getText = function () {
    return this.btnGroupSpan.get(0).innerHTML;
}

SelfSelect.prototype.bindEvent = function () {
    var self = this;
    var $li = self.ul.find("li:not(:last)"),
        liLast = self.ul.find("li:last"),
        count = 0, //判断有没有找到数据
        showLi = false; //判断  没有找到匹配项 li

    self.btnGroup.bind('click', function (e) {
        e.stopPropagation();
        $li.removeClass('hidden');
        $li.removeClass('active');
        if (self.dropdownMenu.css('display') == 'none') {
            self.dropdownMenu.css({ 'display': 'block' });
            self.input.focus();
        } else {
            self.dropdownMenu.css({ 'display': 'none' });
            self.input.val('');
        }
    });
    $(document).bind('click', function (e) {
        e.target = e.target || e.srcElement;
        for (var i = 0; i < $li.length; i++) {
            if (e.target != $li.get(i)) {
                if (e.target != self.input.get(0)) {
                    self.dropdownMenu.css({ 'display': 'none' });
                    self.input.val('');
                    count = 0;
                }
            }
        }
    });
    $li.bind('click', function (e) {
        e.stopPropagation();
        $li.removeClass('selected active');
        $(this).addClass('selected active');
        self.setValue(this.innerHTML, $(this).attr("_value"));
        self.dropdownMenu.css({ 'display': 'none' });
        self.input.val('');
        count = 0;
    });
    self.input.bind('keypress', function (e) {
        if (e.keyCode != 13) return;
        if (showLi) return;
        e.stopPropagation();
        var $itemLi = $('.active');
        $li.removeClass('selected active');
        $itemLi.addClass('selected active');
        self.dropdownMenu.css({ 'display': 'none' });
        self.input.val('');
        count = 0;
        self.setValue($itemLi.get(0).innerHTML, $itemLi.attr("_value"));
    });
    self.input.bind('input propertychange', function (e) {
        $li.addClass('hidden');
        var inputVal = $(this).val();
        if (!inputVal) {
            $li.removeClass('active');
            $li.eq(0).addClass('active');
        }
        for (var i = 0; i < $li.length; i++) {
            var itemLi = $li.get(i);
            if (itemLi.innerHTML.indexOf(inputVal) >= 0) {
                $(itemLi).removeClass('hidden');
                count++;
                if (count == 1 && inputVal) {
                    $li.removeClass('active');
                    $(itemLi).addClass('active');
                }
            }
        }

        if (!count && !showLi) {
            liLast.removeClass('hidden');
            showLi = true;
        } else if (count && showLi) {
            liLast.addClass('hidden');
            showLi = false;
            count = 0;
        }
    });
}
