import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
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
  isSubmittedCard = false;
  isSubmittedData = false;
  visaSystemLogo = false;
  masterCardSystemLogo = false;
  errorDate = false;
  errorCodeCVV = false;
  focusCVV = false;
  validForm = false;
  cvvCodeUserData: number;
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
  }

  next() {
    this.controlValidDate();
    if (this.myGroup.invalid) {
      this.isSubmittedCard = true;
      this.toggleCard = false;
      return;
    }
    if (this.myGroup.valid === !this.errorDate) {
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
      this.isSubmittedCard = true;
    } else {
      const userData = new UserData();
      userData.numberCard = this.f.number1.value + this.f.number2.value + this.f.number3.value + this.f.number4.value;
      userData.ValidTo = this.f.numberData.value + this.f.numberYear.value;
      userData.cvvCode = this.cvvCodeUserData;
      this.myGroup.reset();
      this.modal = true;
      this.toggleCard = false;
      this.validForm = false;
    }
  }

  // ____form___________
  createFormGroup() {
    return this.myGroup = this.fb.group({
      number1: ['', [Validators.required, Validators.minLength(4), Validators.minLength(4)]],
      number2: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      number3: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      number4: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      numberData: ['', [Validators.required, Validators.maxLength(2), Validators.minLength(2)]],
      numberYear: ['', [Validators.required, Validators.maxLength(2), Validators.minLength(2)]],
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

  nextInput(event, id?: number) {
    const pattern = /^\d{4,4}$/;
    const result = pattern.test(event.target.value);
    if (result) {
      this.isSubmittedCard = false;
      if (id === 1) {
        this.visibleLogoPaymentSystem(event);
      }
      const vc = +event.target.value;
      if (typeof vc === 'number') {
        const inputElement = this.input.nativeElement.getElementsByClassName('input-number-card');
        const selected = inputElement.namedItem(`input-${id + 1}`);
        if (selected === null) {
        } else {
          selected.parentElement.focus();
        }
      }
    }
    if (event.target.value.toString().length === 0) {
      this.isSubmittedCard = false;
      const inputElement = this.input.nativeElement.getElementsByClassName('input-number-card');
      const selected = inputElement.namedItem(`input-${id - 1}`);
      if (selected === null) {
      } else {
        selected.parentElement.focus();
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
      this.isSubmittedData = false;
      const inputElement = this.inputData.nativeElement.getElementsByClassName('input-number-card-data');
      if (id === 1 && event.target.value > 12) {
        const selected = inputElement.namedItem(`input-data-${id}`);
        this.renderer.setProperty(selected, 'value', '');
        // @ts-ignore
        this.f.numberData.value = '';
      }
      if (id === 1 && event.target.value.length <= 1) {
        this.errorDate = true;
      } else {
        this.errorDate = false;
        this.isSubmittedCard = false;
      }
      if (id === 2 && this.myGroup.controls.numberData.valid && this.myGroup.controls.numberYear.valid) {
        this.controlValidDate();
      } else {
        this.errorDate = false;
        const selected = inputElement.namedItem(`input-data-${id + 1}`);
        if (selected === null) {
        } else {
          selected.parentElement.focus();
        }
      }
    }
    if (event.target.value.toString().length === 0) {
      this.isSubmittedData = false;
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
    if (+nowYear > +year || (+nowMount > mount && +nowYear === +year) || mount === '' || mount === '00' || year === '') {
      this.errorDate = true;
      this.isSubmittedData = true;
    } else {
      this.errorDate = false;
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
    this.randomVisibleBlock();
    if (selected.value.toString().length === 3) {
      this.focusCVV = false;
      this.validForm = true;
      this.cvvCodeUserData = selected.value;
    }
  }

  focusInputActive(e) {
    this.focusCVV = true;
    this.validForm = false;
    e.target.value = '';
  }

  randomVisibleBlock() {
    const arr = [];
    const elementBlock = this.divElement.nativeElement.querySelectorAll('.item');
    for (let i = 0; i < elementBlock.length; i++) {
      arr.push(elementBlock[i]);
    }
    const sortItem = arr.sort((a, d) => {
      return Math.random() - 1.5;
    });
    const ele = this.divElement.nativeElement.getElementsByClassName('position-keyboard');
    for (const index in sortItem) {
      this.renderer.appendChild(ele[0], sortItem[index]);
    }
  }

  cvvCodeInput(event) {
    const pattern = /^\d{3,3}$/;
    const result = pattern.test(event.target.value);
    if (result || event.target.value.length === 3) {
      this.focusCVV = false;
      this.validForm = true;
      this.errorCodeCVV = false;
    } else {
      this.errorCodeCVV = true;
      this.focusCVV = true;
      this.validForm = false;
    }
  }
}
