/**
 * Загружает фото на сервер
 * Пример:
 *  <.js_photoUpload .js_photoUploadNoReloadMain .js_photoUploadSubmit data-photo-upload-url data-cropping-upload-url>
 *      <.js_photoUploadSave></>
 *  </>
 *
 *  - data-photo-upload-url на какой url загружать главное фот
 *  - data-cropping-upload-url на какой url загружать кроп фот
 *  - .js_photoUploadNoReload если стоит этот класс то страница не перезагружаеться если добавленно главное фото
 *  - .js_photoUploadSubmit если стоит этот класс то .js_photoUpload после загрузки всех картинок, будет отправлен submit()
 *
 *  - скрытое модольное окно (bootstrap), ожидания загрузки
 *  <.js_openWindowLoad></>
 */
var PhotoUpload = function () {
    /**
     * Самый верхний элемент
     * Внуттри него есть класс .js_photoUploadSave при нажатие на него все фото отправляються на сервер
     *
     * @type {{}}
     */
    var parent = {};
    /**
     * Данные фотографий, для отправки на сервер
     *
     * @type {{}}
     *      - .default: фото
     *      - .defaultCropping: Пустой или кроп главного фото
     *      - .cropping => [uploadId =>, imgName =>, img =>]
     */
    var data = {};
    /**
     * @type {{}}
     */
    var self = this;
    /**
     * Считаем когда все AJAX выполняться
     *
     * @type {number}
     */
    var ajaxCount = 0;

    /**
     * @return {PhotoUpload}
     */
    this.run = function () {
        save();
        return this;
    };

    /**
     * Добавляем новое (основное) фото
     *
     * @param {{}} img
     */
    this.setDataDefault = function (img) {
        data.default = img;
    };

    /**
     * Добавляем новое (основное) фото, кропп
     *
     * @param {{}} img
     */
    this.setDataDefaultCropping = function (img) {
        data.defaultCropping = img;
    };

    /**
     * Стираем главное фото вместе с кроп
     */
    this.resetDataDefault = function () {
        delete data.defaultCropping;
        delete data.default;
    };

    /**
     * Добавляем новое фото, кропп
     *
     * @param {{}} obj
     */
    this.setDataCropping = function (obj) {
        var cropping = {};
        data.cropping = data.cropping ? data.cropping : {};
        cropping = data.cropping;

        cropping[obj.uploadId] = {
            uploadId: obj.uploadId,
            imgName: obj.imgName,
            img: obj.img
        };
    };

    /**
     * Возврощаем все фото для загрузки
     *
     * @return {{}}
     */
    this.getData = function () {
        return data;
    };

    /**
     * Возврощаема url для кропа фото
     *
     * @return {string}
     */
    function getCroppingUrl() {
        var defaultUrl = $('body').attr('data-public-url') + '/ajax/ajax-user-photo/cropper-upload';
        var setUrl = parent.attr('data-cropping-upload-url');

        if (setUrl) return setUrl;
        return defaultUrl;
    }

    /**
     * Отправляем на сервер
     */
    function save() {
        $('.js_photoUpload').on('click', '.js_photoUploadSave', function () {
            $('.js_openWindowLoad').modal({
                backdrop: 'static',
                keyboard: false
            });

            parent = $(this).parents('.js_photoUpload:eq(0)');

            var thisData = self.getData();
            for (var key in thisData.cropping) {
                croppingSave({
                    croppingPhoto: thisData.cropping[key].img,
                    imgName: thisData.cropping[key].imgName,
                    uploadId: thisData.cropping[key].uploadId
                });
            }

            mainSave({
                default: thisData.default,
                defaultCropping: thisData.defaultCropping
            });

            if (Object.keys(thisData).length) return false;
        });
    }

    /**
     * Отправляем на сервер кроп фото
     *
     * @param {{}} param
     */
    function croppingSave(param) {
        var formData = new FormData();
        formData.append('img', param.croppingPhoto);
        formData.append('imgName', param.imgName);
        formData.append('uploadId', param.uploadId);

        ajaxControl(true);

        $.ajax({
            type: "POST",
            url: getCroppingUrl(),
            data: formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function () {
                ajaxControl(false);
            }
        });
    }

    /**
     * Отправляем на сервер главное фото.
     * Сначала загружаем на сервер основное фото, потом из отавета сервера загружаем кроп для основного фото
     *
     * @param {{}} param
     */
    function mainSave(param) {
        if (param.default) {
            var formData = new FormData();
            formData.append('PhotoForm[photo_field]', param.default);

            ajaxControl(true);
            $.ajax({
                type: "POST",
                url: parent.attr('data-photo-upload-url'),
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (server) {
                    if (param.defaultCropping) {
                        console.log(param.defaultCropping);
                        croppingSave({
                            croppingPhoto: param.defaultCropping,
                            imgName: server.imgName,
                            uploadId: server.uploadId
                        });
                    }
                    ajaxControl(false);
                }
            });
        }
    }

    /**
     * Контролируемп ajax запросы отправки фото на сервер
     *
     * @param {bool} count - если отправили ajax то передавать true, если ответ от ajax то false
     */
    function ajaxControl(count) {
        if (count) {
            ajaxCount++;
        } else {
            ajaxCount--;
        }

        // При существовании главного фото можем перезагрузить страницу
        if (!ajaxCount && data.default && !parent.hasClass("js_photoUploadNoReload")) {
            window.location = window.location.href
        }

        if (!ajaxCount) {
            data = {};
            $('.js_openWindowLoad').modal('hide');
        }

        if (!ajaxCount && parent.hasClass("js_photoUploadSubmit")) {
            parent.submit();
        }
    }
};