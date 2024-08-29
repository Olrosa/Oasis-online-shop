// Dropdown

document.querySelector('.form__dropdown').addEventListener('change', function() {
    if (this.value) {
        this.classList.add('has-value');
    } else {
        this.classList.remove('has-value');
    }
});

// Selectors

const selectors = document.querySelectorAll('.form__selector');
const button = document.querySelector('.form__button');

selectors.forEach((selector, index) => {
    const selectElement = selector.querySelector('select');

    // Добавляем обработчик события change к каждому select
    selectElement.addEventListener('change', function () {
        if (this.value) {
            // Активируем следующий селектор, если выбран текущий
            const nextSelector = selectors[index + 1];
            if (nextSelector) {
                nextSelector.classList.remove('disactive');
                nextSelector.classList.add('active');
                nextSelector.querySelector('select').disabled = false;
            }

            // Проверяем, заполнены ли все селекторы
            checkAllSelectorsFilled();
        }
    });
});

// Функция для проверки, заполнены ли все селекторы
function checkAllSelectorsFilled() {
    const allFilled = Array.from(selectors).every(selector => {
        const selectElement = selector.querySelector('select');
        return selectElement.value;
    });

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