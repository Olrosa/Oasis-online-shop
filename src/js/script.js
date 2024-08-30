// Dropdown

document.querySelector('.form__dropdown').addEventListener('change', function() {
    if (this.value) {
        this.classList.add('has-value');
    } else {
        this.classList.remove('has-value');
    }
});

// Selectors

// Функция для проверки заполненности всех селекторов и последовательной активации
function checkAndActivateSelectors() {
    const selectors = document.querySelectorAll('.form__selector');
    
    selectors.forEach((selector, index) => {
        if (index === 0) {
            selector.classList.remove('disactive');
            selector.classList.add('active');
        } else {
            selector.classList.add('disactive');
            selector.classList.remove('active');
        }
    });

    selectors.forEach((selector, index) => {
        const customSelect = selector.querySelector('.custom-select');
        const hiddenSelect = customSelect.nextElementSibling;

        customSelect.addEventListener('click', function() {
            if (!selector.classList.contains('disactive')) {
                toggleSelectVisibility(customSelect);
            }
        });

        const items = customSelect.querySelectorAll('.select-items div');
        items.forEach(item => {
            item.addEventListener('click', function() {
                const value = item.getAttribute('data-value');
                const content = item.innerHTML;
                updateSelected(customSelect, value, content);

                // Проверяем и активируем следующий селектор
                if (index < selectors.length - 1) {
                    selectors[index + 1].classList.remove('disactive');
                    selectors[index + 1].classList.add('active');
                }

                // Проверяем заполненность всех селекторов
                checkAllSelectorsFilled();
            });
        });
    });
}

function checkAllSelectorsFilled() {
    const allFilled = Array.from(document.querySelectorAll('.custom-select')).every(select => {
        const hiddenSelect = select.nextElementSibling;
        return hiddenSelect && hiddenSelect.value;
    });

    const button = document.querySelector('.form__button');

    if (allFilled) {
        button.classList.remove('disactive');
        button.classList.add('active');
        button.disabled = false;
    } else {
        button.classList.add('disactive');
        button.classList.remove('active');
        button.disabled = true;
    }
}

function toggleSelectVisibility(select) {
    const items = select.querySelector('.select-items');
    const selected = select.querySelector('.select-selected');

    document.querySelectorAll('.custom-select').forEach(function(otherSelect) {
        if (otherSelect !== select) {
            otherSelect.querySelector('.select-items').style.display = 'none';
            otherSelect.querySelector('.select-selected').classList.remove('select-arrow-active');
        }
    });

    items.style.display = items.style.display === 'block' ? 'none' : 'block';
    selected.classList.toggle('select-arrow-active');
}

function updateSelected(select, value, content) {
    const selected = select.querySelector('.select-selected');
    const items = select.querySelector('.select-items');

    // Обновляем текст выбранного элемента
    selected.innerHTML = content;

    // Меняем цвет текста на #211A00
    selected.style.color = '#211A00';

    // Обновляем класс "same-as-selected" для выбранного элемента
    items.querySelector('.same-as-selected')?.classList.remove('same-as-selected');
    items.querySelector(`[data-value="${value}"]`).classList.add('same-as-selected');
    
    // Закрываем выпадающий список после выбора
    items.style.display = 'none';
    selected.classList.remove('select-arrow-active');

    const hiddenSelect = select.nextElementSibling;
    if (hiddenSelect && hiddenSelect.tagName.toLowerCase() === 'select') {
        hiddenSelect.value = value;
        hiddenSelect.dispatchEvent(new Event('change'));
    }
    
    // Добавляем вызов toggleSelectVisibility, чтобы закрыть селектор
    toggleSelectVisibility(select);
}


document.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.select-items').forEach(function(items) {
            items.style.display = 'none';
        });
        document.querySelectorAll('.select-selected').forEach(function(selected) {
            selected.classList.remove('select-arrow-active');
        });
    }
});

// Устанавливаем начальное состояние селекторов
checkAndActivateSelectors();
