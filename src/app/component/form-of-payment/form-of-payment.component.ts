import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';
import {fadingAwayAnimate, showAnimate} from '../../shared/animations/fading-away-animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';

class UserData {
  numberCard: string;
  ValidTo: string;
  cvvCode: number;
}

@Component({
  selector: 'app-form-of-payment',
  templateUrl: './form-of-payment.component.html',
  styleUrls: ['./form-of-payment.component.scss'],
  animations: [fadingAwayAnimate, showAnimate]
})
export class FormOfPaymentComponent implements OnInit {
  toggleCard = false;
  myGroup: FormGroup;
  successfulCardNumberEntry = false;
  isSubmittedData = false;
  visaSystemLogo = false;
  masterCardSystemLogo = false;
  errorValidDate = false;
  errorFormatDate = false;
  errorCodeCVV = false;
  focusCVV = false;
  validForm = false;
  keyboard = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  systemError = false;
  modal = false;
  inputDate = [
    {maxNumber: 12, nameValidator: 'numberData', class: 'mount-inp', name: 'mount', id: '1'},
    {maxNumber: 99, nameValidator: 'numberYear', class: 'year-inp', name: 'year', id: '2'}
  ];
  @ViewChild('inputListCardNumber', {static: false}) input: ElementRef;
  @ViewChild('inputListData', {static: false}) inputData: ElementRef;
  @ViewChild('inputCVVCode', {static: false}) inputCVVCode: ElementRef;
  @ViewChild('divElement', {static: false}) divElement: ElementRef;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.createFormGroup();
    this.randomVisibleBlock();
  }
  next() {
    this.cardNumberValidation();
    this.controlValidDate();
    if (this.f.number1.invalid || this.f.number2.invalid || this.f.number3.invalid || this.f.number4.invalid || this.f.numberData.invalid
      || this.f.numberYear.invalid || this.successfulCardNumberEntry || this.errorValidDate || this.errorFormatDate) {
      this.toggleCard = false;
      return;
    } else {
      this.toggleCard = true;
      this.isSubmittedData = false;
    }
  }
  back() {
    this.toggleCard = false;
    this.focusCVV = false;
    this.validForm = false;
    this.errorCodeCVV = false;
  }
  submit() {
    this.controlValidDate();
    if (this.myGroup.invalid) {
      this.successfulCardNumberEntry = true;
    } else {
      const userData = new UserData();
      userData.numberCard = this.f.number1.value + this.f.number2.value + this.f.number3.value + this.f.number4.value;
      userData.ValidTo = this.f.numberData.value + this.f.numberYear.value;
      userData.cvvCode = this.f.numberCvv.value;
      this.myGroup.reset();
      this.modal = true;
      this.toggleCard = false;
      this.validForm = false;
    }
  }
  // ____form___________
  createFormGroup() {
    return this.myGroup = this.fb.group({
      number1: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(/^((?!(0){1,4})[0-9]{4})$/)]],
      number2: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(/^[0-9]{4}/)]],
      number3: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(/^[0-9]{4}/)]],
      number4: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(/^[0-9]{4}/)]],
      numberData: ['', [Validators.required, Validators.pattern(/0[1-9]|1[012]/)]],
      numberYear: ['', [Validators.required, Validators.maxLength(2), Validators.minLength(2), Validators.pattern(/^(?!(0){2})[0-9]{2}/)]],
      numberCvv: ['', [Validators.pattern(/^[0-9]{3}/)]]
    });
  }
  public get f() {
    return this.myGroup.controls;
  }
  // ________________методы относящееся Credit Card – front___________
  numericOnly(event: KeyboardEvent): boolean {
    const pattern = /^\d{1}$/;
    const result = pattern.test(event.key);
    return result;
  }
  blurNumberCard() {
    this.cardNumberValidation();
    this.systemError = false;
  }
  cardNumberValidation() {
    if (+this.f.number1.value === 0 && +this.f.number2.value === 0 && +this.f.number3.value === 0 && +this.f.number4.value === 0) {
      this.successfulCardNumberEntry = true;
    } else {
      this.successfulCardNumberEntry = false;
    }
    if (this.myGroup.controls.number1.invalid) {
      this.systemError = true;
    } else {
      this.systemError = false;
    }
    if (this.myGroup.controls.number1.valid && this.myGroup.controls.number2.valid
      && this.myGroup.controls.number3.valid && this.myGroup.controls.number4.valid) {
      this.successfulCardNumberEntry = false;
    } else {
      this.successfulCardNumberEntry = true;
    }
  }
  nextInput(event, id?: number) {
    const pattern = /^\d{4,4}$/;
    const result = pattern.test(event.target.value);
    if (result) {
      if (id === 1) {
        this.visibleLogoPaymentSystem(event);
      }
      if (id <= 4) {
        if (this.myGroup.dirty) {
          this.cardNumberValidation();
        }
      }
      if (typeof +event.target.value === 'number') {
        const inputElement = this.input.nativeElement.getElementsByClassName('input-number-card');
        const selected = inputElement.namedItem(`input-${id + 1}`);
        if (selected === null) {
        } else {
          selected.parentElement.focus();
        }
      }
    }
    if (event.target.value.toString().length === 0) {
      const inputElement = this.input.nativeElement.getElementsByClassName('input-number-card');
      const selected = inputElement.namedItem(`input-${id - 1}`);
      if (selected === null) {
      } else {
        selected.parentElement.focus();
        this.systemError = false;
      }
    }
  }
  visibleLogoPaymentSystem(event) {
    if (event.target.value.slice(0, 1) === '4') {
      this.visaSystemLogo = true;
    } else {
      this.visaSystemLogo = false;
    }
    if (event.target.value.slice(0, 1) === '5') {
      this.masterCardSystemLogo = true;
    } else {
      this.masterCardSystemLogo = false;
    }
  }
  numericData(event: KeyboardEvent) {
    const pattern = /^\d{1}$/;
    const result = pattern.test(event.key);
    return result;
  }
  nextInputData(event, id: number) {
    const pattern = /^\d{2,2}$/;
    const result = pattern.test(event.target.value);
    if (result) {
      const inputElement = this.inputData.nativeElement.getElementsByClassName('input-number-card-data');
      if (id === 1 && event.target.value > 12) {
        const selected = inputElement.namedItem(`input-data-${id}`);
        this.renderer.setProperty(selected, 'value', '');
        // @ts-ignore
        this.f.numberData.value = '';
      }
      if (id === 2 && this.myGroup.controls.numberData.valid && this.myGroup.controls.numberYear.valid) {
        this.controlValidDate();
      } else {
        const selected = inputElement.namedItem(`input-data-${id + 1}`);
        if (selected === null) {
        } else {
          selected.parentElement.focus();
        }
      }
    }
    if (event.target.value.toString().length === 0) {
      const inputElement = this.inputData.nativeElement.getElementsByClassName('input-number-card-data');
      const selected = inputElement.namedItem(`input-data-${id - 1}`);
      if (selected === null) {
      } else {
        selected.parentElement.focus();
      }
    }
  }
  controlValidDate() {
    const nowMount = this.transform(String(new Date())).slice(0, 2);
    const nowYear = this.transform(String(new Date())).slice(2, 4);
    const mount = this.myGroup.controls.numberData.value;
    const year = this.myGroup.controls.numberYear.value;
    if (mount === '' || year === '' || mount === null || year === null || mount.length <= 1 || year.ltngth <= 1) {
      this.errorFormatDate = true;
      this.errorValidDate = false;
    } else if (+nowYear > +year || (+nowMount > mount && +nowYear === +year)) {
      this.errorValidDate = true;
      this.errorFormatDate = false;
    } else {
      this.errorFormatDate = false;
      this.errorValidDate = false;
    }
  }
  transform(value: string) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'MMyy');
    return value;
  }
  // ________методы относящеесяк Credit Card – back
  numericCVV(event: KeyboardEvent): boolean {
    const pattern = /^\d{1}$/;
    const result = pattern.test(event.key);
    return result;
  }
  keyboardNumber(num: number) {
    this.errorCodeCVV = false;
    const inputElement = this.inputCVVCode.nativeElement.getElementsByClassName('input-cvv-card');
    const selected = inputElement.namedItem('cvv');
    this.renderer.setProperty(selected, 'value', selected.value + num);
    if (selected.value.toString().length <= 3) {
      this.randomVisibleBlock();
      this.focusCVV = true;
    }
  }
  focusInputActive(e) {
    this.focusCVV = true;
    this.validForm = false;
    e.target.value = '';
    this.randomVisibleBlock();
  }
  randomVisibleBlock() {
    this.keyboard = this.keyboard.sort((a, b) => {
      return Math.random() - 0.5;
    });
  }
  deleteNumberInputCvv() {
    const inputElement = this.inputCVVCode.nativeElement.getElementsByClassName('input-cvv-card');
    const selected = inputElement.namedItem('cvv');
    console.log(selected.value);
    this.renderer.setProperty(selected, 'value', selected.value.substring(0, selected.value.length - 1));
    console.log(selected.value);
  }
  @HostListener('click', ['$event']) closeKeyboard(event) {
    if (
      event.target.classList.contains('item-number') ||
      event.target.classList.contains('delete-icon') ||
      event.target.classList.contains('input-cvv-card')) {
      setTimeout(() => {
        const inputElement = this.inputCVVCode.nativeElement.getElementsByClassName('input-cvv-card');
        const selected = inputElement.namedItem('cvv');
        if (selected.value.toString().length === 3) {
          this.focusCVV = false;
          this.validForm = true;
        }
      });
    } else {
      this.focusCVV = false;
    }
  }
}

