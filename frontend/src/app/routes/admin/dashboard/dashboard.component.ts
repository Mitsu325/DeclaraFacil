import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexTitleSubtitle, ApexXAxis, NgApexchartsModule } from 'ng-apexcharts';
import { RequestsService } from '../../../shared/services/api/requests.service';
import { NgToastService } from 'ng-angular-popup';
import { TimeFormatPipe } from '../../../core/pipes/time-format.pipe';

interface RequestOverview {
  totalRequests: number;
  pendingRequests: number;
  approvalRate: number;
  averageCompletionTime: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatFormField,
    MatSelectModule,
    TimeFormatPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedMonthYear: string = '';
  monthYearOptions: string[] = [];
  overview: RequestOverview = {
    totalRequests: 0,
    pendingRequests: 0,
    approvalRate: 0,
    averageCompletionTime: 0,
  };

  toast = inject(NgToastService);

  tiposSolicitacoes = [
    { tipo: 'Financeira', quantidade: 50 },
    { tipo: 'Documental', quantidade: 30 },
    { tipo: 'Técnica', quantidade: 40 }
  ];
  solicitacoesPorDia = [
    { dia: '01', quantidade: 5 },
    { dia: '02', quantidade: 8 },
    { dia: '03', quantidade: 12 },
    { dia: '04', quantidade: 15 },
    { dia: '05', quantidade: 10 },
    { dia: '06', quantidade: 20 },
    { dia: '07', quantidade: 18 }
  ];

  barChartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
  } = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
      },
      xaxis: {
        categories: [],
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: '',
        align: 'left',
      },
    };

  lineChartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
  } = {
      series: [],
      chart: {
        type: 'line',
        height: 350,
      },
      xaxis: {
        categories: [],
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: '',
        align: 'left',
      },
    };

  constructor(
    private requestsService: RequestsService
  ) { }

  ngOnInit(): void {

    const currentDate = new Date();
    const currentMonthYear = `${currentDate.toLocaleString('default', { month: '2-digit' })}/${currentDate.getFullYear()}`;
    this.selectedMonthYear = currentMonthYear;

    this.generateMonthYearOptions();

    this.loadOverview();

    this.barChartOptions = {
      series: [
        {
          name: 'Quantidade',
          data: this.tiposSolicitacoes.map((item) => item.quantidade),
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      xaxis: {
        categories: this.tiposSolicitacoes.map((item) => item.tipo),
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: 'Tipos de Solicitações',
        align: 'left',
      },
    };

    this.lineChartOptions = {
      series: [
        {
          name: 'Solicitações',
          data: this.solicitacoesPorDia.map((item) => item.quantidade),
        },
      ],
      chart: {
        type: 'line',
        height: 350,
      },
      xaxis: {
        categories: this.solicitacoesPorDia.map((item) => item.dia),
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: 'Solicitações por Dia',
        align: 'left',
      },
    };
  }

  generateMonthYearOptions() {
    const currentDate = new Date();
    const options: string[] = [];

    for (let i = 0; i < 6; i++) {
      const month = currentDate.toLocaleString('default', { month: '2-digit' });
      const year = currentDate.getFullYear();

      options.push(`${month}/${year}`);

      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    this.monthYearOptions = options.reverse();
  }

  loadOverview() {
    const [month, year] = this.selectedMonthYear.split('/');

    this.requestsService.getRequestsOverview(month, year).subscribe({
      next: (data) => {
        this.overview = data;
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar os dados gerais de solicitações',
          5000
        );
      },
    });
  }

  onMonthYearChange() {
    this.loadOverview();
  }
}
