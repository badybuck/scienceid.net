/**
 * Логика для кропа фотографий
 * Использование:
 *  - самому верхнему блоку для кроппа дать класс .js_photosCropper
 *      - кнопка по которой нажимаем что бы запустить функционал кроп .js_cropper
 *      - оригинальное фото для кропалежит внтрик контейнера склассом .js_wrapperItemCropper
 *          - тегу img дать класс .js_itemCropper
 *      - кнопке при нажатие на которую сгенерируеться кроп фото, дать класс .js_saveCropper
 *      - div, после нажатия на .js_saveCropper в этот тег втавиться сгенерированное кроп фото< дать ему класс .js_itemPhoto
 */
var CropperMy = new function () {
    /**
     * Объект Cropper
     *
     * @type {{}}
     */
    var cropper = {};

    this.run = function () {
        croppingPhotoAdmin();
        eventSave();
    };

    /**
     * В паблике, при запуске кроппа фото
     *
     * @param item {{}} - картинка которой нужен кроп
     */
    this.cropperInit = function (item) {
        $(".cropper-hidden").each(function () {
            (this.cropper.destroy());
        });

        cropper = new Cropper(item, {
            aspectRatio: 9 / 9
        });

        /*
        $('.js_photosCropper').on('click', '.js_cropper', function () {
            // Показываем только активное кроп
            $(".js_photosCropper .js_wrapperItemCropper").addClass('hidden');
            var parent = $(this).parents('.js_photosCropper:eq(0)');
            parent.find('.js_wrapperItemCropper').removeClass('hidden');

            // Делаем что бы нельзя было одновременно реадктировать несколько фото
            $(".cropper-hidden").each(function(){
                (this.cropper.destroy());
            });

            cropper = new Cropper(parent.find('.js_itemCropper')[0], {
                aspectRatio: 9 / 9
            });
        });
        */
    };

    /**
     * Возврощаем кроппер
     *
     * @return {{}}
     */
    this.getCropper = function () {
        return cropper;
    };

    /**
     * В админке, при запуске кроппа фото
     */
    function croppingPhotoAdmin(){
        $('.js_photosAdmin').on('click', '.js_cropper', function () {
            // Делаем что бы нельзя было одновременно реадктировать несколько фото
            $(".cropper-hidden").each(function(){
                (this.cropper.destroy());
            });
            // делаем что бы кнопка сохранить не появлялась сразу на нескольких фото а только на редактируемом
            $('.js_photosAdmin .js_save').addClass('hidden');

            var parent = $(this).parents('.js_photosAdmin:eq(0)');
            cropper = new Cropper(parent.find('.js_itemCropper')[0], {
                aspectRatio: 9 / 9
            });
            parent.find('.js_saveCropper').removeClass('hidden');
        });
    }

    /**
     * Отправка кроп фото на сервер
     */
    function eventSave(){
        $('body').on('click', '.js_saveCropper', function () {
            var parent = $(this).parents('.js_photosCropper:eq(0)');

            cropper.getCroppedCanvas().toBlob(function (blob) {
                var data = new FormData();
                data.append('img', blob);
                data.append('imgName', parent.attr('data-photo'));
                data.append('uploadId', parent.attr('data-upload-id'));

                $.ajax({
                    type: "POST",
                    url: $('body').attr('data-public-url') + '/ajax/cropper-upload',
                    data: data,
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    success: function (server) {
                        parent.attr('data-photo', server.fileName);
                        parent.find('.js_itemPhoto').css({'background-image': 'url(' + server.fileNamePath + ')'});
                    }
                });
            });
        });
    }
};