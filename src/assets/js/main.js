window.addEventListener('DOMContentLoaded', function () {
    'use strict';/* JS сработает когда DOM дерево загрузиться РЕКОМЕНДУЕТСЯ*/

    // Подгрузить форму
    function loadTheForm() {
        const loadTheFormBtn = document.querySelector('.loadTheFormFixed__btn'),
            sectionForms = document.querySelector('.forms');
        let url = window.location.href,  // Получаем текущий URL
            parts = url.split("/"),
            index = parts.indexOf('sites');
        if (index !== -1 && parts.length > index + 2) {
            var region = parts[index + 1];
            var service = parts[index + 2]
        }

        let UrlForm = window.location.origin.concat('/form.html')
        if(parts.length >= 7){
            UrlForm = window.location.origin.concat('/sites/',region,'/',service,'/form.html')
        }
        if(loadTheFormBtn){
            loadTheFormBtn.addEventListener('click', () => {
                fetch(UrlForm).then(
                    response => {
                        return response.text();
                    }
                ).then(
                    text => {
                        sectionForms.innerHTML = text;
                        // добавляем обработчик событий для кнопки закрытия
                        addCloseFormListener();
                    }
                )

            });

        }

        // Закрыть форму
        function addCloseFormListener() {
            const closeFormBtn = document.querySelector('.closeForm');
            if (closeFormBtn) {
                closeFormBtn.addEventListener('click', () => {
                    sectionForms.innerHTML = ''; // это "выгрузит" или "закроет" форму
                });
            }
        }
    }
    loadTheForm();

    // Определение функции для отправки формы на сервер
    function submitFormToServer() {
        // Получение элемента DOM с классом 'forms'
        const sectionForms = document.querySelector('.forms'),
            url = window.location.href, // получаем текущий url
            lang = document.documentElement.lang, // Получаем язык сайта
            os = navigator.platform; // Определяем ОС


        // Массив с идентификаторами полей для обработчиков
        const fields = ['jq_name', 'jq_phone', 'jq_street', 'jq_city', 'jq_email', 'jq_text'];

        // Добавляем обработчик клика для всего документа
        document.body.addEventListener('click', function (e) {
            // Если была нажата кнопка с id 'jq_submit'
            if (e.target.matches('#jq_submit')) {
                e.preventDefault(); // Отменяем стандартное действие кнопки (отправку формы)

                let isFormValid = true; // Флаг валидности формы
                const formData = new FormData(); // Создаем объект FormData

                // Проверяем каждое поле формы по очереди
                for (let fieldId of fields) {
                    const inputElement = document.querySelector(`[name='${fieldId}']`);

                    // Если поле заполнено убираем сообщение
                    if(inputElement){
                        inputElement.addEventListener('input', () => {
                            document.querySelector(`#${fieldId}`).style.display = 'none';
                        })
                    }

                    // Если поля нет пропускаем его
                    if(document.querySelector(`#${fieldId}`) !== null){
                        // Если поле не заполнено, отображаем сообщение об ошибке
                        if (!inputElement || !inputElement.value.trim()) {
                            document.querySelector(`#${fieldId}`).style.display = 'block';
                            isFormValid = false; // Устанавливаем флаг валидности в false
                            break; // Прерываем проверку полей, т.к. форма невалидна
                        } else {
                            // Если поле заполнено, добавляем его данные в объект formData
                            formData.append(fieldId, `<b>${fieldId}</b>: ${inputElement.value}\n`);
                        }
                    }

                }


                // Добавляем к сообщению текущий url, язык, ос
                formData.append('url', `<b>url</b>: ${url}\n`)
                formData.append('lang', `<b>lang</b>: ${lang}\n`)
                formData.append('os', `<b>platform</b>: ${os}\n`)


                // Если форма невалидна, прерываем выполнение функции
                if (!isFormValid) return;

                // Если форма валидна, отправляем ее данные на сервер
                fetch('https://axejs.org/handleFormTelegram', {
                    method: 'POST', // Метод отправки данных - POST
                    body: formData, // Тело запроса - данные формы
                    mode: 'no-cors' // Добавляем режим 'no-cors'вы не сможете прочитать содержимое ответа сервера. Этот ответ будет "opaque", то есть его содержимое будет недоступно. Вы сможете только проверить, что запрос был выполнен без ошибок.
                })
                    .then(() => {
                        // При успешном отправке формы
                        const success = document.querySelector('#jq_success')
                        sectionForms.innerHTML = ''; // Очищаем содержимое контейнера форм, эффективно "закрывая" форму
                        setTimeout(() => {
                            alert(success.textContent)
                        },1000)
                    })
                    .catch(error => {
                        console.error('Error:', error); // В случае ошибки выводим ее в консоль
                    });
            }
        });
    }
    submitFormToServer();


})