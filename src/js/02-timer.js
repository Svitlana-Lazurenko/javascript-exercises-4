import Notiflix from 'notiflix';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.btnStart.disabled = true;
let targetTime = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    targetTime = selectedDates[0];
    const deltaTime = targetTime - new Date();
    if (deltaTime <= 0) {
      refs.btnStart.disabled = true;
      Notiflix.Notify.failure('Please choose a date in the future');
    } else {
      refs.btnStart.disabled = false;
    }
  },
};

refs.input.addEventListener('click', flatpickr('#datetime-picker', options));
refs.btnStart.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  const timerId = setInterval(() => {
    const timeData = convertMs(targetTime - new Date());
    if (
      timeData.days === -1 &&
      timeData.hours === -1 &&
      timeData.minutes === -1 &&
      timeData.seconds === -1
    ) {
      clearInterval(timerId);
      return;
    }

    refs.days.textContent = addLeadingZero(timeData.days);
    refs.hours.textContent = addLeadingZero(timeData.hours);
    refs.minutes.textContent = addLeadingZero(timeData.minutes);
    refs.seconds.textContent = addLeadingZero(timeData.seconds);
  }, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  const stringValue = String(value);
  return stringValue.padStart(2, '0');
}
