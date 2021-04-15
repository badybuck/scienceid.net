/**
 *
 * Функционал класса, после изминения фото
 * Пример:
 *  - самый верхний контейнер, он обрарачивает каждый элемент
 *  <.js_photoChangeBlock>
 *      <.js_wrapperItemCropper .hidden>
 *          <img .js_itemCropper>
 *      </>
 *      <.js_photoFieldOnLoad data-img>
 *      <.js_cropperBlock>
 *          <.js_cropper></>
 *      </>
 *      <input file #photoform-photo_field>
 *  </>
 *
 *  - скрытое модольное окно (bootstrap)
 *  <.js_modalPhoto>
 *      <.js_cropperInit></>
 *      <img .js_imgHidden></>
 *      <.js_btnCroppingSave></>
 *      <.js_wrapperItemCropper>
 *          <img .js_cropperImg></>
 *      </>
 *  </>
 *
 *
 * - сркрытому модальному окну от бутстрап к классу .modal добавить класс .js_modalPhoto
 *   - кнопке дать класс .js_cropperInit, это отвечает за запуск кропа
 *   - картинке которая отображаеться в модульном окне без кропа дать класс .js_imgHidden
 *   - кнопка сохранение кропа, дать класс .js_btnCroppingSave
 *   - блок в котором храниться html для кропа ему дать класс .js_wrapperItemCropper
 *      - изображению для кропа дать класс .js_cropperImg
 * - самому верхнему контейнеру, он обрарачивает каждый элемент, дать класс .js_photoChangeBlock
 *   - картинка которая хранит оригинальное изображение дать класс .js_itemCropper
 *   - там где нужно показывать измененную картинку сразу, дать класс .js_photoFieldOnLoad, вставить url картинки в атрибут data-img
 *   - что бы добавить новое фото ему input file нужно дать #photoform-photo_field
 */
var PhotoChange = new function () {
    /**
     * Объект для загрузки фото на сервер
     *
     * @type {{}}
     */
    var photoUpload = {};
    /**
     * Самый верхний элемент для кропа фото
     *
     * @type {{}}
     */
    var cropperParent = {};
    /**
     * Кнопка которая запустила функционал
     *
     * @type {string}
     */
    var buttonInit;
    /**
     * @type {string}
     */
    var constButtonCropper = 'cropper';
    /**
     * @type {string}
     */
    var constButtonLoad = 'load';

    this.run = function () {
        //changeUser();
        photoUpload = new PhotoUpload().run();
        eventLoadPhoto();
        eventCroppingPhotoInit();
        eventButtonSaveCropping();
        eventButtonCroppingInit();
        eventOnModal();
    };

    /**
     * Сохраняем кроп фото
     */
    function eventButtonSaveCropping() {
        $('body').on('click', '.js_modalPhoto .js_btnCroppingSave', function () {
            CropperMy.getCropper().getCroppedCanvas().toBlob(function (blob) {

                var uploadId = cropperParent.attr('data-upload-id');
                if (uploadId) {
                    photoUpload.setDataCropping({
                        uploadId: uploadId,
                        imgName: cropperParent.attr('data-photo'),
                        img: blob
                    });
                } else {
                    photoUpload.setDataDefaultCropping(blob);
                }

                Globals.fileReader(blob, function (data) {
                    previewFieldOnLoad(data.photoUrl);
                });

                $.fancybox.close();
            });
        });
    }

    /**
     * Загружаем кроп фото
     */
    function eventCroppingPhotoInit() {
        $('.js_modalPhoto').on('click', '.js_cropperInit', function () {
            cropperShow();
            CropperMy.cropperInit($('.js_modalPhoto .js_wrapperItemCropper .js_cropperImg')[0]);
        });
    }

    /**
     * Инициализируем кроп фото, при нажатие на кнопку
     */
    function eventButtonCroppingInit() {
        $('body').on('click', '.js_cropper', function () {
            buttonInit = constButtonCropper;
            cropperParent = $(this).parents('.js_photoChangeBlock:eq(0)');
            openWindow();
        });
    }

    /**
     * Пдписываемься на события модального окна от bootstrap
     */
    function eventOnModal() {
        $('.js_modalPhoto')
            .on('shown.bs.modal', function () {
                $('.js_modalPhoto .js_cropperImg').attr(
                    'src', cropperParent.find('.js_wrapperItemCropper .js_itemCropper').attr('src')
                );

                if (buttonInit === constButtonCropper) $('.js_modalPhoto .js_cropperInit').trigger('click');
            })
            .on('hidden.bs.modal', function () {
                cropperHidden();
            });
    }

    /**
     * Загружаем фото
     */
    function eventLoadPhoto() {
        $('#photoform-photo_field').change(function () {
            buttonInit = constButtonLoad;
            photoUpload.resetDataDefault();
            cropperParent = $(this).parents('.js_photoChangeBlock:eq(0)');
            cropperParent.attr('data-upload-id', '');
            cropperHidden();
            openWindowOnLoadFile($(this));

            photoUpload.setDataDefault($(this)[0].files[0]);
        });
    }

    /**
     * Открываем  модальное окно, и загружаем картинку
     *
     * @param {{}} selfPhoto
     */
    function openWindowOnLoadFile(selfPhoto) {
        Globals.fileReader(selfPhoto[0].files[0], function (data) {
            if (data.photoUrl) {
                cropperParent.find('.js_itemCropper').attr('src', data.photoUrl);
                cropperParent.find('.js_cropperBlock').removeClass('d-none');

                openWindow();
                $('.js_modalPhoto .js_img').attr('src', data.photoUrl);

                previewFieldOnLoad(data.photoUrl);
            }
        });
    }

    /**
     * Открываем модальное окно
     */
    function openWindow() {
        //$.fancybox.open({src: '#memberEducation'});
        $('.js_modalPhoto').modal();
        Globals.openWindowSizeAdd();
    }

    /**
     * Отображаем картинку превью
     *
     * @param {string} photoUrl
     */
    function previewFieldOnLoad(photoUrl) {
        cropperParent.find('.js_photoFieldOnLoad').css({'background-image': 'url(' + photoUrl + ')'}).attr('data-img', photoUrl);
    }

    function cropperHidden() {
        $('.js_modalPhoto .js_imgHidden').attr('src', '').removeClass('d-none');
        $('.js_modalPhoto .js_btnCroppingSave').addClass('d-none');
        $('.js_modalPhoto .js_wrapperItemCropper').addClass('d-none');
    }

    function cropperShow() {
        $('.js_modalPhoto .js_btnCroppingSave').removeClass('d-none');
        $('.js_modalPhoto .js_imgHidden').addClass('d-none');
        $('.js_modalPhoto .js_wrapperItemCropper').removeClass('d-none');
    }
};

$(document).ready(function () {
    PhotoChange.run();
});
