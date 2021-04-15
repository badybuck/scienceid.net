var Globals = new function () {
    var self = this;


    this.run = function () {
        //onLoadReaderPhotos();
        socialShare();
        openWindowSize();
        // @TODO Это временно, нужно перенести в \frontend\www\js\scripts.js
        $('.js_criteria').removeClass('d-none');
    };

    /**
     * Асинхронно читаем содержимое файла
     * @param file {{}} - файл который нужно отобразить
     * @param callback
     */
    this.fileReader = function (file, callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
            callback({'photoUrl': e.target.result});
        };
        reader.readAsDataURL(file);
    };

    /**
     * Создаем события
     * @param {string} name - названиве события
     * @param {{}} data - данные для события
     */
    this.eventCreate = function (name, data) {
        var event = new CustomEvent(name, {
            detail: data
        });

        dispatchEvent(event);
    };

    /**
     * Задаем высоту всплывающего окна
     */
    this.openWindowSizeAdd = function () {
        $('.js_openWindow .js_openWindowSize').css({'height': ($(window).height() - 250) + 'px'});
    };

    /**
     * Публикация в соц сети
     */
    function socialShare() {
        $('body').on('click', '.socials .socials__item', function () {
            window.open($(this).attr('href'), "social", "width=500,height=500");

            return false;
        });
    }

    /**
     * Определяем когда запускать, openWindowSizeAdd()
     * Пример:
     *  <.js_openWindow>
     *      <.js_openWindowSize>
     *  </>
     */
    function openWindowSize() {
        self.openWindowSizeAdd();

        $(window).resize(function () {
            if ($('.js_openWindow').hasClass("show")) {
                self.openWindowSizeAdd();
            }
        });
    }
};

$(document).ready(function () {
    Globals.run();
});