import { Directive, ElementRef, Renderer2, DoCheck } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[validateFormControl]'
})
export class FormFieldStateClassDirective implements DoCheck {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  ngDoCheck(): void {
    const control = this.control?.control;
    if (!control) return;

    // Remove classes anteriores
    this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
    this.renderer.removeClass(this.el.nativeElement, 'is-valid');
    this.renderer.removeClass(this.el.nativeElement, 'ng-dirty');

    if (control.dirty || control.touched) {
      if (control.invalid) {
        this.renderer.addClass(this.el.nativeElement, 'is-invalid');
        this.renderer.addClass(this.el.nativeElement, 'ng-dirty');
      } else {
        this.renderer.addClass(this.el.nativeElement, 'is-valid');
      }
    }
  }
}