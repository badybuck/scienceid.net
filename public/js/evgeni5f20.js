$(function() {
    $(window).resize(function () {
        $('body').removeClass('body--fixed');
        $('.menu').removeClass('menu--active');
        if ($(window).width() > 950) {
            $('.header__enter').removeClass('header__enter--active');
        }
    });

    if ($(window).width() < 992) {
        $('.sidebar__link--active').click(function(e){
            $('.sidebar__h').toggle();
        });
    }

    $('.tooltip').tooltipster({
        contentCloning: true,
        side: 'bottom',
        animation: 'fade',
        delay: 50,
        maxWidth: 0,
        trigger: 'click',
        theme: 'tooltipster-noir',
        functionPosition: function(instance, helper, position){
            return position;
        }
    });

    $('.tooltip_system').tooltipster({
        contentCloning: true,
        side: 'top',
        animation: 'fade',
        delay: 50,
        trigger: 'hover',
        theme: 'tooltipster-system',
        functionPosition: function(instance, helper, position){
            return position;
        }
    });

    $('.grant-request-show-form').click(function(e) {
        e.preventDefault();

        $('.grant-request-form').addClass('grant-request-form--visible');
        $(this).addClass('grant-request-show-form--hidden');
    });

    $('.grants-imported').on('click', '.grant-request-delete', function() {
        var btn = $(this);
        var li = btn.closest('li');

        $.post('/ajax/grant-request-delete', {id: li.attr('data-id')}, function(res) {
            if (res.status == 'ok') {
                li.fadeOut(300, function() {
                    $(this).remove();
                });
            }
        }, 'json');
    });

    $('.grant-request-form [type="submit"]').click(function(e) {
        e.preventDefault();

        var form = $(this).closest('form');
        var list = $('.grants-imported ul');
        var input = form.find('input[type="text"]');
        var error = form.find('.grant-request-form__error');

        $.post(form.attr('action'), form.serialize(), function(res) {
            error.hide();

            if (res.status == 'ok') {
                var newEl = $('<li>', {text: input.val()}).hide();
                var delBtn = $('<span>', {class: 'grant-request-delete tag__remove', title: 'Удалить'});

                $('.grants-imported').addClass('grants-imported--visible');

                newEl.append(delBtn);
                newEl.attr('data-id', res.id);
                list.append(newEl);
                newEl.fadeIn(600);

                input.val('');
                form.removeClass('grant-request-form--visible');
                $('.grant-request-show-form').removeClass('grant-request-show-form--hidden');
            } else {
                error.text(res.errorMsg).show();
            }
        }, 'json');
    });

    $('.member__occupation-nv-label input[type="checkbox"]').click(function() {
        $('.member__occupation-date-end input').prop('disabled', this.checked);
    });

    $('.event-view__menu-btn').click(function(e) {
        var btn = $(this);

        $('.event-view__menu-btn').removeClass('event-view__menu-btn--active');
        btn.addClass('event-view__menu-btn--active');

        $('.event-view__page').removeClass('event-view__page--active');
        $('.event-view__page[data-id="' + btn.attr('href').substr(1) + '"]').addClass('event-view__page--active');
    });

    var eventViewMenu = $('.event-view__menu');
    if (eventViewMenu.length) {
        if (window.location.hash) {
            eventViewMenu.find('.event-view__menu-btn[href="' + window.location.hash + '"]').click();
        }
    }

    /* Управление мероприятиями */
    // Инициализация формы редактирования участника мероприятия
    initEventParticipantEditForm();

    function initEventParticipantEditForm() {
        var editParticipationForm = $('.edit-participation-form');
        if (!editParticipationForm.length) {
            return false;
        }

        var editParticipationFormErrors = $('.edit-participation-form__errors');

        editParticipationForm.find('[type="submit"]').click(function(e) {
            e.preventDefault();
            editParticipationFormErrors.html('');

            $.ajax({
                type: editParticipationForm.attr('method'),
                url: editParticipationForm.attr('action'),
                data: editParticipationForm.serialize(),
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        for (key in res.errors) {
                            res.errors[key].forEach(function(v) {
                                editParticipationFormErrors.append($('<li>', {text: v}));
                            });
                        }

                        $('.fancybox-slide--current').animate({ scrollTop: 0 }, 300);
                    } else {
                        var statusSelect = editParticipationForm.find('#eventparticipantform-status_id');
                        var participant = $('.participant-table .participation[data-id="' + editParticipationForm.find('input[name="id"]').val() + '"]');
                        participant.find('.table__item--status .table__text').text(statusSelect.find('option:selected').text());
                        $.fancybox.close();
                    }
                }
            });

            return false;
        });

        $('.edit-participation-btn').click(function() {
            var participationId = $(this).closest('.participation').attr('data-id');

            editParticipationFormErrors.html('');
            editParticipationForm[0].reset();
            editParticipationForm.find('input[name="id"]').val(participationId);
            editParticipationForm.find('.edit-participation-form__title').attr('data-participation-id', participationId);

            function fillParticipationFormInput(input, value) {
                switch (input.attr('data-type')) {
                    case 'select':
                        input.val(value);
                        break;
                    case 'text':
                        input.val(value);
                        break;
                    case 'file':
                        input.attr('href', value.filePath);
                        input.text(value.filePath != null ? 'файл' : 'файл не загружен');
                        input.siblings('label').text(value.title + ':');
                        break;
                }
            }

            // Получение сохраненных данных при регистрации
            $.post('/ajax/ajax-event-settings/handle-participation', {oper: 'getInfo', id: participationId}, function(res) {
                if (res.success) {
                    if (res.info != undefined) {
                        for (var k1 in res.info) {
                            if (k1 == 'regFormData') {
                                if (res.info[k1] != null) {
                                    for (var k2 in res.info[k1]) {
                                        fillParticipationFormInput(editParticipationForm.find('[data-attribute-name="regForm-' + k2 + '"]'), res.info[k1][k2]);
                                    }
                                }
                            } else {
                                fillParticipationFormInput(editParticipationForm.find('[data-attribute-name="main-' + k1 + '"]'), res.info[k1]);
                            }
                        }
                    }
                }
            }, 'json');
        });
    }

    // Инициализация формы редактирования рассылки по мероприятию
    initEventMailingEditForm();

    function initEventMailingEditForm() {
        var form = $('.event-mailing-form');
        if (!form.length) {
            return false;
        }

        var targetAllCheckbox = form.find('#mailing-targeting-all')

        function checkMailingTargeting() {
            form.find('#mailing-targeting-event_participant_status_ids').prop('disabled', targetAllCheckbox.is(':checked'));
            form.find('#mailing-targeting-user_ids').prop('disabled', targetAllCheckbox.is(':checked'));
        }

        checkMailingTargeting();
        targetAllCheckbox.click(checkMailingTargeting);
    }

    // Форма регистрации на мероприятие
    var eventRegForm = $('.event-reg-form');
    if (eventRegForm.length) {
        var eventRegFormErrors = eventRegForm.find('.error-summary');
        if (eventRegFormErrors.is(':visible')) {
            $('html, body').animate({
                scrollTop: eventRegFormErrors.offset().top - 100
            }, 900);
        }
        // Проверка email
        var emailCheckTimeout;

        eventRegForm.find('#simpleregistrationform-email').keyup(function() {
            var input = $(this);

            clearTimeout(emailCheckTimeout);

            input.removeClass('email-valid email-invalid');
            $('.email-check-text').closest('.row').remove();

            emailCheckTimeout = setTimeout(function() {
                $.post('/ajax/check-email', {email: input.val(), eventId: eventRegForm.attr('data-event-id')}, function(res) {
                    if (res.status == 'ok') {
                        input.addClass('email-valid');
                    } else {
                        input.addClass('email-invalid');

                        var emailCheckRow = $('<div>', {class: 'row mb-15'});
                        $('<div>', {class: 'col-sm-12 email-check-text', html: res.errorMsg}).appendTo(emailCheckRow);
                        emailCheckRow.insertAfter(input.closest('.row'));
                    }
                }, 'json');
            }, 600);
        });
    }

    $('.scroll-to-reg').click(function(e) {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: eventRegForm.offset().top - 100
        }, 900);
    });

    // Раздел "Новости"
    $('.load-news').click(function(e) {
        e.preventDefault();

        var btn = $(this);
        btn.css('opacity',  0.6);

        $.get('/ajax/load-news', {page: btn.data('page') + 1}, function(res) {
            btn.css('opacity', 1);

            if (res.status == 'ok') {
                $(res.news).each(function(key, value) {
                    $(value).insertBefore(btn);
                });

                btn.data()['page']++;
            }

            if (res.hideBtn) {
                btn.hide();
            }
        }, 'json');
    });


    // Раздел "Проекты"
    $('a.graph__degree-work').click(function(e) {
        e.preventDefault();

        var btn = $(this);
        $.get('/ajax/load-projects', {
            age: btn.data('age'),
            type: btn.data('type'),
            degree: btn.data('degree'),
            from: btn.data('count-from'),
            to: btn.data('count-to')
        }, function(res) {
            if (res.status == 'ok') {
                $('.graph__aside-body')
                    .empty()
                    .append(res.html)

                $(window).trigger('load');
            }
        }, 'json');
    });

    // Форма запроса на выпуск карт пользователя.
    var userCardRequestForm = $('.user-card-request-form');
    userCardRequestForm.find('input[type="file"]').on('change', function(e) {
        var wrapper = $(this).closest('.custom-file');
        wrapper.find('.file_msg').remove();
        $('<p>', {text: 'Выбран файл: ' + e.target.files[0].name, class: 'file_msg p--xs font-weight-light ' + ($(this).attr('data-msg-inline') ? 'd-inline ml-10 mt-5' : 'mt-10 mb-10')}).insertAfter(wrapper.find('.custom-file-label'));
    });

    userCardRequestForm.find('.select__input--light').each(function() {
        var select = $(this);
        select.select2({
            containerCssClass: 'select--form select--light',
            placeholder: select.attr('data-placeholder'),
            width: '100%',
            dropdownAutoWidth: true,
            dropdownCssClass: 'select__dropdown--common select__search--new',
            dropdownParent: select.closest('.select')
        });
    });

    // Форма поиска мероприятий
    var eventSearchInput = $('.search__form-content [name="EventSearch[search_field]"]')[0];

    if ($('.search--active').length) {
        eventSearchInput.focus();
        eventSearchInput.selectionStart = eventSearchInput.selectionEnd = eventSearchInput.value.length;
    }

    $($('.search__btn--initial')).click(function() {
        eventSearchInput.focus();
    });
});
