import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cep',
  standalone: true,
})
export class CepPipe implements PipeTransform {
  transform(value: string | number): string {
    let cep = value + '';
    cep = cep.replace(/\D/g, '');

    if (cep.length !== 8) {
      return cep;
    }

    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
}
