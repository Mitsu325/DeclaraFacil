import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexTitleSubtitle, ApexXAxis, NgApexchartsModule } from 'ng-apexcharts';
import { RequestsService } from '../../../shared/services/api/requests.service';
import { NgToastService } from 'ng-angular-popup';
import { TimeFormatPipe } from '../../../core/pipes/time-format.pipe';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
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
  barChartIsLoading = true;
  noRequestsMessage = false;

  toast = inject(NgToastService);

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
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    title: ApexTitleSubtitle;
  } = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
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

    this.loadRequestsByDeclaration();

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

  loadRequestsByDeclaration() {
    const [month, year] = this.selectedMonthYear.split('/');

    this.barChartIsLoading = true;
    this.noRequestsMessage = false;

    this.requestsService.getRequestsByDeclaration(month, year).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.barChartOptions = {
            series: [
              {
                name: 'Quantidade',
                data: data.map((item: any) => item.totalRequests),
              },
            ],
            chart: {
              type: 'bar',
              height: 350,
            },
            plotOptions: {
              bar: {
                horizontal: true
              }
            },
            xaxis: {
              categories: data.map((item: any) => item.declarationType),
              labels: {
                style: {
                  fontSize: '12px',
                },
              },
            },
            dataLabels: {
              enabled: true,
            },
            title: {
              text: '',
              align: 'left',
            },
          };

          this.noRequestsMessage = false;

        } else {
          this.noRequestsMessage = true;
        }

        this.barChartIsLoading = false;
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar os dados de solicitações por declaração',
          5000
        );

        this.barChartIsLoading = false;
      },
    });
  }

  onMonthYearChange() {
    this.loadOverview();
    this.loadRequestsByDeclaration();
  }
}
