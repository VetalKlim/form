import {animate, keyframes, style, transition, trigger} from '@angular/animations';
export const fadingAwayAnimate = trigger('fadingAwayAnimate', [
  transition(':enter', [
    animate('0.5s', keyframes([
      style({
        offset: 0,
        opacity: 0
      }),
      style({
        offset: 1,
        opacity: 1
      })
    ]))
  ]),
  transition(':leave', [
    animate('0.5s', keyframes([
      style({
        offset: 0,
        opacity: 1
      }),
      style({
        offset: 1,
        opacity: 0
      })
    ]))
  ])
]);
export const hiddenAnimate = trigger('', [
  transition(':leave', [
    animate('0.5s', keyframes([
      style({
        offset: 0,
        opacity: 1
      }),
      style({
        offset: 1,
        opacity: 0
      })
    ]))
  ])
]);
export const showAnimate = trigger('showAnimate', [
  transition(':enter', [
    animate('0.5s', keyframes([
      style({
        offset: 0,
        opacity: 0
      }),
      style({
        offset: 1,
        opacity: 1
      })
    ]))
  ])
]);
