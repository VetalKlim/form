import {AfterContentChecked, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
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
export class FormOfPaymentComponent implements OnInit, AfterContentChecked {
  toggleCard = false;
  myGroup: FormGroup;
  isSubmittedCard = false;
  isSubmittedData = false;
  visaSystemLogo = false;
  masterCardSystemLogo = false;
  errorDate = false;
  focusCVV = false;
  validForm = false;
  cvvCodeUserData: number;
  modal = false;
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
  ngAfterContentChecked(): void {
  }
  next() {
    if (this.myGroup.invalid) {
      this.errorDate = true;
      this.isSubmittedCard = true;
      this.toggleCard = false;
    } else {
      this.errorDate = false;
      this.toggleCard = true;
      this.isSubmittedData = false;
      this.isSubmittedCard = false;
    }
  }
  back() {
    this.toggleCard = false;
    this.focusCVV = false;
    this.validForm = false;
  }
  submit() {
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
  transform(value: string) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'MMyy');
    return value;
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
      const inputElement = this.input.nativeElement.getElementsByClassName('input-number-card');
      const selected = inputElement.namedItem(`input-${id + 1}`);
      if (selected === null) {
      } else {
        selected.parentElement.focus();
      }
    }
    if (!result) {
      event.target.value = event.target.value.slice(0, 4);
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
      } else if (id === 2 && this.myGroup.controls.numberData.valid && this.myGroup.controls.numberYear.valid) {
        this.controlValidDate();
      } else {
        this.errorDate = false;
        const selected = inputElement.namedItem(`input-data-${id + 1}`);
        if (selected === null) {
        } else {
          selected.parentElement.focus();
        }
      }
    } else {
      event.target.value = event.target.value.slice(0, 2);
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
    const nawMount = this.transform(String(new Date())).slice(0, 2);
    const nawYear = this.transform(String(new Date())).slice(2, 4);
    const mount = this.myGroup.controls.numberData.value;
    const year = this.myGroup.controls.numberYear.value;
    if (+nawYear > +year || (+nawMount > mount && +nawYear === +year) || +mount === 0) {
      this.errorDate = true;
    } else {
      this.errorDate = false;
    }
  }
  // ________методы относящеесяк Credit Card – back
  numericCVV(event: KeyboardEvent): boolean {
    const pattern = /^\d{1}$/;
    const result = pattern.test(event.key);
    return result;
  }
  keyboardNumber(num: number) {
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
  trackInput(e) {
    if (e.target.value.length === 3) {
      this.focusCVV = false;
      this.validForm = true;
    } else {
      this.focusCVV = true;
      this.validForm = false;
    }
  }
}
