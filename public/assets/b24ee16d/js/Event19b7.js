/**
 * Класс реализующий функционал событий
 *  Пример запуска:
 *  // Подписываемься на событие
 *  addEventListener("EVENT_NAME", function(event) {
 *      console.log(event);
 *  });
 *
 *  // Создаем событие:
 *  Event.create('EVENT_NAME', {key: 'val',...});
 */
var Event = new function () {
    this.builder = function () {
        ie();
    };

    /**
     * Создаем событие
     *
     * @param {string} name
     * @param {{}} detail - любые данные передаваемые в события
     */
    this.create = function (name, detail) {
        var event = new CustomEvent(name, {
            detail: detail
        });

        dispatchEvent(event);
    };

    /**
     * Поддержка событий в IE
     */
    function ie() {
        try {
            new CustomEvent("IE has CustomEvent, but doesn't support constructor");
        } catch (e) {

            window.CustomEvent = function (event, params) {
                var evt;
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
                evt = document.createEvent("CustomEvent");
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            };

            CustomEvent.prototype = Object.create(window.Event.prototype);
        }
    }
};

$(document).ready(function () {
    Event.builder();
});
